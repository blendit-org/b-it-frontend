"use client"

import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Users, Paperclip, Image as ImageIcon, FileText, X, Smile } from 'lucide-react';

// --- Type Definitions ---
interface Sender {
  id: string;
  name: string;
  avatar: string; // URL or a character for a placeholder
}

interface FileAttachment {
  name: string;
  url: string;
  size: string;
}

interface Message {
  id: string;
  text?: string;
  sender: Sender;
  timestamp: string;
  imageUrl?: string;
  file?: FileAttachment;
}

// --- Mock Data ---
const CURRENT_USER_ID = "user-1";

const mockUsers: { [key: string]: Sender } = {
  "user-1": { id: "user-1", name: "You", avatar: "Y" },
  "user-2": { id: "user-2", name: "Alex", avatar: "A" },
  "user-3": { id: "user-3", name: "Samantha", avatar: "S" },
};

const initialMessages: Message[] = [
  {
    id: "msg-1",
    text: "Hey everyone! Welcome to the new community chat.",
    sender: mockUsers["user-2"],
    timestamp: "10:30 AM",
  },
  {
    id: "msg-2",
    text: "Wow, this looks amazing! The dark theme is so much better.",
    sender: mockUsers["user-3"],
    timestamp: "10:31 AM",
  },
  {
    id: "msg-3",
    imageUrl: "https://placehold.co/600x400/1e1e1e/ff9800?text=Cool+Image!",
    sender: mockUsers["user-1"],
    timestamp: "10:32 AM",
  },
   {
    id: "msg-4",
    file: { name: "project-brief.pdf", url: "#", size: "1.2 MB" },
    sender: mockUsers["user-2"],
    timestamp: "10:33 AM",
  },
];

// --- Main Component ---
export function CommunityPage({ className }: React.ComponentProps<"div">) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      if (file.type.startsWith("image/")) {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        setAttachmentPreview(file.name);
      }
    }
    e.target.value = ''; // Reset input
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };
  
  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !attachment) return;

    let messagePayload: Partial<Message> = {};

    if (attachment) {
      if (attachment.type.startsWith("image/")) {
        messagePayload.imageUrl = attachmentPreview as string;
      } else {
        messagePayload.file = {
          name: attachment.name,
          url: "#",
          size: `${(attachment.size / 1024 / 1024).toFixed(2)} MB`,
        };
      }
    }

    if(newMessage.trim() !== "") {
        messagePayload.text = newMessage;
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: mockUsers[CURRENT_USER_ID],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...messagePayload
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    removeAttachment();
    setShowEmojiPicker(false);
  };
  
  const EmojiPicker = () => {
      const emojis = ['😀', '😂', '❤️', '👍', '🔥', '🎉', '🤔', '😢', '🙏', '💯', '🚀', '💡'];
      return (
          <div ref={emojiPickerRef} className="absolute bottom-full mb-3 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl p-3 animate-fade-in-up z-20">
              <div className="grid grid-cols-6 gap-2">
                  {emojis.map(emoji => (
                      <button key={emoji} onClick={() => handleEmojiSelect(emoji)} type="button" className="text-2xl rounded-md hover:bg-neutral-700 transition-colors p-1">
                          {emoji}
                      </button>
                  ))}
              </div>
          </div>
      )
  }

  return (
    <div className={cn("grid grid-rows-[auto_1fr_auto] h-screen bg-neutral-900 text-white font-sans overflow-hidden", className)}>
      {/* Header */}
      <header className="flex items-center gap-4 p-4 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800 z-10">
        <div className="p-2 bg-orange-500/20 rounded-full">
            <Users className="w-6 h-6 text-orange-400" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Community Hub</h1>
      </header>

      {/* Messages Area */}
      <main className="overflow-y-auto p-4 md:p-6 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in-up">
            <div className={cn("flex items-end gap-3 max-w-xl", msg.sender.id === CURRENT_USER_ID ? "ml-auto flex-row-reverse" : "mr-auto")}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-700 font-bold text-orange-300 shrink-0 text-sm">
                {msg.sender.avatar}
              </div>
              <div className={cn("relative rounded-xl px-4 py-2.5 shadow-md", msg.sender.id === CURRENT_USER_ID ? "bg-gradient-to-br from-orange-500 to-orange-600 rounded-br-none" : "bg-neutral-800 rounded-bl-none")}>
                <p className="font-bold text-sm mb-1 text-orange-200">{msg.sender.name}</p>
                {msg.text && <p className="text-base whitespace-pre-wrap">{msg.text}</p>}
                {msg.imageUrl && <img src={msg.imageUrl} alt="attachment" className="mt-2 rounded-lg max-w-xs max-h-64 object-cover" />}
                {msg.file && (
                    <div className="mt-2 flex items-center gap-3 bg-black/20 p-2 rounded-lg">
                        <FileText className="w-8 h-8 text-orange-300 shrink-0"/>
                        <div>
                            <p className="font-semibold">{msg.file.name}</p>
                            <p className="text-xs text-neutral-400">{msg.file.size}</p>
                        </div>
                    </div>
                )}
                <p className="text-xs mt-2 text-right text-orange-200/70">{msg.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="p-4 bg-neutral-950/80 backdrop-blur-sm border-t border-neutral-800">
        {attachmentPreview && (
          <div className="relative w-full p-2 mb-2 bg-neutral-800 rounded-lg animate-fade-in">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 hover:bg-black/80 z-10" onClick={removeAttachment}>
              <X className="w-4 h-4" />
            </Button>
            {attachment?.type.startsWith("image/") ? ( <img src={attachmentPreview} className="max-h-24 rounded-md object-contain" alt="Preview"/> ) : (
                <div className="flex items-center gap-3 text-white">
                    <FileText className="w-8 h-8 text-orange-300 shrink-0"/>
                    <div>
                        <p className="font-semibold text-sm">{attachmentPreview}</p>
                        <p className="text-xs text-neutral-400">{attachment && `${(attachment.size / 1024).toFixed(1)} KB`}</p>
                    </div>
                </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-start gap-2">
          <div className="relative group shrink-0">
            <Button type="button" variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 transition-all">
                <Paperclip className="w-6 h-6"/>
            </Button>
            <div className="absolute bottom-full mb-2 w-40 bg-neutral-800 rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto duration-300 transform group-hover:-translate-y-1">
                <button type="button" onClick={() => imageInputRef.current?.click()} className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-orange-500/20"> <ImageIcon className="w-5 h-5 text-orange-400"/> Image </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-orange-500/20"> <FileText className="w-5 h-5 text-orange-400"/> File </button>
                <input type="file" ref={imageInputRef} onChange={handleFileSelect} accept="image/*" className="hidden"/>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden"/>
            </div>
          </div>
          <div className="relative flex-1">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-neutral-800 border-neutral-700 h-12 text-base focus-visible:ring-1 focus-visible:ring-orange-500 ring-offset-neutral-900 pr-12 w-full"
              autoComplete="off"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => setShowEmojiPicker(p => !p)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full h-8 w-8 text-neutral-400 hover:text-orange-400 hover:bg-neutral-700">
                <Smile className="w-5 h-5" />
            </Button>
            {showEmojiPicker && <EmojiPicker />}
          </div>
          <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600 transition-transform active:scale-90 shadow-lg shadow-orange-500/30 font-bold shrink-0" disabled={!newMessage.trim() && !attachment}>
            <SendHorizontal className="w-6 h-6" />
          </Button>
        </form>
      </footer>
    </div>
  );
}

