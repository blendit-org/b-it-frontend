import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  PlusCircle,
  MessageSquareText,
  Trash2,
  MessageCircle,
  ArrowBigUp,
  ArrowBigDown,
  CheckCircle2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
// import { useNavigate } from "react-router";

// --- API Service Logic (Integrated into this file) ---

// const API_BASE = "http://127.0.0.1:8000"; 
const API_BASE = import.meta.env.VITE_COMMUNITY_API_BASE as string;
const WS_BASE = import.meta.env.VITE_WS_BASE as string;

// --- Type Definitions ---
export type TagResponse = { id: number; name: string; };
export type AnswerResponse = { id: number; question_id: number; userId: string; content: string; createdAt: string; votes: number; is_accepted: boolean; };
export type QuestionResponse = { id: number; userId: string; title: string; content: string; tags: TagResponse[]; createdAt: string; votes: number; };
export type QuestionDetailResponse = QuestionResponse & { answers: AnswerResponse[]; };
export type PaginatedQuestionsResponse = { questions: QuestionResponse[]; total: number; };
export type ChatMessageData = { id: number; userId: string; message: string; createdAt: string; };
export type WebSocketMessage = { type: 'status' | 'chat_message'; message?: string; data?: ChatMessageData; };

// API Functions
const fetchQuestions = async (page = 1, limit = 5) => {
  const res = await fetch(`${API_BASE}/questions?skip=${(page - 1) * limit}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json() as Promise<PaginatedQuestionsResponse>;
};
const fetchQuestionDetails = async (questionId: number) => {
    const res = await fetch(`${API_BASE}/questions/${questionId}`);
    if (!res.ok) throw new Error("Failed to fetch question details");
    return res.json() as Promise<QuestionDetailResponse>;
}
const createQuestion = async (userId: string, title: string, content: string, tags: string[]) => {
  const res = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, content, tags }),
  });
  if (!res.ok) throw new Error("Failed to create question");
  return res.json() as Promise<QuestionResponse>;
};
const deleteQuestion = async (questionId: number) => {
    await fetch(`${API_BASE}/questions/${questionId}`, { method: "DELETE" });
};
const addAnswer = async (questionId: number, userId: string, content: string) => {
    const res = await fetch(`${API_BASE}/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content }),
      });
      if (!res.ok) throw new Error("Failed to add answer");
      return res.json() as Promise<AnswerResponse>;
}
const voteOn = async (type: 'questions' | 'answers', id: number, direction: 1 | -1) => {
    const res = await fetch(`${API_BASE}/${type}/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
    });
    if (!res.ok) throw new Error(`Failed to vote on ${type}`);
    return res.json();
}
const acceptAnswer = async (answerId: number, userId: string) => {
    const res = await fetch(`${API_BASE}/answers/${answerId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error("Failed to accept answer");
    return res.json() as Promise<AnswerResponse>;
}
const fetchChatHistory = async () => {
    const res = await fetch(`${API_BASE}/chat`);
    if (!res.ok) throw new Error("Failed to fetch chat history");
    return res.json() as Promise<ChatMessageData[]>;
};
const deleteChatMessage = async (messageId: number) => {
    await fetch(`${API_BASE}/chat/${messageId}`, { method: "DELETE" });
}

// --- End of API Service Logic ---


const glass = "backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border border-white/10 shadow-xl";
const orangeGrad = "";

const getUserId = () => {
    let id = localStorage.getItem("userId");
    if (!id) {
        id = `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("userId", id);
    }
    return id;
};


export default function Community() {
  const [userId] = useState<string>(getUserId());

  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [questionDetails, setQuestionDetails] = useState<Record<number, QuestionDetailResponse & { _open?: boolean }>>({});
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  
  const [answerInputs, setAnswerInputs] = useState<Record<number, string>>({});
  const [chat, setChat] = useState<ChatMessageData[]>([]);
  const [chatMsg, setChatMsg] = useState("");
  const [isWsConnected, setIsWsConnected] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  // const navigate = useNavigate();
  // const email = localStorage.getItem("email");

  //!will need it later

  // useEffect(() => {
  //   if (!email) {
  //     navigate("/login");
  //     toast.error("You need to Login First");
  //   }
  // }, [email, navigate]);

  const QUESTIONS_PER_PAGE = 5;

  // --- Data Fetching ---
  const loadQuestions = async (pageNum = 1) => {
    try {
      const data = await fetchQuestions(pageNum, QUESTIONS_PER_PAGE);
      setQuestions(data.questions || []);
      setTotalQuestions(data.total || 0);
    } catch (err) {
      toast.error("Failed to load questions.");
      console.error(err);
    }
  };

  const loadQuestionDetails = async (questionId: number) => {
    try {
        const details = await fetchQuestionDetails(questionId);
        setQuestionDetails(prev => ({ ...prev, [questionId]: { ...prev[questionId], ...details } }));
    } catch (err) {
        toast.error(`Failed to load details for question #${questionId}`);
        console.error(err);
    }
  }

  useEffect(() => {
    loadQuestions(page);
  }, [page]);

  // --- WebSocket Logic for Real-time Chat ---
  useEffect(() => {
    if (!userId) return;

    fetchChatHistory().then(setChat).catch(err => console.error("Failed to fetch chat history", err));
    
    ws.current = new WebSocket(`${WS_BASE}/ws/chat`);
    
    ws.current.onopen = () => { 
        console.log("WebSocket connected"); 
        setIsWsConnected(true); 
    };
    
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data) as WebSocketMessage;
      if (msg.type === 'chat_message' && msg.data) {
        setChat((prevChat) => [...prevChat, msg.data!]);
      } else if (msg.type === 'status') {
        toast.info(msg.message);
      }
    };
    
    ws.current.onclose = (event) => { 
        console.log(`WebSocket disconnected: Code=${event.code}, Reason='${event.reason}'`); 
        setIsWsConnected(false); 
    };
    
    ws.current.onerror = (error) => { 
        console.error("WebSocket error:", error); 
        toast.error("Chat connection failed. Please ensure the backend server is running."); 
    };

    return () => { 
        ws.current?.close();
    };
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // --- CRUD Operations ---
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !userId) return;
    setCreating(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      await createQuestion(userId, title, content, tagList);
      setTitle(""); setContent(""); setTags("");
      await loadQuestions(1);
      setPage(1);
      toast.success("Question posted successfully!");
    } catch (e) {
      toast.error("Failed to create question.");
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
        await deleteQuestion(questionId);
        setQuestions(q => q.filter(q => q.id !== questionId));
        setTotalQuestions(t => t - 1);
        toast.success("Question deleted.");
    } catch(e) {
        toast.error("Failed to delete question.");
        console.error(e);
    }
  }

  const handleAddAnswer = async (questionId: number) => {
    const text = (answerInputs[questionId] || "").trim();
    if (!text || !userId) return;
    try {
        await addAnswer(questionId, userId, text);
        setAnswerInputs(ci => ({ ...ci, [questionId]: "" }));
        await loadQuestionDetails(questionId);
    } catch(e) {
        toast.error("Failed to post answer.");
        console.error(e);
    }
  }

  const handleVote = async (type: 'questions' | 'answers', id: number, direction: 1 | -1) => {
    try {
        await voteOn(type, id, direction);
        await loadQuestions(page);
        Object.keys(questionDetails).forEach(qid => loadQuestionDetails(Number(qid)));
    } catch(e) {
        toast.error("Vote failed.");
        console.error(e);
    }
  }

  const handleAcceptAnswer = async (answerId: number, questionId: number) => {
    if (!userId) return;
    try {
        await acceptAnswer(answerId, userId);
        await loadQuestionDetails(questionId);
    } catch(e) {
        toast.error("Failed to accept answer.");
        console.error(e);
    }
  }

  const sendChatMessage = () => {
    const text = chatMsg.trim();
    if (text && ws.current?.readyState === WebSocket.OPEN) {
      const payload = {
        userId: userId,
        message: text,
      };
      ws.current.send(JSON.stringify(payload));
      setChatMsg("");
    }
  };
  
  const handleDeleteChatMessage = async (id: number) => {
    try {
        await deleteChatMessage(id);
        setChat(c => c.filter(msg => msg.id !== id));
    } catch (e) {
        toast.error("Failed to delete message.");
        console.error(e);
    }
  }
  
  return (
    <div className="min-h-screen w-full bg-transparent text-white antialiased selection:bg-orange-500/20">
      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className={`w-full ${orangeGrad} h-[3px]`} />
        <div className="px-4 md:px-8 py-4">
          <div className={`rounded-2xl ${glass} px-4 py-3 flex items-center justify-between`}>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              <span className="bg-clip-text text-orange-500">Community Hub</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-md px-3 py-2 sm:px-4 sm:py-1.5 transition-all hover:bg-white/10">
              <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">User ID</span>
              <Input value={userId || ''} readOnly className="h-10 sm:h-8 w-full sm:w-[160px] bg-transparent focus:ring-2 focus:ring-orange-400/50 border border-white/15 text-white placeholder:text-white/50 rounded-lg transition-all" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="px-4 md:px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Column */}
        <section className="lg:col-span-1 w-full">
          <Card className={`rounded-3xl ${glass} h-[78vh] flex flex-col`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <MessageSquareText className="h-5 w-5 text-orange-300 shrink-0" />
                <span className="truncate">Realtime Chat</span>
                <Badge className={`ml-auto border border-orange-400/20 whitespace-nowrap ${isWsConnected ? "bg-orange-500 text-white animate-pulse" : "bg-gray-500/20 text-gray-300"}`}>
                  {isWsConnected ? "live" : "offline"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <Separator className="bg-white/10" />
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea ref={chatContainerRef} className="h-full px-4 py-3">
                <div className="space-y-3">
                  {chat.length === 0 ? (
                    <EmptyState label="No messages yet. Start the conversation!" />
                  ) : (
                    chat.map((m) => (
                        <ChatMessage key={m.id} msg={m} currentUserId={userId} onDelete={handleDeleteChatMessage}/>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <Separator className="bg-white/10" />
            <div className="p-3 flex items-center gap-2">
              <Input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                placeholder="Type a message…"
                className="bg-transparent border-white/15 focus-visible:ring-orange-500/40 flex-1 min-w-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
                }}
              />
              <Button onClick={sendChatMessage} disabled={!isWsConnected || !chatMsg.trim()} className={`${orangeGrad} text-white border-0 shadow-lg shrink-0`}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </section>

        {/* Questions Column */}
        <section className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[80vh] p-2">
          <Card className={`rounded-3xl ${glass}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-orange-300" /> <span>Ask a Question</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuestion} className="space-y-3">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's your question? Be specific." className="bg-transparent border-white/15 focus-visible:ring-orange-500/40" />
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe the problem or what you want to know in detail..." className="min-h-[96px] bg-transparent border-white/15 focus-visible:ring-orange-500/40" />
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (e.g. python, fastapi, react)" className="bg-transparent border-white/15 focus-visible:ring-orange-500/40" />
                <div className="flex items-center justify-between">
                  <div className={`h-2 rounded-full w-24 ${orangeGrad}`} />
                  <Button type="submit" disabled={creating || !title.trim() || !content.trim()} className={`${orangeGrad} text-white border-0 shadow-lg hover:opacity-95`}>
                    {creating ? "Posting…" : "Ask Question"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {questions.length === 0 ? (
              <EmptyState label="No questions yet. Be the first to ask!" />
            ) : (
              questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  details={questionDetails[q.id]}
                  answerValue={answerInputs[q.id] || ""}
                  onChangeAnswer={(v:any) => setAnswerInputs((ci) => ({ ...ci, [q.id]: v }))}
                  onSubmitAnswer={() => handleAddAnswer(q.id)}
                  onToggleOpen={() => {
                    if(!questionDetails[q.id]) { loadQuestionDetails(q.id); }
                    setQuestionDetails(prev => ({...prev, [q.id]: { ...prev[q.id], _open: !prev[q.id]?._open }}));
                  }}
                  onVote={handleVote}
                  onAcceptAnswer={(answerId:any) => handleAcceptAnswer(answerId, q.id)}
                  onDeleteQuestion={() => handleDeleteQuestion(q.id)}
                  currentUserId={userId}
                />
              ))
            )}
          </div>

          {totalQuestions > QUESTIONS_PER_PAGE && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <span className="text-sm text-white/70">Page {page} of {Math.ceil(totalQuestions / QUESTIONS_PER_PAGE)}</span>
              <Button onClick={() => setPage((p) => p + 1)} disabled={page * QUESTIONS_PER_PAGE >= totalQuestions}>Next</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// --- Child Components (FIX: Wrapped in React.memo for performance optimization) ---

const ChatMessage = React.memo(function ChatMessage({ msg, currentUserId, onDelete }: { msg: ChatMessageData, currentUserId?: string, onDelete: (id: number) => void }) {
    const isMine = msg.userId === currentUserId;
    return (
        <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
            {!isMine && (
                <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 border border-white/10 shrink-0"><AvatarFallback className="bg-orange-500/20 text-orange-200">{(msg.userId?.slice(0, 2) || "??").toUpperCase()}</AvatarFallback></Avatar>
                    <div className={`${glass} relative rounded-2xl px-3 py-2 break-words whitespace-pre-wrap`}>
                        <span className="absolute left-[-6px] top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white/20 border-b-8 border-b-transparent" />
                        <div className="text-xs text-white/60 mb-0.5">{msg.userId} • {new Date(msg.createdAt).toLocaleString()}</div>
                        <div className="text-sm leading-relaxed">{msg.message}</div>
                    </div>
                </div>
            )}
            {isMine && (
                <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="relative bg-orange-500/20 text-orange-100 rounded-2xl px-3 py-2 break-words whitespace-pre-wrap">
                        <span className="absolute right-[-6px] top-3 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-orange-500/20 border-b-8 border-b-transparent" />
                        <div className="text-xs text-white/60 mb-0.5">{msg.userId} • {new Date(msg.createdAt).toLocaleString()}</div>
                        <div className="text-sm leading-relaxed">{msg.message}</div>
                    </div>
                    <Button onClick={() => onDelete(msg.id)} variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-300 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                </div>
            )}
        </div>
    );
});

const QuestionCard = React.memo(function QuestionCard({ question, details, answerValue, onChangeAnswer, onSubmitAnswer, onToggleOpen, onVote, onAcceptAnswer, onDeleteQuestion, currentUserId }: any) {
    const isOpen = details?._open;
    const answers = details?.answers || [];
  
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`rounded-3xl ${glass}`}>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex flex-col items-center gap-1">
                <Button onClick={() => onVote('questions', question.id, 1)} variant="ghost" className="h-7 w-7 p-0 hover:bg-orange-500/20 text-white/70 hover:text-white"><ArrowBigUp/></Button>
                <span className="font-bold text-lg">{question.votes}</span>
                <Button onClick={() => onVote('questions', question.id, -1)} variant="ghost" className="h-7 w-7 p-0 hover:bg-orange-500/20 text-white/70 hover:text-white"><ArrowBigDown/></Button>
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10"><AvatarFallback className="bg-orange-500/20 text-orange-200">{(question.userId?.slice(0, 2) || "??").toUpperCase()}</AvatarFallback></Avatar>
                        <div>
                            <CardTitle className="text-base leading-tight">{question.title}</CardTitle>
                            <div className="text-xs text-white/60">by {question.userId} • {new Date(question.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                    {question.userId === currentUserId && (
                        <Button onClick={onDeleteQuestion} variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>
                    )}
                </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="ml-[52px] text-sm md:text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">{question.content}</p>
            <div className="ml-[52px] mt-3 flex flex-wrap gap-2">
                {question.tags.map((tag: any) => <Badge key={tag.id} variant="secondary" className="bg-white/10 text-white/80 border-none">{tag.name}</Badge>)}
            </div>
            <div className="ml-[52px] mt-4">
              <Button variant="ghost" onClick={onToggleOpen} className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/10">
                <MessageCircle className="h-4 w-4 mr-2" /> {isOpen ? "Hide" : "Show"} answers ({answers.length})
              </Button>
            </div>
  
            {isOpen && (
              <div className="mt-3 space-y-3 pl-[52px]">
                <Separator className="bg-white/10" />
                <div className="space-y-3 pt-2">
                  {answers.length === 0 ? (
                    <EmptyState label="No answers yet." small />
                  ) : (
                    answers.map((ans: any) => (
                      <AnswerCard key={ans.id} answer={ans} onVote={onVote} onAccept={onAcceptAnswer} currentUserId={currentUserId} questionAuthorId={question.userId}/>
                    ))
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    value={answerValue}
                    onChange={(e) => onChangeAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmitAnswer(); }
                    }}
                    placeholder="Write an answer…"
                    className="bg-transparent border-white/15 focus-visible:ring-orange-500/40"
                  />
                  <Button onClick={onSubmitAnswer} disabled={!answerValue.trim()} className={`${orangeGrad} text-white border-0 shadow-lg`}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
});

const AnswerCard = React.memo(function AnswerCard({ answer, onVote, onAccept, currentUserId, questionAuthorId }: any) {
    const canAccept = currentUserId === questionAuthorId;
    return (
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
                <Button onClick={() => onVote('answers', answer.id, 1)} variant="ghost" className="h-7 w-7 p-0 hover:bg-orange-500/20 text-white/70 hover:text-white"><ArrowBigUp/></Button>
                <span className="font-bold">{answer.votes}</span>
                <Button onClick={() => onVote('answers', answer.id, -1)} variant="ghost" className="h-7 w-7 p-0 hover:bg-orange-500/20 text-white/70 hover:text-white"><ArrowBigDown/></Button>
                {answer.is_accepted && <CheckCircle2 className="h-6 w-6 text-green-400 mt-1"/>}
            </div>
            <div className={`flex-1 rounded-lg ${glass} px-3 py-2 text-sm border ${answer.is_accepted ? 'border-green-400/50' : 'border-transparent'}`}>
                <div className="text-xs text-white/60 flex justify-between items-center">
                    <span>{answer.userId} • {new Date(answer.createdAt).toLocaleString()}</span>
                    {canAccept && !answer.is_accepted && (
                        <Button onClick={() => onAccept(answer.id)} variant="ghost" className="h-auto px-2 py-1 text-xs text-green-400 hover:bg-green-500/20 hover:text-green-300">
                            <CheckCircle2 className="h-4 w-4 mr-1"/> Accept
                        </Button>
                    )}
                </div>
                <div className="break-words whitespace-pre-wrap mt-1">{answer.content}</div>
            </div>
        </div>
    );
});
  
function EmptyState({ label, small }: { label: string; small?: boolean }) {
    return <div className={`text-center ${small ? "text-xs" : "text-sm"} text-white/50 py-6`}>{label}</div>;
}
