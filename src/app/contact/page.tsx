"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#f85606]">যোগাযোগ</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">যোগাযোগের তথ্য</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3"><Phone size={18} className="text-[#f85606]" /><span className="text-sm text-gray-600">+880 17XXXXXXXX</span></div>
              <div className="flex items-center gap-3"><Mail size={18} className="text-[#f85606]" /><span className="text-sm text-gray-600">info@amarduniya.com</span></div>
              <div className="flex items-center gap-3"><MapPin size={18} className="text-[#f85606]" /><span className="text-sm text-gray-600">ঢাকা, বাংলাদেশ</span></div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-3">সোশ্যাল মিডিয়া</p>
              <div className="flex gap-3">
                <button className="bg-[#1877F2] text-white p-2 rounded-full">📘</button>
                <button className="bg-[#FF0000] text-white p-2 rounded-full">▶️</button>
                <button className="bg-[#25D366] text-white p-2 rounded-full">💬</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">বার্তা পাঠান</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="আপনার নাম" className="w-full p-3 bg-gray-50 border rounded-xl" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ইমেইল" className="w-full p-3 bg-gray-50 border rounded-xl" required />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="বিষয়" className="w-full p-3 bg-gray-50 border rounded-xl" required />
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="আপনার বার্তা" className="w-full p-3 bg-gray-50 border rounded-xl" required />
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Send size={18} /> {isSubmitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}