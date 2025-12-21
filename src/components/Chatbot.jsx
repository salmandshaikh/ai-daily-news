import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertTriangle } from 'lucide-react';
import Groq from 'groq-sdk';
import './Chatbot.css';

const RATE_LIMIT_KEY = 'ai_news_chat_limit';
const DAILY_LIMIT = 10;

const Chatbot = ({ articles }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI News Assistant. Ask me anything about today's headlines!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check usage limit
    const checkLimit = () => {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        if (!stored) return true;

        const { count, date } = JSON.parse(stored);
        const today = new Date().toDateString();

        if (date !== today) {
            // Reset for new day
            localStorage.removeItem(RATE_LIMIT_KEY);
            return true;
        }

        return count < DAILY_LIMIT;
    };

    const incrementUsage = () => {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        const today = new Date().toDateString();
        let count = 0;

        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                count = data.count;
            }
        }

        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
            count: count + 1,
            date: today
        }));
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!checkLimit()) {
            setError("Daily chat limit reached. Please come back tomorrow!");
            return;
        }

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            incrementUsage();

            const groq = new Groq({
                apiKey: import.meta.env.VITE_GROQ_API_KEY,
                dangerouslyAllowBrowser: true // Required for client-side
            });

            // Prepare context from articles
            const articlesContext = articles.map(a =>
                `- ${a.title} (${a.source}): ${a.summary}`
            ).join('\n');

            const systemPrompt = `You are a helpful and knowledgeable AI News Assistant for a daily tech news website. 
            
            Here are today's top stories:
            ${articlesContext}

            Guidelines:
            - Answer questions based on the provided news stories.
            - If asked about general tech topics not in the news, you can answer briefly but try to relate it back to today's news if possible.
            - Keep answers concise (max 3-4 sentences) unless asked for elaboration.
            - Maintain a professional but friendly, slightly "tech-savvy" tone.
            - If you don't know the answer or it's not in the context, say so politely.
            `;

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: input }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 300,
            });

            const reply = completion.choices[0]?.message?.content || "I couldn't process that request.";
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Draggable Floating Button */}
            {!isOpen && (
                <motion.div
                    drag
                    dragMomentum={false}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="chatbot-trigger"
                    onClick={() => setIsOpen(true)}
                >
                    <div className="trigger-glow"></div>
                    <Bot size={28} color="#fff" />
                    <span className="live-dot"></span>
                </motion.div>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        drag
                        dragMomentum={false}
                        className="chatbot-window"
                    >
                        <div className="chat-header">
                            <div className="header-info">
                                <Sparkles size={18} className="header-icon" />
                                <span>AI News Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="close-btn">
                                <X size={18} />
                            </button>
                        </div>

                        {error && (
                            <div className="limit-error">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.role}`}>
                                    <div className="message-content">
                                        {msg.content}
                                    </div>
                                    <div className="message-icon">
                                        {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message assistant">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Ask about today's news..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={!!error}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim() || !!error}
                                className="send-btn"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
