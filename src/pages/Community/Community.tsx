import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  PlusCircle,
  MessageSquareText,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// FIX: Replaced environment variable with a hardcoded value to resolve compilation error.
const API_BASE = "http://localhost:8000";

export type PostResponse = {
  id: number;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type CommentResponse = {
  id: number;
  postId: number;
  userId: string;
  content: string;
  createdAt: string;
};

export type ChatMessageResponse = {
  id: number;
  userId: string;
  message: string;
  createdAt: string;
};

// const timeAgo = (input: string | Date) => {
//   const then = typeof input === "string" ? new Date(input).getTime() : input.getTime();
//   const now = Date.now();
//   const diff = Math.max(0, now - then);

//   const sec = Math.floor(diff / 1000);
//   if (sec < 5) return "just now";
//   if (sec < 60) return `${sec}s ago`;

//   const min = Math.floor(sec / 60);
//   if (min < 60) return `${min}m ago`;

//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr}h ago`;

//   const days = Math.floor(hr / 24);
//   if (days < 30) return `${days}d ago`;

//   const months = Math.floor(days / 30);
//   if (months < 12) return `${months}mo ago`;

//   const years = Math.floor(months / 12);
//   return `${years}y ago`;
// };


const glass = "backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border border-white/10 shadow-xl";
const orangeGrad = "";

export default function Community() {
  // FIX: Removed Redux dependency to resolve compilation error and make the component standalone.
  const {data: userInfo} = useUserInfoQuery(undefined);
  const userId = userInfo?.userId

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [creatingPost, setCreatingPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Record<number, CommentResponse[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [chat, setChat] = useState<ChatMessageResponse[]>([]);
  const [chatMsg, setChatMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [openPosts, setOpenPosts] = useState<Record<number, boolean>>({});
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

   const navigate = useNavigate();
  
    const email = localStorage.getItem("email");
          useEffect(() => {
            if (!email) {
              navigate("/login");
              toast.error("You need to Login First");
            }
          }, [email]);

  const POSTS_PER_PAGE = 5;

  // --- Fetch Posts ---
  const fetchPosts = async (pageNum = 1) => {
    try {
      const res = await fetch(`${API_BASE}/posts?skip=${(pageNum - 1) * POSTS_PER_PAGE}&limit=${POSTS_PER_PAGE}`);
      const data: { posts: PostResponse[]; total: number } = await res.json();
      setPosts(data.posts || []); // Ensure posts is an array
      setTotalPosts(data.total || 0);

      // Fetch comments for each post
      const allComments: Record<number, CommentResponse[]> = {};
      if (Array.isArray(data.posts)) {
        await Promise.all(
          data.posts.map(async (post) => {
            try {
              const cRes = await fetch(`${API_BASE}/posts/${post.id}/comments`);
              const cData: CommentResponse[] = await cRes.json();
              allComments[post.id] = Array.isArray(cData) ? cData : [];
            } catch (commentErr) {
              toast.error(`Failed to fetch comments for post ${post.id}:`)
               console.error(`Failed to fetch comments for post ${post.id}:`, commentErr);
               allComments[post.id] = []; // Avoid leaving it undefined on error
            }
          })
        );
      }
      setComments(allComments);
    } catch (err) {
      console.error(err);
      setPosts([]); // Reset on error
      setTotalPosts(0);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // --- Chat Polling ---
  const fetchChat = async () => {
    try {
      setChatLoading(true);
      const res = await fetch(`${API_BASE}/chat`);
      const data = await res.json();
      setChat(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setChat([]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
    const chatInterval = setInterval(fetchChat, 5000);
    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chat]);

  // --- Post CRUD ---
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setCreatingPost(true);
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, content }),
      });
      const data: PostResponse = await res.json();
      setPosts((p) => [data, ...p.slice(0, POSTS_PER_PAGE - 1)]);
      setTotalPosts(t => t + 1);
      setTitle("");
      setContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingPost(false);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await fetch(`${API_BASE}/posts/${postId}`, { method: "DELETE" });
      setPosts((p) => p.filter((post) => post.id !== postId));
      setTotalPosts(t => t - 1);
      setComments((c) => {
        const newC = { ...c };
        delete newC[postId];
        return newC;
      });
    } catch (e) {
      console.error(e);
    }
  };

  // --- Comment CRUD ---
  const addComment = async (postId: number) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    setCommentInputs((ci) => ({ ...ci, [postId]: "" }));
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content: text }),
      });
      const data: CommentResponse = await res.json();
      setComments((c) => ({
        ...c,
        [postId]: [...(c[postId] || []), data],
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteComment = async (commentId: number, postId: number) => {
    try {
      await fetch(`${API_BASE}/comments/${commentId}`, { method: "DELETE" });
      setComments((c) => ({
        ...c,
        [postId]: (c[postId] || []).filter((cmt) => cmt.id !== commentId),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // --- Chat CRUD ---
  const sendChat = async () => {
    const text = chatMsg.trim();
    if (!text) return;
    setSending(true);
    setChatMsg("");
    try {
      const res = await fetch(`${API_BASE}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: text }),
      });
      const data: ChatMessageResponse = await res.json();
      setChat((c) => [...c, data]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const deleteChat = async (chatId: number) => {
    try {
      await fetch(`${API_BASE}/chat/${chatId}`, { method: "DELETE" });
      setChat((c) => c.filter((msg) => msg.id !== chatId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-white antialiased selection:bg-orange-500/20">
      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className={`w-full ${orangeGrad} h-[3px]`} />
        <div className="px-4 md:px-8 py-4">
          <div className={`rounded-2xl ${glass} px-4 py-3 flex items-center justify-between`}>
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-black tracking-tight"
            >
              <span className="bg-clip-text text-orange-500">Community Hub</span>
            </motion.h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-md px-3 py-2 sm:px-4 sm:py-1.5 transition-all hover:bg-white/10">
              <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">User ID</span>
              <Input value={userId} readOnly className="h-10 sm:h-8 w-full sm:w-[160px] bg-transparent focus:ring-2 focus:ring-orange-400/50 border border-white/15 text-white placeholder:text-white/50 rounded-lg transition-all" placeholder={userId} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="px-4 md:px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Column */}
       <section className="lg:col-span-1 w-full">
  <Card className={`rounded-3xl ${glass} h-[78vh] flex flex-col`}>
    {/* Header */}
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <MessageSquareText className="h-5 w-5 text-orange-300 shrink-0" />
        <span className="truncate">Realtime Chat</span>
        <Badge className="ml-auto bg-orange-500/20 text-orange-300 border border-orange-400/20 whitespace-nowrap">
          {chatLoading ? "syncing…" : "live"}
        </Badge>
      </CardTitle>
    </CardHeader>

    <Separator className="bg-white/10" />

    {/* Chat Messages */}
    <CardContent className="flex-1 overflow-hidden p-0">
      <ScrollArea ref={chatContainerRef} className="h-full px-4 py-3">
        <div className="space-y-3">
          {chat.length === 0 ? (
            <EmptyState label="No messages yet. Start the conversation!" />
          ) : (
            chat.map((m) => {
              const isMine = m.userId === userId;
              return (
                <div
                  key={m.id}
                  className={`flex w-full ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Other Users */}
                  {!isMine && (
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                        <AvatarFallback className="bg-orange-500/20 text-orange-200">
                          {(m.userId?.slice(0, 2) || "??").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`${glass} relative rounded-2xl px-3 py-2 break-words whitespace-pre-wrap`}
                      >
                        {/* Tail */}
                        <span className="absolute left-[-6px] top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white/20 border-b-8 border-b-transparent" />
                        <div className="text-xs text-white/60 mb-0.5">
                          {m.userId} • {new Date(m.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {m.message}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* My Messages */}
                  {isMine && (
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div className="relative bg-orange-500/20 text-orange-100 rounded-2xl px-3 py-2 break-words whitespace-pre-wrap">
                        {/* Tail */}
                        <span className="absolute right-[-6px] top-3 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-orange-500/20 border-b-8 border-b-transparent" />
                        <div className="text-xs text-white/60 mb-0.5">
                          {m.userId} • {new Date(m.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {m.message}
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteChat(m.id)}
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </CardContent>

    <Separator className="bg-white/10" />

    {/* Input */}
    <div className="p-3 flex items-center gap-2">
      <Input
        value={chatMsg}
        onChange={(e) => setChatMsg(e.target.value)}
        placeholder="Type a message…"
        className="bg-transparent border-white/15 focus-visible:ring-orange-500/40 flex-1 min-w-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChat();
          }
        }}
      />
      <Button
        onClick={sendChat}
        disabled={sending || !chatMsg.trim()}
        className={`${orangeGrad} text-white border-0 shadow-lg shrink-0`}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  </Card>
</section>





        {/* Posts Column */}
        <section className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className={`rounded-3xl ${glass}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-orange-300" /> <span>Create a post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createPost} className="space-y-3">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Catchy title…" className="bg-transparent border-white/15 focus-visible:ring-orange-500/40" />
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share what's on your mind…" className="min-h-[96px] bg-transparent border-white/15 focus-visible:ring-orange-500/40" />
                <div className="flex items-center justify-between">
                  <div className={`h-2 rounded-full w-24 ${orangeGrad}`} />
                  <Button type="submit" disabled={creatingPost || !title.trim() || !content.trim()} className={`${orangeGrad} text-white border-0 shadow-lg hover:opacity-95`}>
                    {creatingPost ? "Posting…" : "Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <EmptyState label="No posts yet. Be the first!" />
            ) : (
              posts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  comments={comments[p.id]}
                  commentValue={commentInputs[p.id] || ""}
                  onChangeComment={(v) => setCommentInputs((ci) => ({ ...ci, [p.id]: v }))}
                  onSubmitComment={() => addComment(p.id)}
                  onDeletePost={() => deletePost(p.id)}
                  onDeleteComment={(cid) => deleteComment(cid, p.id)}
                  open={openPosts[p.id] || false}
                  onToggleOpen={() => setOpenPosts((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                  currentUserId={userId}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPosts > POSTS_PER_PAGE && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <span className="text-sm text-white/70">Page {page} of {Math.ceil(totalPosts / POSTS_PER_PAGE)}</span>
              <Button onClick={() => setPage((p) => p + 1)} disabled={page * POSTS_PER_PAGE >= totalPosts}>Next</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --- PostCard Component ---
function PostCard({
  post,
  comments,
  commentValue,
  onChangeComment,
  onSubmitComment,
  open,
  onToggleOpen,
  onDeletePost,
  onDeleteComment,
  currentUserId,
}: {
  post: PostResponse;
  comments?: CommentResponse[];
  commentValue: string;
  onChangeComment: (v: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onToggleOpen: () => void;
  onDeletePost: () => void;
  onDeleteComment: (commentId: number) => void;
  currentUserId?: string;
}) {
  const safeComments = comments || [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`rounded-3xl ${glass}`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-white/10">
                <AvatarFallback className="bg-orange-500/20 text-orange-200">{(post.userId?.slice(0, 2) || "??").toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base leading-tight">{post.title}</CardTitle>
                <div className="text-xs text-white/60">by {post.userId} • {new Date(post.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {post.userId === currentUserId && (
              <Button onClick={onDeletePost} variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm md:text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">{post.content}</p>

          <div className="mt-4">
            <Button variant="ghost" onClick={onToggleOpen} className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/10">
              <MessageCircle className="h-4 w-4 mr-2" /> {open ? "Hide" : "Show"} comments ({safeComments.length})
            </Button>
          </div>

          {open && (
            <div className="mt-3 space-y-3">
              <Separator className="bg-white/10" />
              <div className="space-y-3 pt-2">
                {comments === undefined ? (
                  <div className="text-sm text-white/60 text-center py-4">Loading comments…</div>
                ) : safeComments.length === 0 ? (
                  <EmptyState label="No comments yet." small />
                ) : (
                  safeComments.map((c) => (
                    <div key={c.id} className="flex gap-3 justify-between items-start">
                      <div className="flex gap-3 items-start">
                        <Avatar className="h-7 w-7 border border-white/10">
                          <AvatarFallback className="bg-orange-500/20 text-orange-200">{(c.userId?.slice(0, 2) || "??").toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg ${glass} px-3 py-2 text-sm`}>
                          <div className="text-xs text-white/60">{c.userId} • {new Date(c.createdAt).toLocaleString()}</div>
                          <div className="break-words whitespace-pre-wrap">{c.content}</div>
                        </div>
                      </div>
                      {c.userId === currentUserId && (
                        <Button onClick={() => onDeleteComment(c.id)} variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-300 ml-2 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Input
                  value={commentValue}
                  onChange={(e) => onChangeComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmitComment();
                    }
                  }}
                  placeholder="Write a comment…"
                  className="bg-transparent border-white/15 focus-visible:ring-orange-500/40"
                />
                <Button onClick={onSubmitComment} disabled={!commentValue.trim()} className={`${orangeGrad} text-white border-0 shadow-lg`}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({ label, small }: { label: string; small?: boolean }) {
  return <div className={`text-center ${small ? "text-xs" : "text-sm"} text-white/50 py-6`}>{label}</div>;
}

