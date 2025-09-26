// --- Configuration ---
// FIX: Using the hardcoded IP from your original code. 
// In a real project, this would be an environment variable.
const API_BASE = "http://127.0.0.1:8000"; 
export const WS_BASE = "ws://127.0.0.1:8000";

// --- Type Definitions (matching your FastAPI schemas) ---

export type TagResponse = {
  id: number;
  name: string;
};

export type AnswerResponse = {
  id: number;
  question_id: number;
  userId: string;
  content: string;
  createdAt: string;
  votes: number;
  is_accepted: boolean;
};

export type QuestionResponse = {
  id: number;
  userId: string;
  title: string;
  content: string;
  tags: TagResponse[];
  createdAt: string;
  votes: number;
};

export type QuestionDetailResponse = QuestionResponse & {
  answers: AnswerResponse[];
};

export type PaginatedQuestionsResponse = {
  questions: QuestionResponse[];
  total: number;
};

export type ChatMessageData = {
    id: number;
    userId: string;
    message: string;
    createdAt: string;
}

export type WebSocketMessage = {
    type: 'status' | 'chat_message';
    message?: string; // for status
    data?: ChatMessageData; // for chat_message
}

// --- API Functions ---

// Fetch a paginated list of questions
export const fetchQuestions = async (page = 1, limit = 5) => {
  const res = await fetch(`${API_BASE}/questions?skip=${(page - 1) * limit}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json() as Promise<PaginatedQuestionsResponse>;
};

// Fetch the full details for a single question, including answers
export const fetchQuestionDetails = async (questionId: number) => {
    const res = await fetch(`${API_BASE}/questions/${questionId}`);
    if (!res.ok) throw new Error("Failed to fetch question details");
    return res.json() as Promise<QuestionDetailResponse>;
}

// Create a new question
export const createQuestion = async (userId: string, title: string, content: string, tags: string[]) => {
  const res = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, content, tags }),
  });
  if (!res.ok) throw new Error("Failed to create question");
  return res.json() as Promise<QuestionResponse>;
};

// Delete a question
export const deleteQuestion = async (questionId: number) => {
    await fetch(`${API_BASE}/questions/${questionId}`, { method: "DELETE" });
};

// Post an answer to a question
export const addAnswer = async (questionId: number, userId: string, content: string) => {
    const res = await fetch(`${API_BASE}/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content }),
      });
      if (!res.ok) throw new Error("Failed to add answer");
      return res.json() as Promise<AnswerResponse>;
}

// Vote on a question or an answer
export const voteOn = async (type: 'questions' | 'answers', id: number, direction: 1 | -1) => {
    const res = await fetch(`${API_BASE}/${type}/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
    });
    if (!res.ok) throw new Error(`Failed to vote on ${type}`);
    return res.json();
}

// Mark an answer as accepted
export const acceptAnswer = async (answerId: number, userId: string) => {
    const res = await fetch(`${API_BASE}/answers/${answerId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error("Failed to accept answer");
    return res.json() as Promise<AnswerResponse>;
}

// Fetch the entire chat history (for initial load)
export const fetchChatHistory = async () => {
    const res = await fetch(`${API_BASE}/chat`);
    if (!res.ok) throw new Error("Failed to fetch chat history");
    return res.json() as Promise<ChatMessageData[]>;
};

// Delete a specific chat message
export const deleteChatMessage = async (messageId: number) => {
    await fetch(`${API_BASE}/chat/${messageId}`, { method: "DELETE" });
}
