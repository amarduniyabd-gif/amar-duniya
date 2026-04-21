"use client";
import { useState, useRef, useCallback, useMemo, memo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, User, 
  Shield, CheckCircle, Flag, X, MessageCircle, Star,
  ChevronLeft, ChevronRight, Calendar, Truck, BadgeCheck,
  FileText, Lock, Eye, ZoomIn, ZoomOut, RotateCcw, Maximize2,
  Sparkles, Crown, TrendingUp, Award, Zap, Clock, Verified,
  ShoppingBag, CreditCard, Wallet, Gift, Send
} from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

type Comment = {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
};

type PostImage = {
  thumbnail: string;
  full: string;
  width: number;
  height: number;
};

// ============ প্রিমিয়াম শেয়ার মেনু ============
const ShareMenu = memo(({ isOpen, onClose, postTitle, postUrl }: { 
  isOpen: boolean; onClose: () => void; postTitle: string; postUrl: string;
}) => {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    { name: 'হোয়াটসঅ্যাপ', icon: '💬', color: 'from-green-400 to-green-600', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`*${postTitle}*\n\n${postUrl}`)}`, '_blank') },
    { name: 'ফেসবুক', icon: '📘', color: 'from-blue-500 to-blue-700', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank') },
    { name: 'মেসেঞ্জার', icon: '💭', color: 'from-purple-500 to-purple-700', action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(postUrl)}&app_id=291494361536619&redirect_uri=${encodeURIComponent(postUrl)}`, '_blank') },
    { name: 'টেলিগ্রাম', icon: '📨', color: 'from-cyan-400 to-cyan-600', action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`, '_blank') },
    { name: 'টুইটার', icon: '🐦', color: 'from-gray-700 to-black', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`, '_blank') },
    { name: 'লিংক কপি', icon: copied ? '✅' : '🔗', color: 'from-gray-500 to-gray-700', action: async () => { try { await navigator.clipboard.writeText(postUrl); setCopied(true); setTimeout(() => { setCopied(false); onClose(); }, 1500); } catch { alert('লিংক কপি করতে সমস্যা হয়েছে'); } } },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-white/50" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            <Share2 size={20} className="text-[#f85606]" /> শেয়ার করুন
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option) => (
            <button key={option.name} onClick={option.action} className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 active:scale-95">
              <div className={`w-14 h-14 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200`}>
                {option.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700">{option.name}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-5 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
          বাতিল
        </button>
      </div>
    </div>
  );
});
ShareMenu.displayName = 'ShareMenu';

// ============ প্রিমিয়াম জুমেবল ইমেজ ============
const ZoomableImage = memo(({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => { e.preventDefault(); const delta = e.deltaY > 0 ? 0.9 : 1.1; setScale(prev => Math.min(Math.max(prev * delta, 1), 5)); }, []);
  const handleMouseDown = useCallback((e: React.MouseEvent) => { if (scale > 1) { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); } }, [scale, position]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (isDragging && scale > 1) { setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); } }, [isDragging, dragStart, scale]);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleDoubleClick = useCallback(() => { setScale(prev => prev === 1 ? 2.5 : 1); if (scale > 1) setPosition({ x: 0, y: 0 }); }, [scale]);
  const handleReset = useCallback(() => { setScale(1); setPosition({ x: 0, y: 0 }); }, []);
  const handleZoomIn = useCallback(() => setScale(prev => Math.min(prev + 0.5, 5)), []);
  const handleZoomOut = useCallback(() => { setScale(prev => Math.max(prev - 0.5, 1)); if (scale <= 1.5) setPosition({ x: 0, y: 0 }); }, [scale]);

  useEffect(() => {
    const img = imgRef.current;
    if (img) { img.addEventListener('wheel', handleWheel as any, { passive: false }); return () => img.removeEventListener('wheel', handleWheel as any); }
  }, [handleWheel]);
  useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button onClick={handleZoomIn} className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"><ZoomIn size={18} /></button>
        <button onClick={handleZoomOut} className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"><ZoomOut size={18} /></button>
        <button onClick={handleReset} className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"><RotateCcw size={18} /></button>
        <button onClick={onClose} className="p-2.5 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 transition-all duration-200"><X size={18} /></button>
      </div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full z-10 font-medium">{Math.round(scale * 100)}%</div>
      <div className="w-full h-full flex items-center justify-center overflow-hidden" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <img ref={imgRef} src={src} alt={alt} draggable={false} onContextMenu={(e) => e.preventDefault()} onDoubleClick={handleDoubleClick}
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in', maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain' }}
          className="select-none rounded-lg" onClick={(e) => e.stopPropagation()} />
      </div>
      <div className="absolute bottom-4 left-4 text-white/50 text-xs bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">🖱️ স্ক্রল জুম • ডাবল ক্লিক • ড্র্যাগ</div>
    </div>
  );
});
ZoomableImage.displayName = 'ZoomableImage';

// ============ প্রিমিয়াম সেলার কার্ড ============
const SellerInfo = memo(({ seller }: { seller: any }) => (
  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-5 shadow-xl border border-white/50 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full blur-lg opacity-40"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <User size={24} className="text-white" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-800 text-lg">{seller.name}</p>
            {seller.verified && <CheckCircle size={16} className="text-blue-500 fill-blue-500" />}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              <Star size={10} className="fill-amber-500 text-amber-500" /> {seller.rating}
            </span>
            <span className="text-xs text-gray-500">{seller.totalAds} টি পোস্ট</span>
          </div>
        </div>
      </div>
      <div className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold">
        <Shield size={12} /> বিশ্বস্ত
      </div>
    </div>
  </div>
));
SellerInfo.displayName = 'SellerInfo';

// ============ প্রিমিয়াম কমেন্ট ============
const CommentItem = memo(({ comment }: { comment: Comment }) => (
  <div className="border-b border-gray-100/50 pb-4 last:border-0">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
        {comment.userAvatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-800">{comment.userName}</span>
          {comment.rating > 0 && <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-full">{[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < comment.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"} />)}</div>}
          <span className="text-[10px] text-gray-400">{comment.time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1.5">{comment.text}</p>
      </div>
    </div>
    {comment.replies?.map((reply) => (
      <div key={reply.id} className="ml-10 mt-3 pl-3 border-l-2 border-[#f85606]/20">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm flex-shrink-0">{reply.userAvatar}</div>
          <div><div className="flex items-center gap-2"><span className="font-semibold text-sm text-gray-800">{reply.userName}</span><span className="text-[10px] text-gray-400">{reply.time}</span></div><p className="text-sm text-gray-600 mt-1">{reply.text}</p></div>
        </div>
      </div>
    ))}
  </div>
));
CommentItem.displayName = 'CommentItem';

// ============ মেইন পেজ ============
export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const [post, setPost] = useState(() => {
    if (typeof window !== 'undefined') {
      const posts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
      const found = posts.find((p: any) => p.id === postId);
      if (found) {
        return {
          ...found,
          seller: { name: "রহিম উদ্দিন", phone: found.phone || "০১৭XXXXXXXX", whatsapp: found.phone || "017XXXXXXXX", verified: true, rating: 4.9, totalAds: 12 },
          originalPrice: found.price ? found.price + 10000 : 85000, time: "২ ঘন্টা আগে", urgent: found.isFeatured || false, featured: found.isFeatured || false,
        };
      }
    }
    return {
      id: parseInt(postId), title: "iPhone 15 Pro Max - 128GB", price: 75000, originalPrice: 85000, location: "ঢাকা, বাংলাদেশ",
      time: "২ ঘন্টা আগে", condition: "new", brand: "Apple", warranty: "12", delivery: "delivery",
      seller: { name: "রহিম উদ্দিন", phone: "০১৭XXXXXXXX", whatsapp: "017XXXXXXXX", verified: true, rating: 4.9, totalAds: 12 },
      description: "ব্র্যান্ড নতুন iPhone 15 Pro Max। 128GB স্টোরেজ, টাইটানিয়াম ফিনিশ। ফুল বক্স সহ সব এক্সেসরিজ। ব্যাটারি হেলথ 100%। ১ বছর ওয়ারেন্টি।",
      images: [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }, { thumbnail: "📱", full: "📱", width: 400, height: 400 }, { thumbnail: "📱", full: "📱", width: 400, height: 400 }, { thumbnail: "📱", full: "📱", width: 400, height: 400 }],
      views: 1240, likes: 56,
    };
  });

  const [comments, setComments] = useState<Comment[]>(() => [
    { id: 1, userName: "করিম মিয়া", userAvatar: "👨", rating: 5, text: "দাম একটু কম হবে? আগ্রহী আছি।", time: "১ ঘন্টা আগে", likes: 5, isLiked: false, replies: [{ id: 11, userName: "রহিম উদ্দিন", userAvatar: "👨‍💼", rating: 0, text: "হ্যাঁ ভাই, নগদে নিলে ২,০০০ টাকা ছাড় দিতে পারি।", time: "৩০ মিনিট আগে", likes: 3, isLiked: false }] },
    { id: 2, userName: "শাহিনুর রহমান", userAvatar: "👨", rating: 4, text: "প্রোডাক্ট কন্ডিশন কেমন? স্ক্র্যাচ আছে?", time: "৩ ঘন্টা আগে", likes: 2, isLiked: false, replies: [] },
  ]);

  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  useEffect(() => setMounted(true), []);

  const warrantyText = useMemo(() => {
    switch(post.warranty) { case "1": return "১ মাস"; case "3": return "৩ মাস"; case "6": return "৬ মাস"; case "12": return "১ বছর"; case "24": return "২ বছর"; default: return null; }
  }, [post.warranty]);

  const images = useMemo(() => Array.isArray(post.images) && post.images.length > 0 ? post.images : [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }, { thumbnail: "📱", full: "📱", width: 400, height: 400 }, { thumbnail: "📱", full: "📱", width: 400, height: 400 }, { thumbnail: "📱", full: "📱", width: 400, height: 400 }], [post.images]);
  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleLike = useCallback(() => { setIsLiked(prev => !prev); setPost((prev: any) => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 })); }, [isLiked]);
  const handleShare = useCallback(() => setShowShareMenu(true), []);
  const handleInternalChat = useCallback(() => router.push(`/chat/${post.id}`), [router, post.id]);
  const handleWhatsAppChat = useCallback(() => { const phone = post.seller.whatsapp || post.seller.phone; window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`হ্যালো, আমি "${post.title}" সম্পর্কে জানতে চাই।`)}`, '_blank'); }, [post.seller, post.title]);
  const handleDocumentSuccess = useCallback(() => alert("✅ ডকুমেন্ট সার্ভিস সক্রিয়!"), []);
  const handlePrevImage = useCallback(() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1), [images.length]);
  const handleNextImage = useCallback(() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1), [images.length]);
  const handleImageClick = useCallback((imageUrl: string) => { setFullscreenImage(imageUrl); setShowFullscreen(true); }, []);
  const handleAddComment = useCallback(() => { if (!newComment.trim()) return; setComments(prev => [{ id: Date.now(), userName: "বর্তমান ব্যবহারকারী", userAvatar: "👤", rating: newRating, text: newComment, time: "এখনই", likes: 0, isLiked: false, replies: [] }, ...prev]); setNewComment(""); setNewRating(0); }, [newComment, newRating]);
  const handleReport = useCallback(() => { alert("রিপোর্ট করা হয়েছে"); setShowReportModal(false); }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      
      {/* হেডার */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className="p-2.5 bg-gray-100 rounded-xl hover:bg-red-50 transition-all duration-200 active:scale-95 group">
              <Heart size={20} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-600 group-hover:text-red-500"} />
            </button>
            <button onClick={handleShare} className="p-2.5 bg-gray-100 rounded-xl hover:bg-blue-50 transition-all duration-200 active:scale-95">
              <Share2 size={20} className="text-gray-600" />
            </button>
            <button onClick={() => setShowReportModal(true)} className="p-2.5 bg-gray-100 rounded-xl hover:bg-red-50 transition-all duration-200 active:scale-95">
              <Flag size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        
        {/* ইমেজ গ্যালারি */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-5">
          <div className="relative">
            <div className="relative h-[350px] md:h-[450px] bg-gradient-to-br from-gray-900/5 via-gray-50 to-gray-100 flex items-center justify-center cursor-zoom-in" onClick={() => handleImageClick(images[activeImage]?.full || images[activeImage]?.thumbnail)}>
              {images[activeImage]?.thumbnail?.startsWith('data:') ? (
                <img src={images[activeImage].thumbnail} alt={post.title} className="w-full h-full object-contain p-4" />
              ) : (
                <div className="text-9xl">{images[activeImage]?.thumbnail || "📱"}</div>
              )}
              
              {/* ব্যাজ */}
              <div className="absolute top-5 left-5 flex gap-2">
                {post.urgent && <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"><Zap size={12} /> Urgent</span>}
                {post.featured && <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"><Crown size={12} /> ফিচার্ড</span>}
              </div>
              
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Maximize2 size={14} /> ক্লিক করে বড় দেখুন
              </div>
            </div>
            
            {images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl hover:bg-white transition-all duration-200 active:scale-95 border border-white">
                  <ChevronLeft size={22} className="text-gray-700" />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl hover:bg-white transition-all duration-200 active:scale-95 border border-white">
                  <ChevronRight size={22} className="text-gray-700" />
                </button>
              </>
            )}
            
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                {images.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`h-2 rounded-full transition-all duration-300 ${activeImage === idx ? "w-8 bg-gradient-to-r from-[#f85606] to-orange-500" : "w-2 bg-white/60"}`} />
                ))}
              </div>
            )}
          </div>
          
          {/* থাম্বনেইল */}
          {images.length > 1 && (
            <div className="flex gap-3 p-5 bg-gray-50/50 border-t border-gray-100 overflow-x-auto">
              {images.map((img: any, idx: number) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 overflow-hidden shadow-md ${
                  activeImage === idx ? "border-[#f85606] ring-4 ring-[#f85606]/20 scale-105" : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300"
                }`}>
                  {img.thumbnail?.startsWith('data:') ? (
                    <img src={img.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{img.thumbnail}</span>
                  )}
                  {activeImage === idx && <div className="absolute inset-0 bg-[#f85606]/10" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* অ্যাকশন বাটন */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button onClick={handleInternalChat} className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
            <MessageCircle size={18} /> চ্যাট
          </button>
          <button onClick={handleWhatsAppChat} className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.032 2.014c-5.514 0-9.988 4.474-9.988 9.988 0 1.762.458 3.494 1.328 5.008l-1.408 5.135 5.262-1.38c1.465.799 3.114 1.225 4.806 1.225 5.514 0 9.988-4.474 9.988-9.988s-4.474-9.988-9.988-9.988z"/></svg> WhatsApp
          </button>
          <button onClick={() => setShowPhone(!showPhone)} className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border border-gray-200">
            <Phone size={18} /> কল
          </button>
        </div>
        
        {showPhone && (
          <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 text-center">
            <a href={`tel:${post.seller.phone}`} className="text-lg font-bold text-[#f85606]">{post.seller.phone}</a>
          </div>
        )}

        {/* টাইটেল ও দাম */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Eye size={14} /> {post.views} ভিউ</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {post.time}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {post.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-[#f85606]">৳{post.price.toLocaleString()}</div>
              {post.originalPrice && <div className="text-sm text-gray-400 line-through">৳{post.originalPrice.toLocaleString()}</div>}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${post.condition === 'new' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200'}`}>
              {post.condition === 'new' ? '✨ নতুন' : '📦 পুরাতন'}
            </span>
            {post.brand && <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200"><BadgeCheck size={12} /> {post.brand}</span>}
            {warrantyText && <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-3 py-1.5 rounded-full border border-purple-200"><Calendar size={12} /> {warrantyText} ওয়ারেন্টি</span>}
            {post.delivery === 'delivery' && <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 px-3 py-1.5 rounded-full border border-cyan-200"><Truck size={12} /> হোম ডেলিভারি</span>}
          </div>
        </div>

        <SellerInfo seller={post.seller} />

        {/* ডকুমেন্ট সার্ভিস */}
        <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl p-6 shadow-xl border border-blue-200 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">📄 ডকুমেন্ট সার্ভিস <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full">নিরাপদ</span></h3>
                <p className="text-sm text-gray-500">পণ্যের কাগজপত্র নিরাপদে সংরক্ষণ • ডেলিভারির পর রিলিজ</p>
              </div>
            </div>
            <button onClick={() => setShowDocumentModal(true)} className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
              <Lock size={16} /> ডকুমেন্ট নিন ({Math.round(post.price * 0.02)} টাকা)
            </button>
          </div>
        </div>

        {/* বিবরণ */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg"><FileText size={20} className="text-[#f85606]" /> পণ্যের বিবরণ</h2>
          <p className="text-gray-600 leading-relaxed">{post.description}</p>
        </div>

        {/* কমেন্ট */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-5">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2 text-lg"><MessageCircle size={20} className="text-[#f85606]" /> মন্তব্য ({comments.length})</h2>
          
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">👤</div>
              <div className="flex-1">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="আপনার মন্তব্য লিখুন..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent text-sm" />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setNewRating(star)} className="p-0.5"><Star size={18} className={star <= newRating ? "text-amber-500 fill-amber-500" : "text-gray-300"} /></button>
                    ))}
                  </div>
                  <button onClick={handleAddComment} disabled={!newComment.trim()} className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"><Send size={14} /> পোস্ট</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
          </div>
        </div>

        {/* নিরাপত্তা টিপস */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-5 border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Shield size={18} className="text-green-600" /></div>
            <div>
              <p className="font-bold text-gray-800">🔒 নিরাপদ লেনদেনের টিপস</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                <span>✓ পণ্য দেখে কিনুন</span>
                <span>✓ আগাম টাকা নয়</span>
                <span>✓ ডকুমেন্ট ব্যবহার করুন</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* মডাল */}
      {showFullscreen && fullscreenImage && <ZoomableImage src={fullscreenImage} alt={post.title} onClose={() => setShowFullscreen(false)} />}
      <ShareMenu isOpen={showShareMenu} onClose={() => setShowShareMenu(false)} postTitle={post.title} postUrl={postUrl} />
      <PaymentModal isOpen={showDocumentModal} onClose={() => setShowDocumentModal(false)} onSuccess={handleDocumentSuccess} title="ডকুমেন্ট সার্ভিস" amount={post.price * 0.02} description="পণ্যের কাগজপত্র নিরাপদে সংরক্ষণ" />
      
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">⚠️ রিপোর্ট করুন</h3><button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button></div>
            <p className="text-gray-600 mb-5">আপনি কি এই পোস্টটি রিপোর্ট করতে চান?</p>
            <div className="flex gap-3"><button onClick={handleReport} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold">হ্যাঁ</button><button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">না</button></div>
          </div>
        </div>
      )}
    </div>
  );
}