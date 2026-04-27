import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/26.jpg",
  "https://randomuser.me/api/portraits/men/52.jpg",
];

const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Basic ${btoa("junaid:2002")}` });

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u?.email) { window.location.href = "/login"; return; }
    setUser(u);
    fetchConversations(u.email);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 5 seconds when a conversation is open
  useEffect(() => {
    if (!activeConv) return;
    const interval = setInterval(() => fetchMessages(activeConv.conversationId), 5000);
    return () => clearInterval(interval);
  }, [activeConv]);

  const fetchConversations = async (email) => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) setConversations(data.conversations);
    } catch {}
    setLoading(false);
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await fetch("/api/messages/getmessages", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch {}
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    await fetchMessages(conv.conversationId);
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      const otherEmail = user.role === "brand" ? activeConv.creatorEmail : activeConv.brandEmail;
      const otherName = user.role === "brand" ? activeConv.creatorName : activeConv.brandName;
      const res = await fetch("/api/messages/send", {
        method: "POST", headers: authHeader(),
        body: JSON.stringify({
          from: user.email, fromName: user.email, fromRole: user.role,
          to: otherEmail, toName: otherName,
          toUsername: activeConv.creatorUsername, body: newMsg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMsg("");
        await fetchMessages(activeConv.conversationId);
        await fetchConversations(user.email);
      }
    } catch { toast.error("Failed to send"); }
    setSending(false);
  };

  const updateDealStatus = async (status) => {
    try {
      await fetch("/api/messages/dealstatus", {
        method: "POST", headers: authHeader(),
        body: JSON.stringify({ conversationId: activeConv.conversationId, status }),
      });
      toast.success(`Deal ${status}! 🎉`);
      setActiveConv({ ...activeConv, dealStatus: status });
      await fetchConversations(user.email);
    } catch { toast.error("Error updating status"); }
  };

  const dealColor = (s) => {
    if (s === "accepted") return "bg-green-100 text-green-700 border-green-200";
    if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const otherName = (conv) => user?.role === "brand" ? conv.creatorName : conv.brandName;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-400 text-sm">In-app chat with {user?.role === "brand" ? "creators" : "brands"}</p>
        </div>
        <a href={user?.role === "brand" ? "/brand" : "/creator/profilesetup"} className="text-sm text-gray-500 hover:underline">← Back</a>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
            {user?.role !== "creator" && (
              <a href="/brand" className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800">+ New Chat</a>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-3xl mb-2">⏳</div>
                <p className="text-sm">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-500 font-medium">No conversations yet</p>
                <p className="text-gray-400 text-xs mt-2">
                  {user?.role === "brand" ? "Click '+ New Chat' above to message a creator" : "Brands will message you here when they want to collaborate"}
                </p>
                {user?.role === "brand" && (
                  <a href="/brand" className="mt-3 inline-block text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Find Creators</a>
                )}
              </div>
            ) : (
              conversations.map((conv, i) => (
                <div key={conv._id} onClick={() => openConversation(conv)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${activeConv?.conversationId === conv.conversationId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}>
                  <div className="flex items-center gap-3">
                    <img src={AVATARS[i % AVATARS.length]} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{otherName(conv)}</p>
                      <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${dealColor(conv.dealStatus)}`}>
                        {conv.dealStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-700">Select a conversation</h3>
              <p className="text-gray-400 text-sm mt-2">Click any conversation on the left to open it</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={AVATARS[conversations.findIndex(c => c.conversationId === activeConv.conversationId) % AVATARS.length]} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold">{otherName(activeConv)}</h3>
                    {activeConv.budget && <p className="text-xs text-green-600">💰 Budget: ₹{activeConv.budget}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${dealColor(activeConv.dealStatus)}`}>
                    {activeConv.dealStatus}
                  </span>
                  {user?.role === "creator" && activeConv.dealStatus === "chatting" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateDealStatus("accepted")} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">✅ Accept Deal</button>
                      <button onClick={() => updateDealStatus("rejected")} className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">❌ Decline</button>
                    </div>
                  )}
                  {activeConv.dealStatus === "accepted" && (
                    <span className="text-xs text-green-600 font-medium">🎉 Deal Active!</span>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No messages yet. Say hello! 👋</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.from === user?.email;
                    return (
                      <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-black text-white rounded-br-sm" : "bg-white border text-gray-800 rounded-bl-sm shadow-sm"}`}>
                          <p>{msg.body}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-gray-300" : "text-gray-400"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t p-4">
                {activeConv.dealStatus === "rejected" ? (
                  <div className="text-center text-gray-400 text-sm py-2">This deal was declined. You can no longer send messages.</div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text" value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Type a message... (Enter to send)"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                    <button onClick={sendMessage} disabled={sending || !newMsg.trim()}
                      className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-40 transition-colors">
                      {sending ? "..." : "Send"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
