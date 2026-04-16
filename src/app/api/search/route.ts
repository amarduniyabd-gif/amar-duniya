import { NextRequest, NextResponse } from 'next/server';

// সিম্পল রেট লিমিটার (প্রোডাকশনে Redis ব্যবহার করবেন)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    return true;
  }
  
  if (userRequests.count >= 20) { // প্রতি মিনিটে ২০টি রিকোয়েস্ট
    return false;
  }
  
  userRequests.count++;
  requestCounts.set(ip, userRequests);
  return true;
}

const products = [
  { id: 1, title: "iPhone 15 Pro Max", price: 75000, category: "মোবাইল", location: "কুষ্টিয়া", image: "📱", views: 1240 },
  { id: 2, title: "iPhone 15 Pro", price: 65000, category: "মোবাইল", location: "ঢাকা", image: "📱", views: 890 },
  { id: 3, title: "Samsung Galaxy S23", price: 95000, category: "মোবাইল", location: "চট্টগ্রাম", image: "📱", views: 2100 },
  { id: 4, title: "MacBook Pro M2", price: 180000, category: "কম্পিউটার", location: "কুষ্টিয়া", image: "💻", views: 560 },
  { id: 5, title: "Nike Air Max", price: 12000, category: "ফ্যাশন", location: "ঢাকা", image: "👟", views: 340 },
  { id: 6, title: "Samsung 4K TV", price: 85000, category: "ইলেকট্রনিক্স", location: "কুষ্টিয়া", image: "📺", views: 780 },
];

export async function GET(req: NextRequest) {
  // রেট লিমিট চেক
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: 'অনেক বেশি রিকোয়েস্ট। একটু পরে আবার চেষ্টা করুন।' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  let results = [...products];

  if (query) {
    results = results.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category) {
    results = results.filter(p => p.category === category);
  }

  if (location) {
    results = results.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
  }

  if (minPrice) {
    results = results.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseInt(maxPrice));
  }

  return NextResponse.json({
    success: true,
    data: results,
    total: results.length,
    query,
  });
}