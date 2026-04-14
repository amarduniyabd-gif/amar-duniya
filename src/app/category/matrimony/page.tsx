"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Lock, CreditCard, User, MapPin, Briefcase, Phone } from 'lucide-react';

// ডামি ডাটা (পরে ডাটাবেজ থেকে আনবে)
const dummyProfiles = [
  {
    id: 1,
    name: "রহিমা খাতুন",
    age: 24,
    village: "সোনারগাঁও",
    district: "নারায়ণগঞ্জ",
    profession: "শিক্ষিকা",
    education: "স্নাতক",
    height: "৫'৪\"",
    weight: "৫০ কেজি",
    religion: "ইসলাম",
    phone: "০১৭XXXXXXXX",
    isMale: false,
    hasPhoto: true,
    photoBlurred: true,
  },
  {
    id: 2,
    name: "আব্দুল করিম",
    age: 28,
    village: "গাজীপুর সদর",
    district: "গাজীপুর",
    profession: "ব্যবসায়ী",
    education: "স্নাতকোত্তর",
    height: "৫'৮\"",
    weight: "৬৫ কেজি",
    religion: "ইসলাম",
    phone: "০১৮XXXXXXXX",
    isMale: true,
    hasPhoto: true,
    photoBlurred: true,
  },
  {
    id: 3,
    name: "ফাতেমা বেগম",
    age: 22,
    village: "কুমিল্লা সদর",
    district: "কুমিল্লা",
    profession: "চিকিৎসা শিক্ষার্থী",
    education: "এমবিবিএস (চলমান)",
    height: "৫'২\"",
    weight: "৪৮ কেজি",
    religion: "ইসলাম",
    phone: "০১৯XXXXXXXX",
    isMale: false,
    hasPhoto: true,
    photoBlurred: true,
  },
];

// পেমেন্ট মডাল কম্পোনেন্ট
function PaymentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
      alert("পেমেন্ট সফল! ছবি এখন দেখতে পারবেন।");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-center mb-4">ছবি দেখতে পেমেন্ট করুন</h2>
        <div className="bg-orange-50 p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-600 text-center">
            এই ব্যক্তির ছবি দেখতে মাত্র <span className="text-[#f85606] font-bold">১০ টাকা</span> পেমেন্ট করুন
          </p>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          {isProcessing ? "প্রসেসিং..." : "১০ টাকা পেমেন্ট করুন"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-500 py-2 text-sm"
        >
          বাতিল
        </button>
      </div>
    </div>
  );
}

// প্রোফাইল কার্ড কম্পোনেন্ট
function ProfileCard({ profile, onViewPhoto }: { profile: any; onViewPhoto: (id: number) => void }) {
  const [showPhoto, setShowPhoto] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleViewPhoto = () => {
    if (profile.photoBlurred && !showPhoto) {
      setShowPaymentModal(true);
    } else {
      setShowPhoto(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* ছবি সেকশন */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        {showPhoto ? (
          <div className="text-8xl">{profile.isMale ? "👨" : "👩"}</div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-2 opacity-50 blur-sm">{profile.isMale ? "👨" : "👩"}</div>
            <button
              onClick={handleViewPhoto}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#f85606] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
            >
              <Eye size={14} />
              ছবি দেখুন (১০ টাকা)
            </button>
          </div>
        )}
        {profile.photoBlurred && !showPhoto && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock size={10} /> লক করা
          </div>
        )}
      </div>

      {/* তথ্য সেকশন */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{profile.name}</h3>
          <span className="text-sm text-[#f85606] font-semibold">{profile.age} বছর</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={14} />
            <span>{profile.village}, {profile.district}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase size={14} />
            <span>{profile.profession}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} />
            <span>{profile.education}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>📏 {profile.height}</span>
            <span>•</span>
            <span>⚖️ {profile.weight}</span>
          </div>
        </div>

        {/* যোগাযোগ বাটন */}
        <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
          <Phone size={14} />
          যোগাযোগ করুন
        </button>
      </div>

      {/* পেমেন্ট মডাল */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPhoto(true)}
        />
      )}
    </div>
  );
}

export default function MatrimonyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"male" | "female">("male");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfiles = dummyProfiles.filter(profile => {
    if (activeTab === "male" && profile.isMale === false) return false;
    if (activeTab === "female" && profile.isMale === true) return false;
    if (searchTerm && !profile.name.includes(searchTerm) && !profile.village.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-[#f85606]">পাত্র-পাত্রী চায়</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        
        {/* সার্চ বার */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
          <input
            type="text"
            placeholder="নাম বা গ্রাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f85606]"
          />
        </div>

        {/* ট্যাব */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("male")}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${
              activeTab === "male"
                ? "bg-[#f85606] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            👨 পাত্র (পুরুষ)
          </button>
          <button
            onClick={() => setActiveTab("female")}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${
              activeTab === "female"
                ? "bg-[#f85606] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            👩 পাত্রী (মহিলা)
          </button>
        </div>

        {/* প্রোফাইল লিস্ট */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onViewPhoto={(id) => console.log("View photo:", id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-500">কোনো প্রোফাইল পাওয়া যায়নি</p>
          </div>
        )}

        {/* নতুন পোস্ট বাটন */}
        <div className="mt-6 text-center">
          <Link
            href="/post-ad?category=matrimony"
            className="inline-block bg-[#f85606] text-white px-6 py-3 rounded-xl font-semibold shadow-md"
          >
            ➕ আপনার প্রোফাইল যোগ করুন
          </Link>
        </div>

        {/* তথ্য */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            🔒 ছবি দেখতে ১০ টাকা পেমেন্ট করতে হবে। পেমেন্ট করলে ছবি ক্লিয়ার দেখা যাবে।
          </p>
          <p className="text-xs text-gray-500 mt-2">
            নিরাপদ ও সুরক্ষিত প্ল্যাটফর্ম। আপনার তথ্য গোপন রাখা হবে।
          </p>
        </div>

      </div>
    </div>
  );
}