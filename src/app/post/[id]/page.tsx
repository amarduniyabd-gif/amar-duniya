"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, User, Eye, 
  Shield, CheckCircle, Flag, X, MessageCircle, Star, ThumbsUp,
  ChevronLeft, ChevronRight, Play, Package, Calendar, Truck, BadgeCheck,
  FileText, Lock, CreditCard
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

// পোস্ট ডাটা
const getPostById = (id: string) => {
  return {
    id: parseInt(id),
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
    description: "ব্র্যান্ড নতুন iPhone 15 Pro Max। 128GB স্টোরেজ, ফুল বক্স সহ। ব্যাটারি হেলথ 100%। ওয়ারেন্টি আছে।",
    images: ["📱", "📱", "📱", "📱"],
    videoUrl: null,
    urgent: true,
    featured: true,
    views: 1240,
    likes: 56,
  };
};

// কমেন্ট ডাটা
const getComments = (): Comment[] => {
  return [
    {
      id: 1,
      userName: "করিম মিয়া",
      userAvatar: "👨",
      rating: 5,
      text: "দাম একটু কম হবে? আগ্রহী আছি।",
      time: "১ ঘন্টা আগে",
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 11,
          userName: "রহিম উদ্দিন (বিক্রেতা)",
          userAvatar: "👨‍💼",
          rating: 0,
          text: "হ্যাঁ, নগদে নিলে ২০০০ টাকা ছাড় দিতে পারি।",
          time: "৩০ মিনিট আগে",
          likes: 3,
          isLiked: false,
        }
      ],
    },
    {
      id: 2,
      userName: "শাহিনুর রহমান",
      userAvatar: "👨",
      rating: 4,
      text: "প্রোডাক্ট দেখতে কেমন?",
      time: "৩ ঘন্টা আগে",
      likes: 2,
      isLiked: false,
      replies: [],
    },
  ];
};

export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState(() => getPostById(postId));
  const [comments, setComments] = useState<Comment[]>(() => getComments());
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setPost({ ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("লিংক কপি হয়েছে!");
    } catch (err) {
      alert("লিংক কপি করতে সমস্যা হয়েছে");
    }
  };

  const handleInternalChat = () => {
    router.push(`/chat/${post.id}`);
  };

  const handleWhatsAppChat = () => {
    const phone = post.seller.whatsapp || post.seller.phone;
    const message = `হ্যালো, আমি "${post.title}" পণ্যটি সম্পর্কে জানতে চাই।`;
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDocumentSuccess = () => {
    alert("ডকুমেন্ট সার্ভিস সক্রিয়! ক্রেতা পণ্য পেলে ডকুমেন্ট পাবেন।");
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
  };

  const handleAddComment = () => {
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
    setComments([newCommentObj, ...comments]);
    setNewComment("");
    setNewRating(0);
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getWarrantyText = (months: string) => {
    switch(months) {
      case "1": return "১ মাস ওয়ারেন্টি";
      case "3": return "৩ মাস ওয়ারেন্টি";
      case "6": return "৬ মাস ওয়ারেন্টি";
      case "12": return "১ বছর ওয়ারেন্টি";
      case "24": return "২ বছর ওয়ারেন্টি";
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b shadow-sm flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex gap-3">
          <button onClick={handleLike} className="p-1">
            <Heart size={22} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500"} />
          </button>
          <button onClick={handleShare} className="p-1">
            <Share2 size={22} className="text-gray-500" />
          </button>
          <button onClick={() => setShowReportModal(true)} className="p-1">
            <Flag size={22} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        
        {/* ইমেজ/ভিডিও গ্যালারি */}
        <div className="bg-white">
          {post.videoUrl ? (
            <div className="relative h-80 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={post.videoUrl}
                className="w-full h-full object-contain"
                playsInline
                onClick={handleVideoPlay}
              />
              {!isPlaying && (
                <button
                  onClick={handleVideoPlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                    <Play size={32} className="text-black ml-1" />
                  </div>
                </button>
              )}
              {post.urgent && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Urgent</div>
              )}
              {post.featured && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ ফিচার্ড</div>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="relative h-80 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <div className="text-8xl">{post.images[activeImage]}</div>
                {post.urgent && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Urgent</div>
                )}
                {post.featured && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ ফিচার্ড</div>
                )}
              </div>
              
              {post.images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md">
                    <ChevronLeft size={24} className="text-gray-600" />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md">
                    <ChevronRight size={24} className="text-gray-600" />
                  </button>
                </>
              )}
              
              {post.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.images.map((_, idx) => (
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
          )}
          
          {!post.videoUrl && post.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto border-t">
              {post.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-2xl border-2 transition shrink-0 ${
                    activeImage === idx ? "border-[#f85606]" : "border-transparent"
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* চ্যাট, হোয়াটসঅ্যাপ, কল বাটন */}
        <div className="p-4">
          <div className="flex gap-2">
            <button
              onClick={handleInternalChat}
              className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <MessageCircle size={18} />
              চ্যাট করুন
            </button>
            
            <button
              onClick={handleWhatsAppChat}
              className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.032 2.014c-5.514 0-9.988 4.474-9.988 9.988 0 1.762.458 3.494 1.328 5.008l-1.408 5.135 5.262-1.38c1.465.799 3.114 1.225 4.806 1.225 5.514 0 9.988-4.474 9.988-9.988s-4.474-9.988-9.988-9.988z"/>
              </svg>
              হোয়াটসঅ্যাপ
            </button>
            
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={18} />
              কল
            </button>
          </div>
          {showPhone && (
            <div className="mt-2 text-center bg-white rounded-xl p-2 shadow">
              <a href={`tel:${post.seller.phone}`} className="text-sm text-[#f85606] font-medium">
                {post.seller.phone}
              </a>
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
              {getWarrantyText(post.warranty) && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  <Calendar size={12} /> {getWarrantyText(post.warranty)}
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

          {/* বিক্রেতার তথ্য */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User size={18} className="text-[#f85606]" />
              বিক্রেতার তথ্য
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{post.seller.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>⭐ {post.seller.rating}</span>
                  <span>•</span>
                  <span>{post.seller.totalAds} টি পোস্ট</span>
                </div>
              </div>
              {post.seller.verified && (
                <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> ভেরিফাইড
                </div>
              )}
            </div>
          </div>

          {/* ডকুমেন্ট সার্ভিস সেকশন */}
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
              <button 
                onClick={() => setShowDocumentModal(true)}
                className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition"
              >
                <Lock size={14} />
                ডকুমেন্ট নিন ({post.price * 0.02} টাকা)
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-3">✓ ক্রেতা পণ্য পেলে ডকুমেন্ট পাবেন • ২% চার্জ</p>
          </div>

          {/* বিবরণ */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Eye size={18} className="text-[#f85606]" />
              পণ্যের বিবরণ
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
          </div>

          {/* লোকেশন */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#f85606]" />
              অবস্থান
            </h2>
            <p className="text-sm text-gray-600">{post.location}</p>
          </div>

          {/* কমেন্ট সেকশন */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-[#f85606]" />
              মন্তব্য ({comments.length})
            </h2>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg">👤</div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="আপনার মন্তব্য লিখুন..."
                  className="flex-1 p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50"
                >
                  পোস্ট করুন
                </button>
              </div>
              <div className="flex items-center gap-2 ml-10">
                <span className="text-xs text-gray-500">রেটিং দিন:</span>
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
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg">
                      {comment.userAvatar}
                    </div>
                    <div className="flex-1">
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
                      <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                    </div>
                  </div>
                  {comment.replies && comment.replies.map((reply) => (
                    <div key={reply.id} className="ml-8 md:ml-12 mt-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg">
                          {reply.userAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-gray-800">{reply.userName}</span>
                            <span className="text-[10px] text-gray-400">{reply.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{reply.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* নিরাপত্তা টিপস */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">নিরাপদ লেনদেনের টিপস</p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>✓ পণ্য দেখে কেনাকাটা করুন</li>
                  <li>✓ আগাম টাকা পাঠাবেন না</li>
                  <li>✓ ডকুমেন্ট সার্ভিস ব্যবহার করুন</li>
                  <li>✓ সন্দেহজনক পোস্ট রিপোর্ট করুন</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ডকুমেন্ট সার্ভিস পেমেন্ট মডাল */}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">রিপোর্ট করুন</h3>
              <button onClick={() => setShowReportModal(false)}><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">আপনি কি এই পোস্টটি রিপোর্ট করতে চান?</p>
            <div className="flex gap-3">
              <button onClick={() => { alert("রিপোর্ট করা হয়েছে"); setShowReportModal(false); }} className="flex-1 bg-[#f85606] text-white py-2 rounded-xl">হ্যাঁ</button>
              <button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl">না</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}