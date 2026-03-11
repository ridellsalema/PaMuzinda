import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Send, Link, Image, Search, Phone, Video, MoreVertical } from "lucide-react";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (recipientId: number) => {
    try {
      const res = await api.get(`/messages/conversation/${recipientId}`);
      setMessages(res.data.data || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectChat = (conv: any) => {
     setSelectedChat(conv);
     fetchMessages(conv.other_user.user_id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;
    try {
      const res = await api.post('/messages', {
         receiver_id: selectedChat.other_user.user_id,
         content: messageText.trim()
      });
      setMessages(prev => [...prev, res.data.data]);
      setMessageText("");
      scrollToBottom();
      fetchConversations(); // refresh last message
    } catch(err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
     setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     }, 100);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedChat !== null) {
    return (
      <div className="min-h-full bg-gray-50 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
        {/* Chat Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 fixed top-0 w-full md:relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedChat(null)} className="md:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="font-semibold text-primary">{selectedChat.other_user?.full_name?.charAt(0) || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-800 truncate">{selectedChat.other_user?.full_name}</h2>
              <p className="text-xs text-gray-500">{selectedChat.other_user?.role}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"><Phone className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"><Video className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-4 md:px-6 py-20 md:py-4 space-y-3 min-h-0 bg-gray-100 md:bg-gray-50">
          {messages.length === 0 ? (
             <div className="text-center py-10 text-gray-500 text-sm">No messages yet. Say hello!</div>
          ) : messages.map((message) => {
            const isMe = message.sender_id === user?.user_id;
            return (
              <div key={message.message_id} className={`flex ${isMe ? "justify-end pl-8" : "justify-start pr-8"}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] ${isMe ? "bg-primary text-white" : "bg-white text-gray-800 border border-gray-200"} rounded-2xl px-4 py-3 shadow-sm`}>
                  <p className="text-sm break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-gray-400"}`}>
                    {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 md:px-6 py-3 fixed bottom-0 md:relative w-full z-10">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <button type="button" className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 hidden sm:block"><Link className="w-5 h-5 text-gray-500" /></button>
            <button type="button" className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"><Image className="w-5 h-5 text-gray-500" /></button>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Type a message..."
              className="flex-1 min-w-0 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary transition-colors text-base"
            />
            <button onClick={handleSendMessage} disabled={!messageText.trim()} className="w-11 h-11 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md flex-shrink-0 disabled:opacity-50">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
       <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-500">Your conversations</p>
        </div>
      </div>

      <div className="md:hidden bg-primary text-white px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        {loading ? (
           <div className="text-center py-10 text-gray-500 animate-pulse">Loading Messages...</div>
        ) : filteredConversations.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No conversations found.</p>
           </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredConversations.map((conversation, index) => (
              <button key={index} onClick={() => handleSelectChat(conversation)} className="w-full px-4 md:px-6 py-4 flex items-center gap-4 border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">{conversation.other_user?.full_name?.charAt(0) || "U"}</span>
                  </div>
                  {conversation.unread_count > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">{conversation.unread_count}</div>}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">{conversation.other_user?.full_name}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(conversation.lastMessage.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate pr-4 ${conversation.unread_count > 0 ? "font-semibold text-gray-800" : "text-gray-500"}`}>{conversation.lastMessage.content}</p>
                    <span className="text-xs text-primary font-medium flex-shrink-0">{conversation.other_user?.role}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
