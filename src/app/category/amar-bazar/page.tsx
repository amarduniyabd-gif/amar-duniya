"use client";
import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { 
  Search, ShoppingCart, Bell, Star, Gift, Truck, Shield, Award
} from "lucide-react";
import Lottie from "lottie-react";

// ============ Lottie অ্যানিমেশন URL ============
const ANIMATIONS = {
  location: "https://assets10.lottiefiles.com/packages/lf20_p8bfn5to.json",
  offer: "https://assets10.lottiefiles.com/packages/lf20_5ngs2ksb.json",
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
};

// ============ লোকাল প্রোডাক্ট (শাড়ি, ব্লাউজ, থ্রি-পিস) ============
const flashProducts: MallProduct[] = [
  { id: 1, title: "কাতান শাড়ি", price: 2500, originalPrice: 4000, image: "🥻", discount: 38, stock: 3, sold: 45, rating: 4.8, isFlash: true, isNew: false, category: "saree" },
  { id: 2, title: "জামদানি শাড়ি", price: 4500, originalPrice: 7000, image: "🥻", discount: 36, stock: 2, sold: 28, rating: 4.9, isFlash: true, isNew: false, category: "saree" },
  { id: 3, title: "সিল্ক ব্লাউজ পিস", price: 850, originalPrice: 1500, image: "👚", discount: 43, stock: 5, sold: 60, rating: 4.6, isFlash: true, isNew: false, category: "blouse" },
  { id: 4, title: "কটন থ্রি-পিস", price: 1800, originalPrice: 2800, image: "👗", discount: 36, stock: 4, sold: 35, rating: 4.7, isFlash: true, isNew: false, category: "threePiece" },
  { id: 5, title: "জর্জেট শাড়ি", price: 2200, originalPrice: 3500, image: "🥻", discount: 37, stock: 3, sold: 22, rating: 4.5, isFlash: true, isNew: false, category: "saree" },
  { id: 6, title: "ব্রাইডাল থ্রি-পিস", price: 5500, originalPrice: 8500, image: "👰", discount: 35, stock: 2, sold: 12, rating: 4.9, isFlash: true, isNew: true, category: "threePiece" },
];

const dailyDeals: MallProduct[] = [
  { id: 10, title: "হাফ সিল্ক শাড়ি", price: 1800, originalPrice: 3000, image: "🥻", discount: 40, stock: 10, sold: 85, rating: 4.7, isFlash: false, isNew: false, category: "saree" },
  { id: 11, title: "ডিজাইনার ব্লাউজ", price: 650, originalPrice: 1200, image: "👚", discount: 46, stock: 15, sold: 120, rating: 4.5, isFlash: false, isNew: false, category: "blouse" },
  { id: 12, title: "লিনেন থ্রি-পিস", price: 2400, originalPrice: 3800, image: "👗", discount: 37, stock: 8, sold: 45, rating: 4.6, isFlash: false, isNew: true, category: "threePiece" },
  { id: 13, title: "বুটিক শাড়ি", price: 3200, originalPrice: 5000, image: "🥻", discount: 36, stock: 6, sold: 30, rating: 4.8, isFlash: false, isNew: false, category: "saree" },
];

const justForYou: MallProduct[] = [
  { id: 20, title: "বন্যারশি শাড়ি", price: 3800, originalPrice: 6000, image: "🥻", discount: 37, stock: 5, sold: 18, rating: 4.9, isFlash: false, isNew: true, category: "saree" },
  { id: 21, title: "পার্টি ওয়্যার থ্রি-পিস", price: 3200, originalPrice: 4800, image: "👗", discount: 33, stock: 7, sold: 25, rating: 4.7, isFlash: false, isNew: true, category: "threePiece" },
  { id: 22, title: "এমব্রয়ডারি ব্লাউজ", price: 950, originalPrice: 1600, image: "👚", discount: 41, stock: 12, sold: 55, rating: 4.4, isFlash: false, isNew: false, category: "blouse" },
  { id: 23, title: "কাতান থ্রি-পিস", price: 2800, originalPrice: 4200, image: "👗", discount: 33, stock: 4, sold: 20, rating: 4.6, isFlash: false, isNew: false, category: "threePiece" },
  { id: 24, title: "মসলিন শাড়ি", price: 2200, originalPrice: 3500, image: "🥻", discount: 37, stock: 8, sold: 32, rating: 4.5, isFlash: false, isNew: true, category: "saree" },
  { id: 25, title: "ক্যাজুয়াল থ্রি-পিস", price: 1500, originalPrice: 2200, image: "👗", discount: 32, stock: 15, sold: 70, rating: 4.3, isFlash: false, isNew: false, category: "threePiece" },
  { id: 26, title: "তাঁতের শাড়ি", price: 1200, originalPrice: 1800, image: "🥻", discount: 33, stock: 20, sold: 95, rating: 4.4, isFlash: false, isNew: false, category: "saree" },
];

// ============ মেমোইজড কম্পোনেন্ট ============
const ProductCard = memo(({ product }: { product: MallProduct }) => (
  <Link href={`/post/${product.id}`}>
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center text-4xl">
        {product.image}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            NEW
          </span>
        )}
      </div>
      <div className="p-2">
        <h4 className="text-xs font-medium text-gray-800 truncate">{product.title}</h4>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-[#f85606]">৳{product.price}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">৳{product.originalPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] text-gray-600 ml-0.5">{product.rating}</span>
          </div>
          <span className="text-[10px] text-gray-400">• {product.sold}+ বিক্রি</span>
        </div>
        {product.isFlash && product.stock > 0 && (
          <div className="mt-1.5">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#f85606] rounded-full" style={{ width: `${(product.stock / 10) * 100}%` }} />
            </div>
            <p className="text-[8px] text-gray-500 mt-0.5">মাত্র {product.stock} টি বাকি</p>
          </div>
        )}
      </div>
    </div>
  </Link>
));
ProductCard.displayName = 'ProductCard';

const FlashProductCard = memo(({ product }: { product: MallProduct }) => (
  <Link href={`/post/${product.id}`}>
    <div className="flex-shrink-0 w-28 bg-white rounded-lg overflow-hidden">
      <div className="relative h-28 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center text-3xl">
        {product.image}
        <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span>
      </div>
      <div className="p-1.5">
        <p className="font-bold text-[#f85606] text-xs">৳{product.price}</p>
        <p className="text-gray-400 text-[9px] line-through">৳{product.originalPrice}</p>
        <p className="text-[9px] text-gray-500">{product.stock} left</p>
      </div>
    </div>
  </Link>
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
    <div className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1">
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
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* টপ বার */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-30">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <LazyLottie url={ANIMATIONS.location} className="w-6 h-6" />
              <span className="text-xs">ডেলিভারি <b>কুষ্টিয়া</b> ▼</span>
            </div>
            <div className="flex items-center gap-4">
              <ShoppingCart size={18} />
              <Bell size={18} />
            </div>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <span className="text-gray-400 text-xs">আমার দুনিয়া বাজারে খুঁজুন...</span>
          </div>
        </div>
      </div>

      {/* Lottie অফার ব্যানার */}
      <div className="w-full h-28 bg-gradient-to-r from-amber-50 to-orange-50">
        <LazyLottie url={ANIMATIONS.offer} className="w-full h-full" />
      </div>

      {/* কয়েন/অফার কার্ড */}
      <div className="grid grid-cols-3 gap-2 px-3 py-3">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2.5 text-white">
          <p className="text-[10px] font-bold">💰 Tk 100</p>
          <p className="text-[8px] opacity-90">Coins 99% OFF</p>
          <p className="text-[8px] mt-1">Shop Here →</p>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-xl p-2.5 text-white">
          <p className="text-[10px] font-bold">🎁 Free Gift</p>
          <p className="text-[8px] opacity-90">Shop Here</p>
          <p className="text-[8px] mt-1">Collect →</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-2.5 text-white">
          <p className="text-[10px] font-bold">🚚 Free</p>
          <p className="text-[8px] opacity-90">Delivery</p>
          <p className="text-[8px] mt-1">Shop →</p>
        </div>
      </div>

      {/* Welcome Deal */}
      <div className="mx-3 mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <LazyLottie url={ANIMATIONS.heart} className="w-5 h-5" />
              <p className="font-bold text-sm">WELCOME DEAL!</p>
            </div>
            <p className="text-xs mt-0.5">১৫% OFF + ফ্রি ডেলিভারি</p>
            <p className="text-[8px] opacity-80">নতুন ইউজার এক্সক্লুসিভ • সর্বোচ্চ ৳১০০ ছাড়</p>
          </div>
          <button className="bg-white text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold">সংগ্রহ →</button>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="bg-white mx-3 mb-3 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <LazyLottie url={ANIMATIONS.flash} className="w-6 h-6" />
            <h3 className="font-bold text-gray-800 text-sm">Flash Sale</h3>
            <FlashTimer />
          </div>
          <button className="text-[#f85606] text-[10px] font-medium">আরো দেখুন →</button>
        </div>
        <div className="flex overflow-x-auto p-3 gap-3 scrollbar-hide">
          {flashProducts.map(p => <FlashProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Daily Shera Deals */}
      <div className="bg-white mx-3 mb-3 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
            <Gift size={16} className="text-[#f85606]" /> Daily Shera Deals
          </h3>
          <button className="text-[#f85606] text-[10px] font-medium">Shop Now →</button>
        </div>
        <div className="flex overflow-x-auto p-3 gap-3 scrollbar-hide">
          {dailyDeals.map(p => <FlashProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Just For You */}
      <div className="bg-white mx-3 mb-3 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
            <LazyLottie url={ANIMATIONS.heart} className="w-5 h-5" /> 🛍️ Just For You
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {justForYou.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* গ্যারান্টি ব্যানার */}
      <div className="bg-white mx-3 mb-3 rounded-xl p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div><LazyLottie url={ANIMATIONS.shield} className="w-8 h-8 mx-auto" /><p className="text-[9px] mt-1 font-medium">১০০% অথেনটিক</p></div>
          <div><Award size={24} className="text-[#f85606] mx-auto" /><p className="text-[9px] mt-1 font-medium">৭ দিন রিটার্ন</p></div>
          <div><Truck size={24} className="text-[#f85606] mx-auto" /><p className="text-[9px] mt-1 font-medium">ফ্রি ডেলিভারি</p></div>
          <div><Shield size={24} className="text-[#f85606] mx-auto" /><p className="text-[9px] mt-1 font-medium">সিকিউর পেমেন্ট</p></div>
        </div>
      </div>

      {/* ফুটার */}
      <div className="text-center py-4">
        <p className="text-[10px] text-gray-400">📞 হোয়াটসঅ্যাপ: 017XXXXXXXX | ✉️ bazar@amarduniya.com</p>
      </div>
    </div>
  );
}