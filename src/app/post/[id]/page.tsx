// @ts-nocheck
"use client";
import { useState, useRef, useCallback, useMemo, memo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, User, 
  Shield, CheckCircle, Flag, X, MessageCircle, Star,
  ChevronLeft, ChevronRight, Calendar, Truck, BadgeCheck,
  FileText, Lock, Eye, ZoomIn, ZoomOut, RotateCcw, Maximize2
} from "lucide-react";
import PaymentModal from "@/components/PaymentModal";
import { getSupabaseClient } from "@/lib/supabase/client";

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

// ============ জুমেবল ইমেজ কম্পোনেন্ট ============
const ZoomableImage = memo(({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 1), 5));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleDoubleClick = useCallback(() => {
    setScale(prev => prev === 1 ? 2.5 : 1);
    if (scale > 1) setPosition({ x: 0, y: 0 });
  }, [scale]);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 5));
  }, []);

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
      <div className="w-full h-full flex items-center justify-center overflow-hidden" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <img ref={imgRef} src={src} alt={alt} draggable={false} onContextMenu={(e) => e.preventDefault()} onDoubleClick={handleDoubleClick}
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging ? 'none' : 'transform 0.2s ease-out', cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in', maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
          className="select-none" onClick={(e) => e.stopPropagation()} />
      </div>
      <div className="absolute bottom-4 left-4 text-white/60 text-xs bg-black/30 px-3 py-1.5 rounded-full">
        🖱️ স্ক্রল করে জুম • ডাবল ক্লিক • ড্র্যাগ করে মুভ
      </div>
    </div>
  );
});
ZoomableImage.displayName = 'ZoomableImage';

// ============ সেলার ইনফো ============
const SellerInfo = memo(({ seller }: { seller: any }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <User size={18} className="text-[#f85606]" />
      বিক্রেতার তথ্য
    </h2>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{seller.name || 'বিক্রেতা'}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>⭐ {seller.rating || '৪.৮'}</span>
          <span>•</span>
          <span>{seller.totalAds || '১২'} টি পোস্ট</span>
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

// ============ কমেন্ট আইটেম ============
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
    {comment.replies?.map((reply: any) => (
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

// ============ মেইন পেজ ============
export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  
  const [post, setPost] = useState<any>({
    id: postId,
    title: "লোড হচ্ছে...",
    price: 0,
    location: "ঢাকা",
    condition: "new",
    seller: { name: "", verified: false },
    images: [],
    views: 0,
    likes: 0,
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  // ✅ Supabase থেকে পোস্ট লোড
  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const supabase = getSupabaseClient();
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          seller:profiles!seller_id(id, name, phone, is_verified),
          images:post_images(thumbnail_url, full_url, width, height, order_index)
        `)
        .eq('id', postId)
        .single();
      
      if (data && !error) {
  setPost({
    ...data,
    originalPrice: data.original_price,
    seller: {
      name: data.seller?.name || 'বিক্রেতা',
      phone: data.seller?.phone || '০১৭XXXXXXXX',
      verified: data.seller?.is_verified || false,
      rating: 4.8,
      totalAds: 12,
    },
    images: data.images?.sort((a: any, b: any) => a.order_index - b.order_index).map((img: any) => ({
      thumbnail: img.thumbnail_url,
      full: img.full_url,
      width: img.width || 400,
      height: img.height || 400,
    })) || [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }],
    time: timeAgo(data.created_at),
    urgent: data.is_urgent,
    featured: data.is_featured,
  });
  
  // ✅ শুধু এই লাইনটাই চেঞ্জ করো
  setPost((prev: any) => ({ ...prev, views: (prev.views || 0) + 1 }));
  
} else {
  loadFromLocalStorage();
}
      
      setLoading(false);
    };
    
    const loadFromLocalStorage = () => {
      if (typeof window !== 'undefined') {
        const posts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
        const found = posts.find((p: any) => String(p.id) === String(postId));
        if (found) {
          setPost({
            ...found,
            seller: {
              name: found.seller?.name || "রহিম উদ্দিন",
              phone: found.phone || "০১৭XXXXXXXX",
              verified: true,
              rating: 4.8,
              totalAds: 12,
            },
            originalPrice: found.price ? found.price + 10000 : 85000,
            time: "২ ঘন্টা আগে",
            urgent: found.isFeatured || false,
            featured: found.isFeatured || false,
            images: found.images || [{ thumbnail: "📱", full: "📱", width: 400, height: 400 }],
          });
        }
      }
      setLoading(false);
    };
    
    loadPost();
    setMounted(true);
  }, [postId]);

  // টাইম এগো হেল্পার
  const timeAgo = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} দিন আগে`;
    if (hours > 0) return `${hours} ঘন্টা আগে`;
    if (minutes > 0) return `${minutes} মিনিট আগে`;
    return 'এইমাত্র';
  };

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

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setPost((prev: any) => ({ ...prev, likes: isLiked ? (prev.likes || 0) - 1 : (prev.likes || 0) + 1 }));
  }, [isLiked]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("লিংক কপি হয়েছে!");
    } catch {
      alert("লিংক কপি করতে সমস্যা হয়েছে");
    }
  }, []);

  const handleInternalChat = useCallback(() => {
    router.push(`/chat/${post.id}`);
  }, [router, post.id]);

  const handleWhatsAppChat = useCallback(() => {
    const phone = post.seller?.phone || "017XXXXXXXX";
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
    alert("রিপোর্ট করা হয়েছে");
    setShowReportModal(false);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent" />
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
              {images[activeImage]?.thumbnail?.startsWith('http') || images[activeImage]?.thumbnail?.startsWith('data:') ? (
                <img 
                  src={images[activeImage].thumbnail} 
                  alt={post.title} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-8xl">{images[activeImage]?.thumbnail || "📱"}</div>
              )}
              
              {post.urgent && <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Urgent</div>}
              {post.featured && <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ ফিচার্ড</div>}
              
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
                  <button key={idx} onClick={() => setActiveImage(idx)}
                    className={`h-1.5 rounded-full transition-all ${activeImage === idx ? "w-6 bg-[#f85606]" : "w-1.5 bg-gray-400"}`} />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto border-t">
              {images.slice(0, 4).map((img: any, idx: number) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center border-2 transition flex-shrink-0 ${activeImage === idx ? "border-[#f85606]" : "border-gray-200"}`}>
                  {img.thumbnail?.startsWith('http') || img.thumbnail?.startsWith('data:') ? (
                    <img src={img.thumbnail} alt={`থাম্বনেইল ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">{img.thumbnail}</span>
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
            <div className="mt-2 text-center bg-white rounded-xl p-2 shadow">
              <a href={`tel:${post.seller?.phone || '০১৭XXXXXXXX'}`} className="text-sm text-[#f85606] font-medium">{post.seller?.phone || '০১৭XXXXXXXX'}</a>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          
          {/* টাইটেল ও দাম */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black text-[#f85606]">৳{post.price?.toLocaleString() || '০'}</span>
              {post.originalPrice && <span className="text-sm text-gray-400 line-through">৳{post.originalPrice.toLocaleString()}</span>}
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
              <span>🔍 {post.views || 0} বার দেখা</span>
              <span>❤️ {post.likes || 0} লাইক</span>
              <span>📅 {post.time || 'এইমাত্র'}</span>
            </div>
          </div>

          <SellerInfo seller={post.seller || {}} />

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
                <Lock size={14} /> ডকুমেন্ট নিন ({Math.round((post.price || 0) * 0.02)} টাকা)
              </button>
            </div>
          </div>

          {/* বিবরণ */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Eye size={18} className="text-[#f85606]" /> পণ্যের বিবরণ
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{post.description || 'কোনো বিবরণ নেই'}</p>
          </div>

          {/* লোকেশন */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#f85606]" /> অবস্থান
            </h2>
            <p className="text-sm text-gray-600">{post.location || 'ঢাকা'}</p>
          </div>

          {/* কমেন্ট */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-[#f85606]" /> মন্তব্য ({comments.length})
            </h2>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg flex-shrink-0">👤</div>
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="আপনার মন্তব্য লিখুন..." className="flex-1 p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" />
                <button onClick={handleAddComment} disabled={!newComment.trim()} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition">
                  পোস্ট
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

            <div className="space-y-4">
              {comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
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

      {showFullscreen && fullscreenImage && <ZoomableImage src={fullscreenImage} alt={post.title} onClose={() => setShowFullscreen(false)} />}
      <PaymentModal isOpen={showDocumentModal} onClose={() => setShowDocumentModal(false)} onSuccess={handleDocumentSuccess}
        title="ডকুমেন্ট সার্ভিস" amount={(post.price || 0) * 0.02} description="পণ্যের কাগজপত্র নিরাপদে সংরক্ষণ" />
      
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">রিপোর্ট করুন</h3>
              <button onClick={() => setShowReportModal(false)}><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">আপনি কি এই পোস্টটি রিপোর্ট করতে চান?</p>
            <div className="flex gap-3">
              <button onClick={handleReport} className="flex-1 bg-[#f85606] text-white py-2 rounded-xl">হ্যাঁ</button>
              <button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">না</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}