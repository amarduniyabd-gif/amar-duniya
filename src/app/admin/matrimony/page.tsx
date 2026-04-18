"use client";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Search, Filter, Eye, CheckCircle, XCircle, Trash2,
  Users, User, MapPin, Briefcase, Heart, Shield, Award,
  RefreshCw, Download, MoreVertical, AlertCircle, Clock,
  CheckCheck, Ban, ExternalLink, Phone, Mail, Calendar,
  ChevronRight, ChevronDown, TrendingUp, DollarSign, Sparkles,
  Edit2, Save, Plus, Image as ImageIcon, Lock, Unlock,
  UserPlus, UserCheck, UserX, BarChart3, PieChart, Activity,
  Gem, Crown, Star, Flag, MessageCircle, EyeOff, Zap
} from "lucide-react";

// ============ টাইপ ডেফিনিশন ============
type MatrimonyProfile = {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  village: string;
  district: string;
  profession: string;
  education: string;
  height: string;
  weight: string;
  religion: string;
  phone: string;
  email: string;
  isVerified: boolean;
  isPremium: boolean;
  expectedIncome: string;
  familyStatus: string;
  about: string;
  createdAt: string;
  maritalStatus: "unmarried" | "divorced" | "widowed";
  hasChildren: boolean;
  childrenCount?: number;
  remarryWilling: "yes" | "no" | "undecided";
  bloodGroup?: string;
  complexion?: string;
  hobbies?: string[];
  views: number;
  interests: number;
  status: 'pending' | 'approved' | 'rejected';
  hasPhoto: boolean;
  photoBlurred: boolean;
  reportedCount: number;
  isBlocked: boolean;
};

// বাংলাদেশের জেলা
const bangladeshDistricts = [
  "ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সীগঞ্জ", 
  "ফরিদপুর", "মাদারীপুর", "শরীয়তপুর", "রাজবাড়ী", "গোপালগঞ্জ", "চট্টগ্রাম", "কুমিল্লা", 
  "ফেনী", "ব্রাহ্মণবাড়িয়া", "রাঙ্গামাটি", "নোয়াখালী", "লক্ষ্মীপুর", "চাঁদপুর", "কক্সবাজার", 
  "খাগড়াছড়ি", "বান্দরবান", "রাজশাহী", "নাটোর", "নওগাঁ", "চাঁপাইনবাবগঞ্জ", "পাবনা", 
  "সিরাজগঞ্জ", "বগুড়া", "জয়পুরহাট", "খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "মাগুরা", 
  "নড়াইল", "ঝিনাইদহ", "কুষ্টিয়া", "চুয়াডাঙ্গা", "মেহেরপুর", "বরিশাল", "পিরোজপুর", 
  "ঝালকাঠি", "বরগুনা", "পটুয়াখালী", "ভোলা", "সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ",
  "রংপুর", "দিনাজপুর", "কুড়িগ্রাম", "গাইবান্ধা", "লালমনিরহাট", "নীলফামারী", "পঞ্চগড়", 
  "ঠাকুরগাঁও", "ময়মনসিংহ", "জামালপুর", "শেরপুর", "নেত্রকোণা"
];

// ডামি ডাটা
const dummyProfiles: MatrimonyProfile[] = [
  {
    id: 1, name: "রহিমা খাতুন", age: 24, gender: "female", village: "সোনারগাঁও", district: "নারায়ণগঞ্জ",
    profession: "সফটওয়্যার ইঞ্জিনিয়ার", education: "বিএসসি (সিএসই)", height: "৫'৪\"", weight: "৫০ কেজি",
    religion: "ইসলাম", phone: "০১৭১২৩৪৫৬৭৮", email: "rahima@gmail.com", isVerified: true, isPremium: true,
    expectedIncome: "৬০,০০০ - ৮০,০০০", familyStatus: "মধ্যবিত্ত", about: "সরল ও শিক্ষিত পরিবারের মেয়ে।",
    createdAt: "২০২৬-০৪-১৫", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "O+", complexion: "ফর্সা", hobbies: ["বই পড়া", "ভ্রমণ"], views: 1240, interests: 56,
    status: 'approved', hasPhoto: true, photoBlurred: true, reportedCount: 0, isBlocked: false,
  },
  {
    id: 2, name: "আব্দুল করিম", age: 28, gender: "male", village: "গাজীপুর সদর", district: "গাজীপুর",
    profession: "ব্যবসায়ী", education: "এমবিএ", height: "৫'৮\"", weight: "৬৫ কেজি",
    religion: "ইসলাম", phone: "০১৮১২৩৪৫৬৭৮", email: "karim@gmail.com", isVerified: true, isPremium: false,
    expectedIncome: "১,০০,০০০ - ১,৫০,০০০", familyStatus: "উচ্চ মধ্যবিত্ত", about: "নিজের ব্যবসা আছে।",
    createdAt: "২০২৬-০৪-১৪", maritalStatus: "divorced", hasChildren: true, childrenCount: 1, remarryWilling: "yes",
    bloodGroup: "B+", complexion: "মাঝারি", hobbies: ["ব্যবসা", "ক্রিকেট"], views: 890, interests: 34,
    status: 'approved', hasPhoto: true, photoBlurred: true, reportedCount: 2, isBlocked: false,
  },
  {
    id: 3, name: "ফাতেমা বেগম", age: 22, gender: "female", village: "কুমিল্লা সদর", district: "কুমিল্লা",
    profession: "চিকিৎসা শিক্ষার্থী", education: "এমবিবিএস (চলমান)", height: "৫'২\"", weight: "৪৮ কেজি",
    religion: "ইসলাম", phone: "০১৯১২৩৪৫৬৭৮", email: "fatema@gmail.com", isVerified: false, isPremium: false,
    expectedIncome: "অধ্যায়নরত", familyStatus: "মধ্যবিত্ত", about: "উচ্চাকাঙ্ক্ষী ডাক্তার।",
    createdAt: "২০২৬-০৪-১৩", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "A+", complexion: "শ্যামলা", hobbies: ["গান শোনা"], views: 2100, interests: 89,
    status: 'pending', hasPhoto: true, photoBlurred: true, reportedCount: 0, isBlocked: false,
  },
  {
    id: 4, name: "শাহিনুর রহমান", age: 26, gender: "male", village: "মিরপুর", district: "ঢাকা",
    profession: "ব্যাংকার", education: "এমবিএ", height: "৫'৬\"", weight: "৫৮ কেজি",
    religion: "ইসলাম", phone: "০১৬১২৩৪৫৬৭৮", email: "shahinur@gmail.com", isVerified: true, isPremium: true,
    expectedIncome: "৭০,০০০ - ৯০,০০০", familyStatus: "মধ্যবিত্ত", about: "ব্যাংকে চাকরি করি।",
    createdAt: "২০২৬-০৪-১২", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "AB+", complexion: "ফর্সা", hobbies: ["ক্রিকেট", "ভ্রমণ"], views: 567, interests: 23,
    status: 'rejected', hasPhoto: true, photoBlurred: true, reportedCount: 5, isBlocked: true,
  },
  {
    id: 5, name: "নাজমা বেগম", age: 25, gender: "female", village: "রাজশাহী সদর", district: "রাজশাহী",
    profession: "সরকারি চাকরি", education: "স্নাতকোত্তর", height: "৫'৩\"", weight: "৫২ কেজি",
    religion: "ইসলাম", phone: "০১৭৯৮৭৬৫৪৩২", email: "nazma@gmail.com", isVerified: false, isPremium: false,
    expectedIncome: "৪০,০০০ - ৫০,০০০", familyStatus: "মধ্যবিত্ত", about: "সরকারি চাকরি করি।",
    createdAt: "২০২৬-০৪-১১", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "O-", complexion: "মাঝারি", hobbies: ["রান্না", "সেলাই"], views: 432, interests: 18,
    status: 'pending', hasPhoto: true, photoBlurred: true, reportedCount: 0, isBlocked: false,
  },
  {
    id: 6, name: "হাসান মিয়া", age: 30, gender: "male", village: "সিলেট সদর", district: "সিলেট",
    profession: "ইঞ্জিনিয়ার", education: "বিএসসি (সিভিল)", height: "৫'৯\"", weight: "৭০ কেজি",
    religion: "ইসলাম", phone: "০১৮৯৮৭৬৫৪৩২", email: "hasan@gmail.com", isVerified: true, isPremium: true,
    expectedIncome: "৮০,০০০ - ১,০০,০০০", familyStatus: "উচ্চ মধ্যবিত্ত", about: "বিদেশে কাজ করি।",
    createdAt: "২০২৬-০৪-১০", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "B-", complexion: "শ্যামলা", hobbies: ["ভ্রমণ", "ছবি তোলা"], views: 678, interests: 45,
    status: 'approved', hasPhoto: true, photoBlurred: true, reportedCount: 0, isBlocked: false,
  },
];

// ============ মেমোইজড স্ট্যাটাস ব্যাজ ============
const StatusBadge = memo(({ status }: { status: string }) => {
  const config = {
    approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "অনুমোদিত" },
    pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "পেন্ডিং" },
    rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "বাতিল" },
  }[status] || { color: "bg-gray-100 text-gray-700", icon: AlertCircle, text: status };
  
  const Icon = config.icon;
  return (
    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${config.color}`}>
      <Icon size={10} /> {config.text}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

// ============ মেইন কম্পোনেন্ট ============
export default function AdminMatrimonyPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<MatrimonyProfile[]>(dummyProfiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'reported'>('all');

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else {
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ============ অপটিমাইজড হ্যান্ডলার ============
  const handleApprove = useCallback((id: number) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    setSuccessMessage("✅ প্রোফাইল অনুমোদিত হয়েছে!");
    setShowActionMenu(null);
  }, []);

  const handleReject = useCallback((id: number) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    setSuccessMessage("❌ প্রোফাইল বাতিল করা হয়েছে!");
    setShowActionMenu(null);
  }, []);

  const handleToggleVerify = useCallback((id: number) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, isVerified: !p.isVerified } : p));
    setSuccessMessage("✅ ভেরিফিকেশন স্ট্যাটাস পরিবর্তন করা হয়েছে!");
    setShowActionMenu(null);
  }, []);

  const handleTogglePremium = useCallback((id: number) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, isPremium: !p.isPremium } : p));
    setSuccessMessage("👑 প্রিমিয়াম স্ট্যাটাস পরিবর্তন করা হয়েছে!");
    setShowActionMenu(null);
  }, []);

  const handleToggleBlock = useCallback((id: number) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, isBlocked: !p.isBlocked } : p));
    setSuccessMessage("🚫 ব্লক স্ট্যাটাস পরিবর্তন করা হয়েছে!");
    setShowActionMenu(null);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    setSuccessMessage("🗑️ প্রোফাইল ডিলিট করা হয়েছে!");
    setShowDeleteConfirm(null);
    setShowActionMenu(null);
  }, []);

  const handleBulkApprove = useCallback(() => {
    setProfiles(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'approved' } : p));
    setSelectedIds([]);
    setSuccessMessage(`✅ ${selectedIds.length}টি প্রোফাইল অনুমোদিত!`);
  }, [selectedIds]);

  const handleBulkReject = useCallback(() => {
    setProfiles(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'rejected' } : p));
    setSelectedIds([]);
    setSuccessMessage(`❌ ${selectedIds.length}টি প্রোফাইল বাতিল!`);
  }, [selectedIds]);

  const handleBulkDelete = useCallback(() => {
    setProfiles(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setSuccessMessage(`🗑️ ${selectedIds.length}টি প্রোফাইল ডিলিট!`);
  }, [selectedIds]);

  // ============ ফিল্টারড প্রোফাইল ============
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      if (activeTab === 'pending' && profile.status !== 'pending') return false;
      if (activeTab === 'approved' && profile.status !== 'approved') return false;
      if (activeTab === 'rejected' && profile.status !== 'rejected') return false;
      if (activeTab === 'reported' && profile.reportedCount === 0) return false;
      if (statusFilter !== "all" && profile.status !== statusFilter) return false;
      if (genderFilter !== "all" && profile.gender !== genderFilter) return false;
      if (districtFilter !== "all" && profile.district !== districtFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return profile.name.toLowerCase().includes(q) || 
               profile.phone.includes(q) || 
               profile.email.toLowerCase().includes(q) ||
               profile.profession.toLowerCase().includes(q);
      }
      return true;
    });
  }, [profiles, activeTab, statusFilter, genderFilter, districtFilter, searchQuery]);

  // 🔥 handleSelectAll ফাংশন (filteredProfiles এর পরে)
  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredProfiles.length && filteredProfiles.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProfiles.map(p => p.id));
    }
  }, [selectedIds.length, filteredProfiles]);

  // ============ স্ট্যাটিসটিক্স ============
  const stats = useMemo(() => ({
    total: profiles.length,
    male: profiles.filter(p => p.gender === 'male').length,
    female: profiles.filter(p => p.gender === 'female').length,
    pending: profiles.filter(p => p.status === 'pending').length,
    approved: profiles.filter(p => p.status === 'approved').length,
    rejected: profiles.filter(p => p.status === 'rejected').length,
    verified: profiles.filter(p => p.isVerified).length,
    premium: profiles.filter(p => p.isPremium).length,
    blocked: profiles.filter(p => p.isBlocked).length,
    reported: profiles.filter(p => p.reportedCount > 0).length,
    totalViews: profiles.reduce((sum, p) => sum + p.views, 0),
    totalInterests: profiles.reduce((sum, p) => sum + p.interests, 0),
  }), [profiles]);

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-72">
        {/* হেডার */}
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Heart size={20} className="text-[#f85606]" />
            পাত্র-পাত্রী ম্যানেজমেন্ট
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-xl">
              <RefreshCw size={18} />
            </button>
            <Link href="/category/matrimony/create">
              <button className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                <Plus size={16} /> নতুন প্রোফাইল
              </button>
            </Link>
          </div>
        </div>

        {/* সাকসেস মেসেজ */}
        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
            <CheckCircle size={16} className="inline mr-2" />{successMessage}
          </div>
        )}

        <div className="p-6">
          {/* স্ট্যাটিসটিক্স কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">মোট</p><p className="text-lg font-bold">{stats.total}</p></div>
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">পুরুষ</p><p className="text-lg font-bold">{stats.male}</p></div>
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">মহিলা</p><p className="text-lg font-bold">{stats.female}</p></div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">পেন্ডিং</p><p className="text-lg font-bold">{stats.pending}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">অনুমোদিত</p><p className="text-lg font-bold">{stats.approved}</p></div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">বাতিল</p><p className="text-lg font-bold">{stats.rejected}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">ভেরিফাইড</p><p className="text-lg font-bold">{stats.verified}</p></div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">প্রিমিয়াম</p><p className="text-lg font-bold">{stats.premium}</p></div>
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">ব্লক</p><p className="text-lg font-bold">{stats.blocked}</p></div>
            <div className="bg-gradient-to-r from-rose-500 to-red-500 rounded-xl p-2 text-white"><p className="text-[10px] opacity-90">রিপোর্টেড</p><p className="text-lg font-bold">{stats.reported}</p></div>
          </div>

          {/* ট্যাব */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'সব', count: stats.total, color: 'bg-gray-500' },
              { id: 'pending', label: 'পেন্ডিং', count: stats.pending, color: 'bg-yellow-500' },
              { id: 'approved', label: 'অনুমোদিত', count: stats.approved, color: 'bg-green-500' },
              { id: 'rejected', label: 'বাতিল', count: stats.rejected, color: 'bg-red-500' },
              { id: 'reported', label: 'রিপোর্টেড', count: stats.reported, color: 'bg-orange-500' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === tab.id ? `${tab.color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} <span className="text-xs">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* সার্চ ও ফিল্টার */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="নাম, ফোন, ইমেইল বা পেশা দিয়ে খুঁজুন..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" />
              </div>
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white">
                <option value="all">সব লিঙ্গ</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
              </select>
              <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white">
                <option value="all">সব জেলা</option>
                {bangladeshDistricts.slice(0, 10).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* বাল্ক অ্যাকশন */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-blue-800">{selectedIds.length}টি প্রোফাইল সিলেক্ট করা হয়েছে</p>
              <div className="flex gap-2">
                <button onClick={handleBulkApprove} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"><CheckCircle size={14} /> অনুমোদন</button>
                <button onClick={handleBulkReject} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"><XCircle size={14} /> বাতিল</button>
                <button onClick={handleBulkDelete} className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"><Trash2 size={14} /> ডিলিট</button>
              </div>
            </div>
          )}

          {/* প্রোফাইল টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3"><input type="checkbox" checked={selectedIds.length === filteredProfiles.length && filteredProfiles.length > 0} onChange={handleSelectAll} className="w-4 h-4" /></th>
                    <th className="p-3 text-left">প্রোফাইল</th>
                    <th className="p-3 text-left">তথ্য</th>
                    <th className="p-3 text-left">ঠিকানা</th>
                    <th className="p-3 text-center">ভিউ</th>
                    <th className="p-3 text-center">স্ট্যাটাস</th>
                    <th className="p-3 text-center">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className={`hover:bg-gray-50 ${profile.isBlocked ? 'opacity-60' : ''}`}>
                      <td className="p-3"><input type="checkbox" checked={selectedIds.includes(profile.id)} onChange={() => setSelectedIds(prev => prev.includes(profile.id) ? prev.filter(id => id !== profile.id) : [...prev, profile.id])} className="w-4 h-4" /></td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-2xl">
                            {profile.gender === 'male' ? '👨' : '👩'}
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {profile.name}
                              {profile.isVerified && <CheckCircle size={12} className="text-green-500" />}
                              {profile.isPremium && <Crown size={12} className="text-amber-500" />}
                              {profile.isBlocked && <Ban size={12} className="text-red-500" />}
                            </p>
                            <p className="text-xs text-gray-400">{profile.age} বছর • {profile.religion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{profile.profession}</p>
                        <p className="text-xs text-gray-400">{profile.education}</p>
                        <p className="text-xs text-gray-400">{profile.phone}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{profile.village}</p>
                        <p className="text-xs text-gray-400">{profile.district}</p>
                      </td>
                      <td className="p-3 text-center">
                        <p className="text-sm font-medium">{profile.views}</p>
                        <p className="text-xs text-gray-400">❤️ {profile.interests}</p>
                      </td>
                      <td className="p-3 text-center">
                        <StatusBadge status={profile.status} />
                        {profile.reportedCount > 0 && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full ml-1">{profile.reportedCount} রিপোর্ট</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => { setSelectedProfile(profile); setShowDetailModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg" title="বিস্তারিত"><Eye size={16} className="text-blue-500" /></button>
                          
                          <div className="relative">
                            <button onClick={() => setShowActionMenu(showActionMenu === profile.id ? null : profile.id)} className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical size={16} className="text-gray-500" /></button>
                            
                            {showActionMenu === profile.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-30 min-w-[180px]">
                                {profile.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleApprove(profile.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-green-600 flex items-center gap-2"><CheckCircle size={14} /> অনুমোদন</button>
                                    <button onClick={() => handleReject(profile.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"><XCircle size={14} /> বাতিল</button>
                                  </>
                                )}
                                <button onClick={() => handleToggleVerify(profile.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Award size={14} /> {profile.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}</button>
                                <button onClick={() => handleTogglePremium(profile.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Crown size={14} /> {profile.isPremium ? 'প্রিমিয়াম সরান' : 'প্রিমিয়াম করুন'}</button>
                                <button onClick={() => handleToggleBlock(profile.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Ban size={14} /> {profile.isBlocked ? 'আনব্লক' : 'ব্লক'}</button>
                                <Link href={`/chat/${profile.id}?type=matrimony&name=${profile.name}`}>
                                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><MessageCircle size={14} /> মেসেজ</button>
                                </Link>
                                <hr className="my-1" />
                                <button onClick={() => { setShowDeleteConfirm(profile.id); setShowActionMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 size={14} /> ডিলিট</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ডিটেইল মডাল */}
      {showDetailModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2"><User size={18} /> প্রোফাইল বিস্তারিত</h3>
              <button onClick={() => setShowDetailModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-5xl">
                  {selectedProfile.gender === 'male' ? '👨' : '👩'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <StatusBadge status={selectedProfile.status} />
                    {selectedProfile.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ ভেরিফাইড</span>}
                    {selectedProfile.isPremium && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">👑 প্রিমিয়াম</span>}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div><p className="text-xs text-gray-400">বয়স</p><p className="font-medium">{selectedProfile.age} বছর</p></div>
                <div><p className="text-xs text-gray-400">ধর্ম</p><p className="font-medium">{selectedProfile.religion}</p></div>
                <div><p className="text-xs text-gray-400">উচ্চতা</p><p className="font-medium">{selectedProfile.height}</p></div>
                <div><p className="text-xs text-gray-400">ওজন</p><p className="font-medium">{selectedProfile.weight}</p></div>
                <div><p className="text-xs text-gray-400">ব্লাড গ্রুপ</p><p className="font-medium">{selectedProfile.bloodGroup || '-'}</p></div>
                <div><p className="text-xs text-gray-400">গায়ের রং</p><p className="font-medium">{selectedProfile.complexion || '-'}</p></div>
                <div><p className="text-xs text-gray-400">পেশা</p><p className="font-medium">{selectedProfile.profession}</p></div>
                <div><p className="text-xs text-gray-400">শিক্ষা</p><p className="font-medium">{selectedProfile.education}</p></div>
                <div><p className="text-xs text-gray-400">আয়</p><p className="font-medium">{selectedProfile.expectedIncome}</p></div>
                <div><p className="text-xs text-gray-400">পারিবারিক অবস্থা</p><p className="font-medium">{selectedProfile.familyStatus}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400">ঠিকানা</p><p className="font-medium">{selectedProfile.village}, {selectedProfile.district}</p></div>
                <div><p className="text-xs text-gray-400">ফোন</p><p className="font-medium">{selectedProfile.phone}</p></div>
                <div><p className="text-xs text-gray-400">ইমেইল</p><p className="font-medium">{selectedProfile.email}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400">বিবাহ অবস্থা</p><p className="font-medium">{selectedProfile.maritalStatus === 'unmarried' ? 'অবিবাহিত' : selectedProfile.maritalStatus === 'divorced' ? 'ডিভোর্সড' : 'বিধবা/বিধুর'}</p></div>
                {selectedProfile.hasChildren && <div className="col-span-2"><p className="text-xs text-gray-400">সন্তান</p><p className="font-medium">{selectedProfile.childrenCount} টি</p></div>}
                <div className="col-span-2"><p className="text-xs text-gray-400">নিজের সম্পর্কে</p><p className="text-sm">{selectedProfile.about}</p></div>
                {selectedProfile.hobbies && selectedProfile.hobbies.length > 0 && (
                  <div className="col-span-2"><p className="text-xs text-gray-400">আগ্রহ</p><div className="flex flex-wrap gap-1 mt-1">{selectedProfile.hobbies.map((h, i) => <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{h}</span>)}</div></div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6 pt-4 border-t">
                {selectedProfile.status === 'pending' && (
                  <>
                    <button onClick={() => { handleApprove(selectedProfile.id); setShowDetailModal(false); }} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold">অনুমোদন</button>
                    <button onClick={() => { handleReject(selectedProfile.id); setShowDetailModal(false); }} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold">বাতিল</button>
                  </>
                )}
                <button onClick={() => setShowDetailModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বন্ধ করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ডিলিট কনফার্মেশন */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32} className="text-red-500" /></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">প্রোফাইল ডিলিট করবেন?</h3>
              <p className="text-sm text-gray-500 mb-6">এই প্রোফাইল স্থায়ীভাবে ডিলিট হয়ে যাবে।</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold">ডিলিট</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}