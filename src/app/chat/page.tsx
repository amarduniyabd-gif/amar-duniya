"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "হ্যালো, পণ্যটি এখনো আছে?", sender: "them", time: "১০:৩০ AM" },
    { id: 2, text: "হ্যাঁ, আছে। আপনি কিনতে চান?", sender: "me", time: "১০:৩২ AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me", time: "এখন" }]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20">
      <div className="bg-[#f85606] text-white px-4 py-3 sticky top-0">
        <h1 className="text-xl font-bold">চ্যাট - রহিম</h1>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === "me" ? "bg-[#f85606] text-white" : "bg-white text-gray-800 shadow"}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-orange-100" : "text-gray-400"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-3 sticky bottom-16 flex gap-2 shadow">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="মেসেজ লিখুন..." className="flex-1 p-2 border rounded-xl" onKeyPress={(e) => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-[#f85606] text-white p-2 rounded-xl"><Send size={20} /></button>
      </div>
    </div>
  );
}