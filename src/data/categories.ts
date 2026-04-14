export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId: string | null;
  hasPayment?: boolean; // পাত্র-পাত্রীর জন্য ছবি দেখতে পেমেন্ট লাগবে কিনা
}

export const categories: Category[] = [
  // মূল ক্যাটাগরি (parentId = null)
  { id: "offer", name: "অফার জোন", slug: "offer", icon: "🎁", parentId: null },
  { id: "mobile", name: "মোবাইল", slug: "mobile", icon: "📱", parentId: null },
  { id: "computer", name: "কম্পিউটার", slug: "computer", icon: "💻", parentId: null },
  { id: "electronics", name: "ইলেকট্রনিক্স", slug: "electronics", icon: "📺", parentId: null },
  { id: "fashion", name: "ফ্যাশন", slug: "fashion", icon: "👕", parentId: null },
  { id: "car", name: "গাড়ি", slug: "car", icon: "🚗", parentId: null },
  { id: "job", name: "চাকরি", slug: "job", icon: "💼", parentId: null },
  { id: "service", name: "সার্ভিস", slug: "service", icon: "🔧", parentId: null },
  { id: "property", name: "জমি / প্রপার্টি", slug: "property", icon: "🏠", parentId: null },
  { id: "info", name: "ইনফরমেশন / বিজ্ঞপ্তি", slug: "info", icon: "📢", parentId: null },
  { id: "matrimony", name: "পাত্র-পাত্রী চায়", slug: "matrimony", icon: "💑", parentId: null, hasPayment: true },
  { id: "rent", name: "ভাড়া / রেন্ট", slug: "rent", icon: "🔑", parentId: null },
  { id: "emergency", name: "জরুরি সেবা", slug: "emergency", icon: "🚑", parentId: null },

  // গাড়ির সাব-ক্যাটাগরি
  { id: "car_motorcycle", name: "মোটরসাইকেল", slug: "motorcycle", icon: "🏍️", parentId: "car" },
  { id: "car_bicycle", name: "সাইকেল", slug: "bicycle", icon: "🚲", parentId: "car" },
  { id: "car_truck", name: "ট্রাক", slug: "truck", icon: "🚛", parentId: "car" },
  { id: "car_micro", name: "মাইক্রো", slug: "micro", icon: "🚐", parentId: "car" },
  { id: "car_hi ace", name: "হাইস", slug: "hi-ace", icon: "🚌", parentId: "car" },
  { id: "car_auto", name: "অটো গাড়ি", slug: "auto", icon: "🛺", parentId: "car" },
  { id: "car_van", name: "ভ্যান গাড়ি", slug: "van", icon: "🚐", parentId: "car" },
  { id: "car_other", name: "অন্যান্য", slug: "car-other", icon: "📦", parentId: "car" },

  // মোবাইলের সাব-ক্যাটাগরি
  { id: "mobile_iphone", name: "iPhone", slug: "iphone", icon: "📱", parentId: "mobile" },
  { id: "mobile_samsung", name: "Samsung", slug: "samsung", icon: "📱", parentId: "mobile" },
  { id: "mobile_xiaomi", name: "Xiaomi", slug: "xiaomi", icon: "📱", parentId: "mobile" },
  { id: "mobile_oneplus", name: "OnePlus", slug: "oneplus", icon: "📱", parentId: "mobile" },
  { id: "mobile_realme", name: "Realme", slug: "realme", icon: "📱", parentId: "mobile" },
  { id: "mobile_oppo", name: "Oppo", slug: "oppo", icon: "📱", parentId: "mobile" },
  { id: "mobile_vivo", name: "Vivo", slug: "vivo", icon: "📱", parentId: "mobile" },
  { id: "mobile_other", name: "অন্যান্য", slug: "mobile-other", icon: "📦", parentId: "mobile" },

  // কম্পিউটারের সাব-ক্যাটাগরি
  { id: "computer_laptop", name: "ল্যাপটপ", slug: "laptop", icon: "💻", parentId: "computer" },
  { id: "computer_desktop", name: "ডেস্কটপ", slug: "desktop", icon: "🖥️", parentId: "computer" },
  { id: "computer_monitor", name: "মনিটর", slug: "monitor", icon: "🖥️", parentId: "computer" },
  { id: "computer_keyboard", name: "কিবোর্ড", slug: "keyboard", icon: "⌨️", parentId: "computer" },
  { id: "computer_mouse", name: "মাউস", slug: "mouse", icon: "🖱️", parentId: "computer" },
  { id: "computer_accessories", name: "এক্সেসরিজ", slug: "accessories", icon: "🎧", parentId: "computer" },
  { id: "computer_other", name: "অন্যান্য", slug: "computer-other", icon: "📦", parentId: "computer" },

  // ফ্যাশনের সাব-ক্যাটাগরি
  { id: "fashion_baby", name: "বেবি আইটেম", slug: "baby", icon: "👶", parentId: "fashion" },
  { id: "fashion_women", name: "উইমেন আইটেম", slug: "women", icon: "👗", parentId: "fashion" },
  { id: "fashion_man", name: "ম্যান আইটেম", slug: "man", icon: "👔", parentId: "fashion" },
  { id: "fashion_cosmetic", name: "কসমেটিক আইটেম", slug: "cosmetic", icon: "💄", parentId: "fashion" },
  { id: "fashion_other", name: "অন্যান্য", slug: "fashion-other", icon: "📦", parentId: "fashion" },

  // চাকরির সাব-ক্যাটাগরি
  { id: "job_teach", name: "পড়াতে চায়", slug: "teach", icon: "📚", parentId: "job" },
  { id: "job_learn", name: "পড়তে চায়", slug: "learn", icon: "🎓", parentId: "job" },
  { id: "job_hire", name: "চাকরি নিয়োগ", slug: "hire", icon: "👥", parentId: "job" },
  { id: "job_seek", name: "চাকরি চায়", slug: "seek", icon: "🔍", parentId: "job" },
  { id: "job_labor", name: "দিন মজুর কাজের লোক চায়", slug: "labor", icon: "🔨", parentId: "job" },
  { id: "job_other", name: "অন্যান্য", slug: "job-other", icon: "📦", parentId: "job" },

  // সার্ভিসের সাব-ক্যাটাগরি
  { id: "service_plumber", name: "প্লাম্বার মিস্ত্রি", slug: "plumber", icon: "🔧", parentId: "service" },
  { id: "service_electrician", name: "ইলেকট্রিশিয়ান", slug: "electrician", icon: "⚡", parentId: "service" },
  { id: "service_mason", name: "রাজমিস্ত্রি", slug: "mason", icon: "🧱", parentId: "service" },
  { id: "service_tiles", name: "টাইলস মিস্ত্রি", slug: "tiles", icon: "🔨", parentId: "service" },
  { id: "service_tv", name: "টিভি মেকানিক", slug: "tv-mechanic", icon: "📺", parentId: "service" },
  { id: "service_ac", name: "এসি মেকানিক", slug: "ac-mechanic", icon: "❄️", parentId: "service" },
  { id: "service_other", name: "অন্যান্য", slug: "service-other", icon: "📦", parentId: "service" },

  // জমির সাব-ক্যাটাগরি
  { id: "property_sell", name: "জমি ক্রয়-বিক্রয়", slug: "sell", icon: "🏞️", parentId: "property" },
  { id: "property_lease", name: "জমি লিজ", slug: "lease", icon: "📄", parentId: "property" },
  { id: "property_other", name: "অন্যান্য", slug: "property-other", icon: "📦", parentId: "property" },

  // ভাড়ার সাব-ক্যাটাগরি
  { id: "rent_car", name: "গাড়ি ভাড়া", slug: "rent-car", icon: "🚗", parentId: "rent" },
  { id: "rent_micro", name: "মাইক্রো ভাড়া", slug: "rent-micro", icon: "🚐", parentId: "rent" },
  { id: "rent_truck", name: "ট্রাক ভাড়া", slug: "rent-truck", icon: "🚛", parentId: "rent" },
  { id: "rent_auto", name: "অটো ভাড়া", slug: "rent-auto", icon: "🛺", parentId: "rent" },
  { id: "rent_house", name: "বাড়ি ভাড়া", slug: "rent-house", icon: "🏠", parentId: "rent" },
  { id: "rent_room", name: "রুম ভাড়া", slug: "rent-room", icon: "🚪", parentId: "rent" },
  { id: "rent_shop", name: "দোকান ভাড়া", slug: "rent-shop", icon: "🏪", parentId: "rent" },
  { id: "rent_other", name: "অন্যান্য", slug: "rent-other", icon: "📦", parentId: "rent" },
];

// হেল্পার ফাংশন: মূল ক্যাটাগরি বের করা
export function getRootCategories() {
  return categories.filter(cat => cat.parentId === null);
}

// হেল্পার ফাংশন: সাব-ক্যাটাগরি বের করা
export function getSubCategories(parentId: string) {
  return categories.filter(cat => cat.parentId === parentId);
}

// হেল্পার ফাংশন: স্লাগ থেকে ক্যাটাগরি বের করা
export function getCategoryBySlug(slug: string) {
  return categories.find(cat => cat.slug === slug);
}