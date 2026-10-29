"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot, User, CheckCircle2, AlertCircle } from "lucide-react";

interface AiCounselorDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiCounselorDrawer({ open, onClose }: AiCounselorDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Admissions Counselor. Tell me your target stream, exam rank (e.g., JEE Main 15,000, NEET 580, or CAT 98%), category, and home state, and I will recommend realistic college choices, cutoff probabilities, and fee insights.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Student Profile Context
  const [exam, setExam] = useState("jee-main");
  const [rank, setRank] = useState("14200");
  const [category, setCategory] = useState("GEN");
  const [homeState, setHomeState] = useState("Odisha");

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    if (!customQuery) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          profile: {
            entranceExam: exam,
            rankOrPercentile: Number(rank) || undefined,
            category,
            homeState,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setMessages([...newMessages, { role: "assistant", content: json.answer }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "I encountered a network difficulty retrieving official JoSAA data. Please retry or adjust your score filters.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Counselor service is momentarily unavailable. Please check your connectivity.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-full sm:max-w-lg bg-background h-full shadow-2xl flex flex-col border-l animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                AI Admissions Counselor <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-1.5 py-0.2 rounded">RAG V1</span>
              </h3>
              <p className="text-[11px] text-muted-foreground">JoSAA, CSAB, NEET & NIRF Grounded Advice</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Profile Filter Bar */}
        <div className="p-3 border-b bg-muted/30 text-xs flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-muted-foreground">My Profile:</span>
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="border rounded px-2 py-1 bg-background text-xs"
          >
            <option value="jee-main">JEE Main</option>
            <option value="neet-ug">NEET UG</option>
            <option value="cat">CAT</option>
          </select>
          <input
            type="number"
            placeholder="Score/Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="border rounded px-2 py-1 w-24 bg-background text-xs"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-2 py-1 bg-background text-xs"
          >
            <option value="GEN">General</option>
            <option value="OBC">OBC-NCL</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
          <input
            type="text"
            placeholder="Home State"
            value={homeState}
            onChange={(e) => setHomeState(e.target.value)}
            className="border rounded px-2 py-1 w-24 bg-background text-xs"
          />
        </div>

        {/* Chat Stream History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-muted/60 border text-foreground"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
              <span>Analyzing cutoffs, NIRF rankings, and placement data...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="p-2 border-t bg-muted/10 flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
          {[
            "What can I get at NIT Rourkela with 14,200 rank?",
            "Compare IIT Bombay vs BITS Pilani for CSE",
            "What are the best ROI engineering colleges?",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent transition-colors text-muted-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 border-t bg-background flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about admissions, cutoffs, or fees..."
            className="flex-1 border rounded-lg px-3 py-2 text-xs outline-hidden focus:border-primary"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1 hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

