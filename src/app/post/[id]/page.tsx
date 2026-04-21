"use client";
import { useState, useRef, useCallback, useMemo, memo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, User, 
  Shield, CheckCircle, Flag, X, MessageCircle, Star,
  ChevronLeft, ChevronRight, Calendar, Truck, BadgeCheck,
  FileText, Lock, Eye, ZoomIn, ZoomOut, RotateCcw, Maximize2,
  Link2, Copy, Check, MessageSquare, QrCode, Send, AlertCircle
} from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

// সোশ্যাল মিডিয়া আইকনের জন্য SVG কম্পোনেন্ট
const FacebookIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ... বাকি টাইপ ডেফিনিশন আগের মতই থাকবে ...

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

// ============ অপ্টিমাইজড জুমেবল ইমেজ কম্পোনেন্ট ============
const ZoomableImage = memo(({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 1), 5));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  }, [isDragging, scale]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleDoubleClick = useCallback(() => {
    setScale(prev => prev === 1 ? 2.5 : 1);
    if (scale > 1) setPosition({ x: 0, y: 0 });
  }, [scale]);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => setScale(prev => Math.min(prev + 0.5, 5)), []);
  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.5, 1));
    if (scale <= 1.5) setPosition({ x: 0, y: 0 });
  }, [scale]);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.addEventListener('wheel', handleWheel as any, { passive: false });
      return () => img.removeEventListener('wheel', handleWheel as any);
    }
  }, [handleWheel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button onClick={handleZoomIn} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
          <RotateCcw size={20} />
        </button>
        <button onClick={onClose} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
          <X size={20} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full z-10">
        {Math.round(scale * 100)}%
      </div>

      <div 
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDoubleClick={handleDoubleClick}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
          className="select-none pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="absolute bottom-4 left-4 text-white/60 text-xs bg-black/30 px-3 py-1.5 rounded-full">
        🖱️ স্ক্রল • ডাবল ক্লিক • ড্র্যাগ
      </div>
    </div>
  );
});
ZoomableImage.displayName = 'ZoomableImage';

// ============ অপ্টিমাইজড সেলার ইনফো ============
const SellerInfo = memo(({ seller }: { seller: any }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <User size={18} className="text-[#f85606]" />
      বিক্রেতার তথ্য
    </h2>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{seller.name}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>⭐ {seller.rating}</span>
          <span>•</span>
          <span>{seller.totalAds} টি পোস্ট</span>
        </div>
      </div>
      {seller.verified && (
        <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <CheckCircle size={12} /> ভেরিফাইড
        </div>
      )}
    </div>
  </div>
));
SellerInfo.displayName = 'SellerInfo';

// ============ অপ্টিমাইজড কমেন্ট আইটেম ============
const CommentItem = memo(({ comment }: { comment: Comment }) => (
  <div className="border-b border-gray-100 pb-3">
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg flex-shrink-0">
        {comment.userAvatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-gray-800">{comment.userName}</span>
          {comment.rating > 0 && (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < comment.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
              ))}
            </div>
          )}
          <span className="text-[10px] text-gray-400">{comment.time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 break-words">{comment.text}</p>
      </div>
    </div>
    {comment.replies?.map((reply) => (
      <div key={reply.id} className="ml-8 md:ml-12 mt-3">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg flex-shrink-0">
            {reply.userAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-800">{reply.userName}</span>
              <span className="text-[10px] text-gray-400">{reply.time}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1 break-words">{reply.text}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
));
CommentItem.displayName = 'CommentItem';

// ============ রিয়েকশন ইমোজি লিস্ট ============
const REACTIONS = [
  { emoji: "👍", label: "ভালো", count: 24 },
  { emoji: "❤️", label: "পছন্দ", count: 18 },
  { emoji: "😊", label: "দারুণ", count: 12 },
  { emoji: "🎉", label: "অভিনন্দন", count: 8 }
];

const EXTRA_REACTIONS = ["👍", "❤️", "😊", "🎉", "👏", "🙌", "🤝", "⭐"];

// ============ মেইন পেজ ============
export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [reactions, setReactions] = useState(REACTIONS);
  
  const commentInputRef = useRef<HTMLInputElement>(null);

  // পোস্ট ডাটা - লোকাল স্টোরেজ থেকে লেজি লোড
  const [post, setPost] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        id: parseInt(postId),
        title: "iPhone 15 Pro Max - 128GB",
        price: 75000,
        originalPrice: 85000,
        location: "ঢাকা",
        time: "২ ঘন্টা আগে",
        condition: "new",
        brand: "Apple",
        warranty: "12",
        delivery: "pickup",
        seller: {
          name: "রহিম উদ্দিন",
          phone: "০১৭XXXXXXXX",
          whatsapp: "017XXXXXXXX",
          verified: true,
          rating: 4.8,
          totalAds: 12,
        },
        description: "ব্র্যান্ড নতুন iPhone 15 Pro Max। 128GB স্টোরেজ।",
        images: [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }],
        views: 1240,
        likes: 56,
        urgent: false,
        featured: false,
      };
    }
    
    try {
      const posts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
      const found = posts.find((p: any) => p.id === postId);
      if (found) {
        return {
          ...found,
          seller: {
            name: found.sellerName || "রহিম উদ্দিন",
            phone: found.phone || "০১৭XXXXXXXX",
            whatsapp: found.phone || "017XXXXXXXX",
            verified: found.verified || true,
            rating: 4.8,
            totalAds: 12,
          },
          originalPrice: found.price ? found.price + 10000 : 85000,
          time: "২ ঘন্টা আগে",
          urgent: found.isFeatured || false,
          featured: found.isFeatured || false,
          description: found.description || "ব্র্যান্ড নতুন iPhone 15 Pro Max। 128GB স্টোরেজ।",
          images: found.images?.length ? found.images : [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }],
          views: found.views || 1240,
          likes: found.likes || 56,
        };
      }
    } catch (e) {
      console.error('Failed to load post:', e);
    }
    
    return {
      id: parseInt(postId),
      title: "iPhone 15 Pro Max - 128GB",
      price: 75000,
      originalPrice: 85000,
      location: "ঢাকা",
      time: "২ ঘন্টা আগে",
      condition: "new",
      brand: "Apple",
      warranty: "12",
      delivery: "pickup",
      seller: {
        name: "রহিম উদ্দিন",
        phone: "০১৭XXXXXXXX",
        whatsapp: "017XXXXXXXX",
        verified: true,
        rating: 4.8,
        totalAds: 12,
      },
      description: "ব্র্যান্ড নতুন iPhone 15 Pro Max। 128GB স্টোরেজ।",
      images: [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }],
      views: 1240,
      likes: 56,
      urgent: false,
      featured: false,
    };
  });

  const [comments, setComments] = useState<Comment[]>(() => [
    {
      id: 1, userName: "করিম মিয়া", userAvatar: "👨", rating: 5,
      text: "দাম একটু কম হবে? আগ্রহী আছি।", time: "১ ঘন্টা আগে", likes: 5, isLiked: false,
      replies: [{
        id: 11, userName: "রহিম উদ্দিন (বিক্রেতা)", userAvatar: "👨‍💼", rating: 0,
        text: "হ্যাঁ, নগদে নিলে ২০০০ টাকা ছাড় দিতে পারি।", time: "৩০ মিনিট আগে", likes: 3, isLiked: false,
      }],
    },
    {
      id: 2, userName: "শাহিনুর রহমান", userAvatar: "👨", rating: 4,
      text: "প্রোডাক্ট দেখতে কেমন?", time: "৩ ঘন্টা আগে", likes: 2, isLiked: false, replies: [],
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // মেমোইজড ভ্যালুজ
  const warrantyText = useMemo(() => {
    switch(post.warranty) {
      case "1": return "১ মাস ওয়ারেন্টি";
      case "3": return "৩ মাস ওয়ারেন্টি";
      case "6": return "৬ মাস ওয়ারেন্টি";
      case "12": return "১ বছর ওয়ারেন্টি";
      case "24": return "২ বছর ওয়ারেন্টি";
      default: return null;
    }
  }, [post.warranty]);

  const images = useMemo(() => {
    if (Array.isArray(post.images) && post.images.length > 0) {
      return post.images;
    }
    return [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }];
  }, [post.images]);

  // কলব্যাক ফাংশন
  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setPost((prev: any) => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }));
  }, [isLiked]);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleShareWithPlatform = useCallback((platform: string) => {
    const url = window.location.href;
    const text = `${post.title} - দাম: ৳${post.price.toLocaleString()}`;
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      messenger: `fb-messenger://share/?link=${encodeURIComponent(url)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareModal(false);
  }, [post.title, post.price]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("লিংক কপি করতে সমস্যা হয়েছে");
    }
  }, []);

  const handleReaction = useCallback((emoji: string) => {
    setSelectedReaction(prev => prev === emoji ? null : emoji);
    setShowReactionBar(false);
    
    setReactions(prev => prev.map(r => 
      r.emoji === emoji 
        ? { ...r, count: selectedReaction === emoji ? r.count - 1 : r.count + 1 }
        : r
    ));
  }, [selectedReaction]);

  const handleInternalChat = useCallback(() => {
    router.push(`/chat/${post.id}`);
  }, [router, post.id]);

  const handleWhatsAppChat = useCallback(() => {
    const phone = post.seller.whatsapp || post.seller.phone;
    const message = `হ্যালো, আমি "${post.title}" পণ্যটি সম্পর্কে জানতে চাই।`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  }, [post.seller, post.title]);

  const handleDocumentSuccess = useCallback(() => {
    alert("ডকুমেন্ট সার্ভিস সক্রিয়! ক্রেতা পণ্য পেলে ডকুমেন্ট পাবেন।");
  }, []);

  const handlePrevImage = useCallback(() => {
    setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);

  const handleImageClick = useCallback((imageUrl: string) => {
    setFullscreenImage(imageUrl);
    setShowFullscreen(true);
  }, []);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      userName: "বর্তমান ব্যবহারকারী",
      userAvatar: "👤",
      rating: newRating,
      text: newComment,
      time: "এখনই",
      likes: 0,
      isLiked: false,
      replies: [],
    };
    
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
    setNewRating(0);
  }, [newComment, newRating]);

  const handleReport = useCallback(() => {
    alert("রিপোর্ট করা হয়েছে। আমাদের টিম দ্রুত ব্যবস্থা নিবে।");
    setShowReportModal(false);
  }, []);

  const handleQrGenerate = useCallback(() => {
    alert("QR কোড ফিচার শীঘ্রই আসছে!");
  }, []);

  // সারফেসে রেন্ডার করবেন না যদি মাউন্টেড না হয়
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#f85606] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b shadow-sm flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1 active:scale-95 transition">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex gap-3">
          <button onClick={handleLike} className="p-1 active:scale-95 transition">
            <Heart size={22} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500"} />
          </button>
          <button onClick={handleShare} className="p-1 active:scale-95 transition">
            <Share2 size={22} className="text-gray-500" />
          </button>
          <button onClick={() => setShowReportModal(true)} className="p-1 active:scale-95 transition">
            <Flag size={22} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        
        {/* ইমেজ গ্যালারি */}
        <div className="bg-white">
          <div className="relative">
            <div 
              className="relative h-72 md:h-80 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center cursor-zoom-in"
              onClick={() => handleImageClick(images[activeImage]?.full || images[activeImage]?.thumbnail)}
            >
              {images[activeImage]?.thumbnail?.startsWith('data:') ? (
                <img 
                  src={images[activeImage].thumbnail} 
                  alt={post.title} 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="text-8xl">{images[activeImage]?.thumbnail || "📱"}</div>
              )}
              
              {post.urgent && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Urgent
                </div>
              )}
              {post.featured && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ⭐ ফিচার্ড
                </div>
              )}
              
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Maximize2 size={12} />
                ক্লিক করে বড় দেখুন
              </div>
            </div>
            
            {images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow-md active:scale-95">
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow-md active:scale-95">
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImage === idx ? "w-6 bg-[#f85606]" : "w-1.5 bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto border-t">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-xl border-2 transition flex-shrink-0 ${
                    activeImage === idx ? "border-[#f85606]" : "border-transparent"
                  }`}
                >
                  {img.thumbnail?.startsWith('data:') ? (
                    <img src={img.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" loading="lazy" />
                  ) : (
                    img.thumbnail
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* চ্যাট বাটন */}
        <div className="p-4">
          <div className="flex gap-2">
            <button onClick={handleInternalChat} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 transition">
              <MessageCircle size={18} /> চ্যাট করুন
            </button>
            <button onClick={handleWhatsAppChat} className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.032 2.014c-5.514 0-9.988 4.474-9.988 9.988 0 1.762.458 3.494 1.328 5.008l-1.408 5.135 5.262-1.38c1.465.799 3.114 1.225 4.806 1.225 5.514 0 9.988-4.474 9.988-9.988s-4.474-9.988-9.988-9.988z"/>
              </svg>
              হোয়াটসঅ্যাপ
            </button>
            <button onClick={() => setShowPhone(!showPhone)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm active:scale-95 transition">
              <Phone size={18} /> কল
            </button>
          </div>
          {showPhone && (
            <div className="mt-2 text-center bg-white rounded-xl p-2 shadow animate-slideDown">
              <a href={`tel:${post.seller.phone}`} className="text-sm text-[#f85606] font-medium">{post.seller.phone}</a>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          
          {/* টাইটেল ও দাম */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black text-[#f85606]">৳{post.price.toLocaleString()}</span>
              {post.originalPrice && (
                <span className="text-sm text-gray-400 line-through">৳{post.originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${post.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {post.condition === 'new' ? '✨ নতুন' : '📦 পুরাতন'}
              </span>
              {post.brand && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  <BadgeCheck size={12} /> {post.brand}
                </span>
              )}
              {warrantyText && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  <Calendar size={12} /> {warrantyText}
                </span>
              )}
              {post.delivery === 'delivery' && (
                <span className="inline-flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                  <Truck size={12} /> হোম ডেলিভারি
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>🔍 {post.views} বার দেখা</span>
              <span>❤️ {post.likes} লাইক</span>
              <span>📅 {post.time}</span>
            </div>
          </div>

          <SellerInfo seller={post.seller} />

          {/* ডকুমেন্ট সার্ভিস */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">📄 ডকুমেন্ট সার্ভিস</h3>
                  <p className="text-xs text-gray-500">পণ্যের কাগজপত্র নিরাপদে রাখুন</p>
                </div>
              </div>
              <button onClick={() => setShowDocumentModal(true)} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md active:scale-95 transition">
                <Lock size={14} /> ডকুমেন্ট নিন ({Math.round(post.price * 0.02)} টাকা)
              </button>
            </div>
          </div>

          {/* বিবরণ */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Eye size={18} className="text-[#f85606]" /> পণ্যের বিবরণ
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
          </div>

          {/* লোকেশন */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#f85606]" /> অবস্থান
            </h2>
            <p className="text-sm text-gray-600">{post.location}</p>
          </div>

          {/* রিয়েকশন এবং শেয়ার বার */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* ৪টি ইমোজি রিয়েকশন */}
              <div className="flex items-center gap-2">
                {reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction.emoji)}
                    className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${
                      selectedReaction === reaction.emoji 
                        ? 'bg-orange-100 text-[#f85606]' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{reaction.emoji}</span>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800">
                      {reaction.count}
                    </span>
                    {selectedReaction === reaction.emoji && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#f85606] rounded-full border-2 border-white" />
                    )}
                  </button>
                ))}
                
                {/* আরও রিয়েকশন বাটন */}
                <div className="relative">
                  <button
                    onClick={() => setShowReactionBar(!showReactionBar)}
                    className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    <span className="text-xl">😊</span>
                  </button>
                  
                  {showReactionBar && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-xl p-2 flex gap-1 z-30 animate-slideUp">
                      {EXTRA_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center text-2xl transition hover:scale-110"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* শেয়ার বাটন */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f85606] to-orange-500 text-white rounded-full hover:shadow-lg transition-all active:scale-95"
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">শেয়ার করুন</span>
              </button>
            </div>
          </div>

          {/* কমেন্ট */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-[#f85606]" /> মন্তব্য ({comments.length})
            </h2>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg flex-shrink-0">
                  👤
                </div>
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="আপনার মন্তব্য লিখুন..."
                  className="flex-1 p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  onClick={handleAddComment} 
                  disabled={!newComment.trim()} 
                  className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition flex items-center gap-1"
                >
                  <Send size={14} /> পোস্ট
                </button>
              </div>
              <div className="flex items-center gap-2 ml-10">
                <span className="text-xs text-gray-500">রেটিং:</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} onClick={() => setNewRating(star)}>
                      <Star size={16} className={star <= newRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

          {/* নিরাপত্তা টিপস */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">নিরাপদ লেনদেনের টিপস</p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>✓ পণ্য দেখে কেনাকাটা করুন</li>
                  <li>✓ আগাম টাকা পাঠাবেন না</li>
                  <li>✓ ডকুমেন্ট সার্ভিস ব্যবহার করুন</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ফুলস্ক্রিন জুম মডাল */}
      {showFullscreen && fullscreenImage && (
        <ZoomableImage 
          src={fullscreenImage} 
          alt={post.title} 
          onClose={() => setShowFullscreen(false)} 
        />
      )}

      {/* মডার্ন শেয়ার মডাল */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden animate-slideUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">শেয়ার করুন</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">{post.title}</p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => handleShareWithPlatform('facebook')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                    <FacebookIcon size={28} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Facebook</span>
                </button>

                <button
                  onClick={() => handleShareWithPlatform('whatsapp')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition">
                    <MessageSquare size={28} className="text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShareWithPlatform('twitter')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center transition">
                    <TwitterIcon size={28} className="text-sky-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Twitter</span>
                </button>

                <button
                  onClick={() => handleShareWithPlatform('messenger')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition">
                    <MessageCircle size={28} className="text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Messenger</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleShareWithPlatform('linkedin')}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                >
                  <LinkedinIcon size={20} className="text-blue-700" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="text-green-600" />
                      <span className="text-sm font-medium text-green-600">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Link2 size={20} className="text-gray-600" />
                      <span className="text-sm font-medium">লিংক কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <QrCode size={24} className="text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">QR কোড</p>
                    <p className="text-xs text-gray-500">স্ক্যান করে দেখুন</p>
                  </div>
                </div>
                <button 
                  onClick={handleQrGenerate}
                  className="text-[#f85606] text-sm font-medium hover:underline"
                >
                  জেনারেট করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* পেমেন্ট মডাল */}
      <PaymentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        onSuccess={handleDocumentSuccess}
        title="ডকুমেন্ট সার্ভিস"
        amount={post.price * 0.02}
        description="পণ্যের কাগজপত্র নিরাপদে সংরক্ষণ ও ডেলিভারির পর রিলিজ"
      />

      {/* রিপোর্ট মডাল */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                রিপোর্ট করুন
              </h3>
              <button onClick={() => setShowReportModal(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">আপনি কি এই পোস্টটি রিপোর্ট করতে চান? আমাদের টিম এটি রিভিউ করবে।</p>
            <div className="space-y-2 mb-4">
              {['জাল পণ্য', 'প্রতারণামূলক তথ্য', 'অনুপযুক্ত কন্টেন্ট', 'স্প্যাম'].map((reason) => (
                <label key={reason} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="radio" name="reportReason" className="accent-[#f85606]" />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleReport} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 transition">
                রিপোর্ট করুন
              </button>
              <button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-200 py-2 rounded-xl font-medium hover:bg-gray-300 transition">
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}