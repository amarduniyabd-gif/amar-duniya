"use client";
import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { 
  Search, ShoppingCart, Bell, Star, Gift, Truck, Shield, Award,
  Phone, X, MapPin, Calendar, Tag, Heart, Share2
} from "lucide-react";
import Lottie from "lottie-react";

// ============ Lottie অ্যানিমেশন URL ============
const ANIMATIONS = {
  location: "https://assets10.lottiefiles.com/packages/lf20_p8bfn5to.json",
  flash: "https://assets9.lottiefiles.com/packages/lf20_qsxc8tqf.json",
  heart: "https://assets5.lottiefiles.com/packages/lf20_ydo0zgdg.json",
  shield: "https://assets8.lottiefiles.com/packages/lf20_emyg6gzo.json",
};

// ============ টাইপ ============
type MallProduct = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  stock: number;
  sold: number;
  rating: number;
  isFlash: boolean;
  isNew: boolean;
  category: string;
  description?: string;
  shopName?: string;
  location?: string;
  contactPhone?: string;
};

// ============ লোকাল প্রোডাক্ট ============
const flashProducts: MallProduct[] = [
  { id: 1, title: "কাতান শাড়ি", price: 2500, originalPrice: 4000, image: "🥻", discount: 38, stock: 3, sold: 45, rating: 4.8, isFlash: true, isNew: false, category: "saree", shopName: "কুষ্টিয়া শাড়ি ঘর", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "১০০% খাঁটি কাতান শাড়ি। বিয়ে, পার্টি, যেকোনো অনুষ্ঠানের জন্য পারফেক্ট।" },
  { id: 2, title: "জামদানি শাড়ি", price: 4500, originalPrice: 7000, image: "🥻", discount: 36, stock: 2, sold: 28, rating: 4.9, isFlash: true, isNew: false, category: "saree", shopName: "ঢাকাই জামদানি", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "হ্যান্ডমেড জামদানি শাড়ি। বাংলাদেশের ঐতিহ্যবাহী বুনন শিল্প।" },
  { id: 3, title: "সিল্ক ব্লাউজ পিস", price: 850, originalPrice: 1500, image: "👚", discount: 43, stock: 5, sold: 60, rating: 4.6, isFlash: true, isNew: false, category: "blouse", shopName: "ফ্যাশন বুটিক", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "প্রিমিয়াম কোয়ালিটির সিল্ক ব্লাউজ পিস। যেকোনো শাড়ির সাথে মানানসই।" },
  { id: 4, title: "কটন থ্রি-পিস", price: 1800, originalPrice: 2800, image: "👗", discount: 36, stock: 4, sold: 35, rating: 4.7, isFlash: true, isNew: false, category: "threePiece", shopName: "কটন প্যালেস", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "আরামদায়ক কটন থ্রি-পিস। ডেইলি ওয়্যার এবং অফিসের জন্য উপযুক্ত।" },
  { id: 5, title: "জর্জেট শাড়ি", price: 2200, originalPrice: 3500, image: "🥻", discount: 37, stock: 3, sold: 22, rating: 4.5, isFlash: true, isNew: false, category: "saree", shopName: "শাড়ি নিকেতন", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "হালকা ও আরামদায়ক জর্জেট শাড়ি। গরমের দিনের জন্য পারফেক্ট।" },
  { id: 6, title: "ব্রাইডাল থ্রি-পিস", price: 5500, originalPrice: 8500, image: "👰", discount: 35, stock: 2, sold: 12, rating: 4.9, isFlash: true, isNew: true, category: "threePiece", shopName: "ব্রাইডাল কালেকশন", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "বিয়ের অনুষ্ঠানের জন্য বিশেষ ডিজাইনার থ্রি-পিস। হেভি এমব্রয়ডারি ওয়ার্ক।" },
];

const dailyDeals: MallProduct[] = [
  { id: 10, title: "হাফ সিল্ক শাড়ি", price: 1800, originalPrice: 3000, image: "🥻", discount: 40, stock: 10, sold: 85, rating: 4.7, isFlash: false, isNew: false, category: "saree", shopName: "সিল্ক হাউজ", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "হাফ সিল্ক শাড়ি। অফিস পার্টি এবং ক্যাজুয়াল অনুষ্ঠানের জন্য উপযুক্ত।" },
  { id: 11, title: "ডিজাইনার ব্লাউজ", price: 650, originalPrice: 1200, image: "👚", discount: 46, stock: 15, sold: 120, rating: 4.5, isFlash: false, isNew: false, category: "blouse", shopName: "ব্লাউজ কর্নার", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "লেটেস্ট ডিজাইনের ব্লাউজ। সব ধরণের শাড়ির সাথে মানানসই।" },
  { id: 12, title: "লিনেন থ্রি-পিস", price: 2400, originalPrice: 3800, image: "👗", discount: 37, stock: 8, sold: 45, rating: 4.6, isFlash: false, isNew: true, category: "threePiece", shopName: "লিনেন স্টোর", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "প্রিমিয়াম লিনেন থ্রি-পিস। গরমে আরামদায়ক এবং স্টাইলিশ।" },
  { id: 13, title: "বুটিক শাড়ি", price: 3200, originalPrice: 5000, image: "🥻", discount: 36, stock: 6, sold: 30, rating: 4.8, isFlash: false, isNew: false, category: "saree", shopName: "বুটিক শাড়ি", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "এক্সক্লুসিভ বুটিক শাড়ি। ইউনিক ডিজাইন এবং প্রিমিয়াম কোয়ালিটি।" },
];

const justForYou: MallProduct[] = [
  { id: 20, title: "বন্যারশি শাড়ি", price: 3800, originalPrice: 6000, image: "🥻", discount: 37, stock: 5, sold: 18, rating: 4.9, isFlash: false, isNew: true, category: "saree", shopName: "বন্যারশি হাউজ", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "ভারতীয় বন্যারশি শাড়ি। জরি ওয়ার্ক এবং উজ্জ্বল রং।" },
  { id: 21, title: "পার্টি ওয়্যার থ্রি-পিস", price: 3200, originalPrice: 4800, image: "👗", discount: 33, stock: 7, sold: 25, rating: 4.7, isFlash: false, isNew: true, category: "threePiece", shopName: "পার্টি কালেকশন", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "পার্টির জন্য ডিজাইনার থ্রি-পিস। সবাই আপনাকে নোটিশ করবে!" },
  { id: 22, title: "এমব্রয়ডারি ব্লাউজ", price: 950, originalPrice: 1600, image: "👚", discount: 41, stock: 12, sold: 55, rating: 4.4, isFlash: false, isNew: false, category: "blouse", shopName: "এমব্রয়ডারি স্টোর", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "হ্যান্ড এমব্রয়ডারি ব্লাউজ। নিখুঁত কারুকাজ এবং সুন্দর ডিজাইন।" },
  { id: 23, title: "কাতান থ্রি-পিস", price: 2800, originalPrice: 4200, image: "👗", discount: 33, stock: 4, sold: 20, rating: 4.6, isFlash: false, isNew: false, category: "threePiece", shopName: "কাতান কালেকশন", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "কাতান কাপড়ের থ্রি-পিস। আরামদায়ক এবং ফ্যাশনেবল।" },
  { id: 24, title: "মসলিন শাড়ি", price: 2200, originalPrice: 3500, image: "🥻", discount: 37, stock: 8, sold: 32, rating: 4.5, isFlash: false, isNew: true, category: "saree", shopName: "মসলিন হাউজ", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "হালকা ও নরম মসলিন শাড়ি। গরমের জন্য একদম পারফেক্ট।" },
  { id: 25, title: "ক্যাজুয়াল থ্রি-পিস", price: 1500, originalPrice: 2200, image: "👗", discount: 32, stock: 15, sold: 70, rating: 4.3, isFlash: false, isNew: false, category: "threePiece", shopName: "ক্যাজুয়াল স্টোর", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "ডেইলি ওয়্যারের জন্য ক্যাজুয়াল থ্রি-পিস। স্টাইলিশ এবং আরামদায়ক।" },
  { id: 26, title: "তাঁতের শাড়ি", price: 1200, originalPrice: 1800, image: "🥻", discount: 33, stock: 20, sold: 95, rating: 4.4, isFlash: false, isNew: false, category: "saree", shopName: "তাঁত শাড়ি", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "দেশি তাঁতের শাড়ি। বাংলাদেশের ঐতিহ্যবাহী বুনন।" },
  { id: 27, title: "নকশি কাঁথা শাড়ি", price: 3500, originalPrice: 5500, image: "🥻", discount: 36, stock: 6, sold: 15, rating: 4.8, isFlash: false, isNew: true, category: "saree", shopName: "নকশি কাঁথা", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "হ্যান্ড এমব্রয়ডারি নকশি কাঁথা শাড়ি। বাংলার লোকজ শিল্প।" },
  { id: 28, title: "রেশমি থ্রি-পিস", price: 4200, originalPrice: 6500, image: "👗", discount: 35, stock: 4, sold: 12, rating: 4.7, isFlash: false, isNew: true, category: "threePiece", shopName: "রেশমি কালেকশন", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "রেশমি কাপড়ের থ্রি-পিস। রাজকীয় অনুভূতি এবং আরাম।" },
  { id: 29, title: "জরি ব্লাউজ", price: 1100, originalPrice: 1800, image: "👚", discount: 39, stock: 10, sold: 40, rating: 4.5, isFlash: false, isNew: false, category: "blouse", shopName: "জরি হাউজ", location: "কুষ্টিয়া", contactPhone: "017XXXXXXXX", description: "জরি ওয়ার্ক ব্লাউজ। শাড়ির সাথে পারফেক্ট ম্যাচ।" },
];

// ============ প্রোডাক্ট কার্ড ============
const ProductCard = memo(({ product, onClick }: { product: MallProduct; onClick: (p: MallProduct) => void }) => (
  <div onClick={() => onClick(product)} className="cursor-pointer">
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center text-5xl">
        {product.image}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            NEW
          </span>
        )}
        <button className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-[#f85606] hover:text-white transition-colors">
          <Heart size={14} />
        </button>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.title}</h4>
        <p className="text-xs text-gray-400 mb-1">{product.shopName}</p>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-[#f85606]">৳{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <Star size={10} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-gray-700 ml-0.5">{product.rating}</span>
            </div>
            <span className="text-[10px] text-gray-400">{product.sold}+ বিক্রি</span>
          </div>
          <button className="bg-[#f85606]/10 text-[#f85606] text-xs font-medium px-2 py-1 rounded-lg hover:bg-[#f85606] hover:text-white transition-colors">
            কিনুন
          </button>
        </div>
      </div>
    </div>
  </div>
));
ProductCard.displayName = 'ProductCard';

const FlashProductCard = memo(({ product, onClick }: { product: MallProduct; onClick: (p: MallProduct) => void }) => (
  <div onClick={() => onClick(product)} className="cursor-pointer">
    <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-36 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center text-4xl">
        {product.image}
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">-{product.discount}%</span>
      </div>
      <div className="p-3">
        <p className="font-bold text-[#f85606] text-base">৳{product.price}</p>
        <p className="text-gray-400 text-xs line-through">৳{product.originalPrice}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">{product.stock} টি বাকি</p>
          <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-gray-700 ml-0.5">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));
FlashProductCard.displayName = 'FlashProductCard';

const FlashTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else return { hours: 23, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-mono flex items-center gap-1 shadow-md">
      <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
});
FlashTimer.displayName = 'FlashTimer';

const LazyLottie = memo(({ url, className }: { url: string; className?: string }) => {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(url).then(r => r.json()).then(setData).catch(() => {}); }, [url]);
  if (!data) return <div className={`${className} bg-gray-100 animate-pulse rounded`} />;
  return <Lottie animationData={data} loop={true} className={className} />;
});
LazyLottie.displayName = 'LazyLottie';

// ============ মেইন পেজ ============
export default function AmarBazarPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MallProduct | null>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-gray-50" />;

  const handleCall = (phone?: string) => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone?: string) => {
    if (phone) window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* টপ বার - ইউনিক ডিজাইন */}
      <div className="bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white sticky top-0 z-30 shadow-xl">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LazyLottie url={ANIMATIONS.location} className="w-7 h-7" />
              <div>
                <span className="text-sm font-medium">ডেলিভারি</span>
                <p className="text-lg font-bold leading-tight">কুষ্টিয়া ▼</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#f85606] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
              </div>
              <Bell size={22} />
            </div>
          </div>
        </div>
        
        {/* সার্চ বার - ইউনিক */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-lg">
            <Search size={18} className="text-gray-400" />
            <span className="text-gray-400 text-sm">আমার দুনিয়া বাজারে খুঁজুন...</span>
            <div className="ml-auto">
              <LazyLottie url={ANIMATIONS.heart} className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ট্রেন্ডিং প্রোডাক্ট - ৩ কলাম গ্রিড */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <LazyLottie url={ANIMATIONS.heart} className="w-6 h-6" />
            🛍️ ট্রেন্ডিং প্রোডাক্ট
          </h3>
          <button className="text-[#f85606] text-xs font-medium">সব দেখুন →</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {justForYou.slice(0, 9).map(p => <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />)}
        </div>
      </div>

      {/* কয়েন/অফার কার্ড - ইউনিক */}
      <div className="grid grid-cols-3 gap-3 px-4 py-2">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-3 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💰</span>
            <span className="font-bold text-sm">Tk 100</span>
          </div>
          <p className="text-[10px] opacity-90">Coins 99% OFF</p>
          <p className="text-[10px] mt-2 font-medium">Shop Here →</p>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-3 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎁</span>
            <span className="font-bold text-sm">Free Gift</span>
          </div>
          <p className="text-[10px] opacity-90">Shop Here</p>
          <p className="text-[10px] mt-2 font-medium">Collect →</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-3 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚚</span>
            <span className="font-bold text-sm">Free</span>
          </div>
          <p className="text-[10px] opacity-90">Delivery</p>
          <p className="text-[10px] mt-2 font-medium">Shop →</p>
        </div>
      </div>

      {/* Welcome Deal - ইউনিক */}
      <div className="mx-4 my-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-4 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LazyLottie url={ANIMATIONS.heart} className="w-6 h-6" />
              <p className="font-bold text-base">WELCOME DEAL!</p>
            </div>
            <p className="text-sm font-medium">১৫% OFF + ফ্রি ডেলিভারি</p>
            <p className="text-[10px] opacity-80 mt-1">নতুন ইউজার এক্সক্লুসিভ • সর্বোচ্চ ৳১০০ ছাড়</p>
          </div>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform">
            সংগ্রহ করুন →
          </button>
        </div>
      </div>

      {/* Flash Sale - ইউনিক */}
      <div className="bg-white mx-4 mb-4 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LazyLottie url={ANIMATIONS.flash} className="w-8 h-8" />
            <h3 className="font-bold text-gray-800 text-lg">Flash Sale</h3>
            <FlashTimer />
          </div>
          <button className="text-[#f85606] text-sm font-medium hover:underline">আরো দেখুন →</button>
        </div>
        <div className="flex overflow-x-auto p-4 gap-4 scrollbar-hide">
          {flashProducts.map(p => <FlashProductCard key={p.id} product={p} onClick={setSelectedProduct} />)}
        </div>
      </div>

      {/* Daily Shera Deals - ইউনিক */}
      <div className="bg-white mx-4 mb-4 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Gift size={20} className="text-[#f85606]" /> Daily Shera Deals
          </h3>
          <button className="text-[#f85606] text-sm font-medium hover:underline">Shop Now →</button>
        </div>
        <div className="flex overflow-x-auto p-4 gap-4 scrollbar-hide">
          {dailyDeals.map(p => <FlashProductCard key={p.id} product={p} onClick={setSelectedProduct} />)}
        </div>
      </div>

      {/* গ্যারান্টি ব্যানার - ইউনিক */}
      <div className="bg-white mx-4 mb-4 rounded-2xl p-5 shadow-xl border border-gray-100">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <LazyLottie url={ANIMATIONS.shield} className="w-8 h-8" />
            </div>
            <p className="text-[11px] font-semibold text-gray-700">১০০% অথেনটিক</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Award size={28} className="text-[#f85606]" />
            </div>
            <p className="text-[11px] font-semibold text-gray-700">৭ দিন রিটার্ন</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Truck size={28} className="text-[#f85606]" />
            </div>
            <p className="text-[11px] font-semibold text-gray-700">ফ্রি ডেলিভারি</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Shield size={28} className="text-[#f85606]" />
            </div>
            <p className="text-[11px] font-semibold text-gray-700">সিকিউর পেমেন্ট</p>
          </div>
        </div>
      </div>

      {/* ফুটার - ইউনিক */}
      <div className="text-center py-6 border-t border-gray-100 bg-white/50">
        <p className="text-sm text-gray-500 mb-2">আমার দুনিয়া বাজার - কুষ্টিয়ার সেরা অনলাইন শপিং</p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">📞 017XXXXXXXX</span>
          <span className="flex items-center gap-1">✉️ bazar@amarduniya.com</span>
        </div>
      </div>

      {/* 🔥 প্রোডাক্ট ডিটেইল মডাল - মিডলে */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-5 flex justify-between items-center rounded-t-2xl">
              <h3 className="font-bold text-xl">প্রোডাক্ট বিস্তারিত</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-white/20 rounded-full transition">
                <X size={22} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-5 mb-5">
                <div className="w-28 h-28 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl flex items-center justify-center text-6xl shadow-lg">
                  {selectedProduct.image}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{selectedProduct.title}</h2>
                  <p className="text-3xl font-bold text-[#f85606] mt-1">৳{selectedProduct.price}</p>
                  {selectedProduct.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">৳{selectedProduct.originalPrice}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-3">{selectedProduct.description}</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2"><span className="font-medium w-20">দোকান:</span> {selectedProduct.shopName}</p>
                  <p className="flex items-center gap-2"><span className="font-medium w-20">লোকেশন:</span> {selectedProduct.location}</p>
                  <p className="flex items-center gap-2"><span className="font-medium w-20">স্টক:</span> <span className="text-green-600 font-semibold">{selectedProduct.stock} টি</span></p>
                  <p className="flex items-center gap-2"><span className="font-medium w-20">বিক্রি:</span> {selectedProduct.sold}+ টি</p>
                  <p className="flex items-center gap-2"><span className="font-medium w-20">রেটিং:</span> <span className="flex items-center"><Star size={14} className="text-yellow-500 fill-yellow-500" /><span className="ml-1 font-semibold">{selectedProduct.rating}</span></span></p>
                </div>
              </div>
              
              {/* অ্যাকশন বাটন - কাজ করবে */}
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
                  🛒 এখনই কিনুন
                </button>
                <button className="w-full border-2 border-[#f85606] text-[#f85606] py-3.5 rounded-xl font-semibold text-lg hover:bg-[#f85606] hover:text-white transition-all">
                  🛍️ কার্টে যোগ করুন
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleCall(selectedProduct.contactPhone)} className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2">
                    <Phone size={16} /> কল করুন
                  </button>
                  <button onClick={() => handleWhatsApp(selectedProduct.contactPhone)} className="flex-1 bg-[#25D366] text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.55 4.115 1.515 5.85L0 24l6.33-1.655A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                    হোয়াটসঅ্যাপ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}