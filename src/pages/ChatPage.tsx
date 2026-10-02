import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ArrowLeft, Check, X, Handshake } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Badge } from '@/components/ui';
import { useToast } from '@/context/ToastContext';
import { mockChatMessages } from '@/lib/mockData';
import { cn, formatCurrency } from '@/lib/utils';

interface ChatMsg {
  id: string;
  sender: 'farmer' | 'buyer';
  message: string;
  type: 'text' | 'offer' | 'system';
  offer_price?: number;
  offer_status?: 'pending' | 'accepted' | 'rejected' | 'countered';
  time: string;
}

export function ChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMsg[]>(mockChatMessages as ChatMsg[]);
  const [input, setInput] = useState('');
  const [chatStarted, setChatStarted] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMsg = {
      id: Math.random().toString(36).slice(2),
      sender: 'farmer',
      message: input,
      type: 'text',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate buyer response
    setTimeout(() => {
      const responses = [
        'Thank you for the information. Let me check and get back to you.',
        'That sounds reasonable. Can you share the quality details?',
        'We are interested. Let me make you an offer.',
        'How soon can you deliver to our warehouse?',
      ];
      const reply: ChatMsg = {
        id: Math.random().toString(36).slice(2),
        sender: 'buyer',
        message: responses[Math.floor(Math.random() * responses.length)],
        type: 'text',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const acceptOffer = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, offer_status: 'accepted' } : m));
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      sender: 'system',
      message: 'Offer accepted! The buyer will contact you for delivery details.',
      type: 'system',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);
    toast('success', 'Offer Accepted!', 'The buyer has been notified of your acceptance.');
  };

  const rejectOffer = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, offer_status: 'rejected' } : m));
    toast('info', 'Offer Rejected', 'You can continue negotiating or wait for a new offer.');
  };

  const counterOffer = (id: string, price: number) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      sender: 'farmer',
      message: `I would like to counter with ${formatCurrency(price + 1)}/kg.`,
      type: 'text',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);
    toast('info', 'Counter Offer Sent', `You countered with ${formatCurrency(price + 1)}/kg.`);
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Chat with Buyer</h1>
        <p className="text-gray-500 mt-1">Negotiate prices and close deals directly with buyers</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat list sidebar */}
        <div className="hidden lg:block">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Active Conversations</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-green-50 border border-green-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white font-bold text-sm">A</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">ABC Vegetables Pvt Ltd</p>
                    <p className="text-xs text-gray-500">Tomato · ₹31/kg offer</p>
                  </div>
                  <Badge variant="green">Active</Badge>
                </div>
              </div>
              <div className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">F</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">Fresh Foods Export Co</p>
                    <p className="text-xs text-gray-500">Tomato · ₹30/kg offer</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white font-bold text-sm">A</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">ABC Vegetables Pvt Ltd</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Online · Verified Buyer
                </p>
              </div>
              <Badge variant="amber">Negotiating</Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
              </div>
              {messages.map(msg => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="text-center">
                      <span className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 inline-flex items-center gap-1">
                        <Handshake className="w-3 h-3" /> {msg.message}
                      </span>
                    </div>
                  );
                }
                const isFarmer = msg.sender === 'farmer';
                return (
                  <div key={msg.id} className={cn('flex', isFarmer ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5',
                      isFarmer ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-900'
                    )}>
                      {msg.type === 'offer' && msg.offer_price ? (
                        <div>
                          <p className={cn('text-xs mb-1', isFarmer ? 'text-green-100' : 'text-gray-500')}>Price Offer</p>
                          <p className="text-xl font-bold">{formatCurrency(msg.offer_price)}/kg</p>
                          {msg.offer_status === 'pending' && !isFarmer && (
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => acceptOffer(msg.id)} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                                <Check className="w-3 h-3" /> Accept
                              </button>
                              <button onClick={() => rejectOffer(msg.id)} className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">
                                <X className="w-3 h-3" /> Reject
                              </button>
                              <button onClick={() => counterOffer(msg.id, msg.offer_price!)} className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300">
                                Counter
                              </button>
                            </div>
                          )}
                          {msg.offer_status === 'accepted' && <p className="text-xs mt-1 text-green-300 font-medium">✓ Accepted</p>}
                          {msg.offer_status === 'rejected' && <p className="text-xs mt-1 text-red-300 font-medium">✗ Rejected</p>}
                        </div>
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                      <p className={cn('text-[10px] mt-1', isFarmer ? 'text-green-200' : 'text-gray-400')}>{msg.time}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-3 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button onClick={sendMessage} disabled={!input.trim()}><Send className="w-4 h-4" /></Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
