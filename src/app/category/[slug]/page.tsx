"use client";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Grid3x3 } from 'lucide-react';
import { getCategoryBySlug, getSubCategories, categories } from '@/data/categories';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  // বর্তমান ক্যাটাগরি
  const currentCategory = getCategoryBySlug(slug);
  
  // সাব-ক্যাটাগরি গুলো
  const subCategories = currentCategory ? getSubCategories(currentCategory.id) : [];
  
  // যদি ক্যাটাগরি না পাওয়া যায়
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ক্যাটাগরি পাওয়া যায়নি</h1>
          <p className="text-gray-500 mb-4">আপনার খুঁজা ক্যাটাগরিটি বিদ্যমান নেই</p>
          <Link href="/" className="bg-[#f85606] text-white px-6 py-2 rounded-lg">
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // পাত্র-পাত্রী ক্যাটাগরির জন্য বিশেষ হ্যান্ডলিং
  if (currentCategory.id === "matrimony") {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* হেডার */}
        <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b shadow-sm flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-[#f85606]">{currentCategory.name}</h1>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              পাত্র-পাত্রী বিভাগে স্বাগতম
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              এখানে আপনি পাত্র বা পাত্রী খুঁজতে পারবেন। ছবি দেখতে ছোট একটি চার্জ প্রযোজ্য হবে।
            </p>
            <Link 
              href="/post-ad?category=matrimony" 
              className="inline-block bg-[#f85606] text-white px-6 py-3 rounded-xl font-semibold"
            >
              নতুন পোস্ট দিন
            </Link>
          </div>

          {/* পোস্ট লিস্ট শীঘ্রই আসবে */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            পোস্ট লিস্ট শীঘ্রই আসছে...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-[#f85606]">{currentCategory.name}</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        
        {/* সাব-ক্যাটাগরি গ্রিড */}
        {subCategories.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 size={18} className="text-[#f85606]" />
              <h2 className="text-sm font-medium text-gray-500">সাব-ক্যাটাগরি</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subCategories.map((subCat) => (
                <Link
                  key={subCat.id}
                  href={`/category/${subCat.slug}`}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group text-center"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {subCat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-[#f85606]">
                    {subCat.name}
                  </h3>
                  {subCat.hasPayment && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      🔒 ছবি দেখতে পেমেন্ট
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </>
        ) : (
          // কোনো সাব-ক্যাটাগরি না থাকলে প্রোডাক্ট লিস্ট দেখাবে
          <div className="text-center py-10">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{currentCategory.name}</h2>
            <p className="text-gray-400 text-sm mb-6">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই</p>
            <Link 
              href="/post-ad" 
              className="bg-[#f85606] text-white px-6 py-2 rounded-lg inline-block"
            >
              প্রথম পোস্ট দিন
            </Link>
          </div>
        )}

        {/* সকল ক্যাটাগরির জন্য "অন্যান্য" থাকবে */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link
            href="/post-ad"
            className="flex items-center justify-center gap-2 text-gray-500 text-sm hover:text-[#f85606] transition-colors"
          >
            <span>➕</span>
            <span>আপনার পণ্যের ক্যাটাগরি এখানে নেই? নতুন ক্যাটাগরিতে পোস্ট করুন</span>
          </Link>
        </div>

      </div>
    </div>
  );
}