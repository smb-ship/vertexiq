import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { askVertexIQ } from "../../services/aiService";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AskVertexIQ() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Ask me anything about your dashboard data — revenue, team, traffic, or KPIs." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token) return;

    const question = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await askVertexIQ(question, token);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary glow-primary flex items-center justify-center text-white z-40 hover:bg-primary/90 transition-colors"
      >
        <Sparkles size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" as const }}
              className="fixed right-0 top-0 h-screen w-full max-w-sm z-50 glass-card rounded-none border-y-0 border-r-0 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">Ask VertexIQ</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05]">
                  <X size={18} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "ml-auto bg-primary text-white"
                        : "bg-white/[0.05] text-text-primary"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-border-subtle flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your data..."
                  className="flex-1 px-3.5 py-2 rounded-lg bg-white/[0.03] border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white disabled:opacity-40 shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}