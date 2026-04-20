export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string; // 🔥 এই লাইনটি যোগ করুন
  parentId: string | null;
  hasPayment?: boolean;
  status?: 'active' | 'inactive';
}


// ডিফল্ট ক্যাটাগরি (ফলব্যাক হিসেবে)
export const defaultCategories: Category[] = [
  // ========== মূল ক্যাটাগরি ==========
  { id: "offer", name: "অফার জোন", slug: "offer", icon: "🎁", parentId: null, status: 'active' },
  { id: "mobile", name: "মোবাইল", slug: "mobile", icon: "📱", parentId: null, status: 'active' },
  { id: "computer", name: "কম্পিউটার", slug: "computer", icon: "💻", parentId: null, status: 'active' },
  { id: "electronics", name: "ইলেকট্রনিক্স", slug: "electronics", icon: "📺", parentId: null, status: 'active' },
  { id: "fashion", name: "ফ্যাশন", slug: "fashion", icon: "👕", parentId: null, status: 'active' },
  { id: "car", name: "গাড়ি", slug: "car", icon: "🚗", parentId: null, status: 'active' },
  { id: "job", name: "চাকরি", slug: "job", icon: "💼", parentId: null, status: 'active' },
  { id: "service", name: "সার্ভিস", slug: "service", icon: "🔧", parentId: null, status: 'active' },
  { id: "property", name: "জমি / প্রপার্টি", slug: "property", icon: "🏠", parentId: null, status: 'active' },
  { id: "info", name: "ইনফরমেশন / বিজ্ঞপ্তি", slug: "info", icon: "📢", parentId: null, status: 'active' },
  { id: "matrimony", name: "পাত্র-পাত্রী চায়", slug: "matrimony", icon: "💑", parentId: null, hasPayment: true, status: 'active' },
  { id: "rent", name: "ভাড়া / রেন্ট", slug: "rent", icon: "🔑", parentId: null, status: 'active' },
  { id: "emergency", name: "জরুরি সেবা", slug: "emergency", icon: "🚑", parentId: null, status: 'active' },
  { id: "animal", name: "পশু", slug: "animal", icon: "🐄", parentId: null, status: 'active' },
  { id: "liquid", name: "তরল প্রোডাক্ট", slug: "liquid", icon: "🥛", parentId: null, status: 'active' },
  { id: "daily", name: "প্রতিদিনের বাজার", slug: "daily", icon: "🛒", parentId: null, status: 'active' },
  { id: "amar_bazar", name: "আমার দুনিয়া বাজার", slug: "amar-bazar", icon: "🛒", parentId: null, status: 'active' },
  
  // ========== কৃষি ক্যাটাগরি ==========
    { id: "agriculture", name: "কৃষি", slug: "agriculture", icon: "🌾", parentId: null, status: 'active' },
  { id: "agri_rice", name: "ধান", slug: "rice", icon: "🌾", parentId: "agriculture", status: 'active' },
  { id: "agri_jute", name: "পাট", slug: "jute", icon: "🌿", parentId: "agriculture", status: 'active' },
  { id: "agri_tobacco", name: "তামাক পাতা", slug: "tobacco", icon: "🍃", parentId: "agriculture", status: 'active' },
  { id: "agri_wheat", name: "গম", slug: "wheat", icon: "🌾", parentId: "agriculture", status: 'active' },
  { id: "agri_corn", name: "ভুট্টা", slug: "corn", icon: "🌽", parentId: "agriculture", status: 'active' },
  { id: "agri_fertilizer", name: "কীটনাশক ও সার", slug: "fertilizer", icon: "🧪", parentId: "agriculture", status: 'active' },
  { id: "agri_seeds", name: "বীজ", slug: "seeds", icon: "🌱", parentId: "agriculture", status: 'active' },
  { id: "agri_tools", name: "কৃষি সরঞ্জাম", slug: "tools", icon: "🔧", parentId: "agriculture", status: 'active' },
  { id: "agri_irrigation", name: "সেচ পাম্প", slug: "irrigation", icon: "💧", parentId: "agriculture", status: 'active' },
  { id: "agri_fruit", name: "ফল", slug: "fruit", icon: "🍎", parentId: "agriculture", status: 'active' },
  { id: "agri_vegetable_seed", name: "সবজি বীজ", slug: "veg-seed", icon: "🥬", parentId: "agriculture", status: 'active' },
  { id: "agri_other", name: "অন্যান্য", slug: "agri-other", icon: "📦", parentId: "agriculture", status: 'active' },

  // ========== পশু ক্যাটাগরির সাব-ক্যাটাগরি ==========
  { id: "animal_cow", name: "গরু", slug: "cow", icon: "🐄", parentId: "animal", status: 'active' },
  { id: "animal_goat", name: "ছাগল", slug: "goat", icon: "🐐", parentId: "animal", status: 'active' },
  { id: "animal_deshi_chicken", name: "দেশি মুরগি", slug: "deshi-chicken", icon: "🐔", parentId: "animal", status: 'active' },
  { id: "animal_broiler", name: "বয়লার মুরগি", slug: "broiler", icon: "🐓", parentId: "animal", status: 'active' },
  { id: "animal_bird", name: "পাখি", slug: "bird", icon: "🐦", parentId: "animal", status: 'active' },
  { id: "animal_other", name: "অন্যান্য", slug: "animal-other", icon: "📦", parentId: "animal", status: 'active' },

  // ========== তরল প্রোডাক্ট সাব-ক্যাটাগরি ==========
  { id: "liquid_milk", name: "গরুর দুধ", slug: "milk", icon: "🥛", parentId: "liquid", status: 'active' },
  { id: "liquid_honey", name: "মধু", slug: "honey", icon: "🍯", parentId: "liquid", status: 'active' },
  { id: "liquid_ghee", name: "দেশি ঘি", slug: "ghee", icon: "🧈", parentId: "liquid", status: 'active' },
  { id: "liquid_other", name: "অন্যান্য", slug: "liquid-other", icon: "📦", parentId: "liquid", status: 'active' },

  // ========== প্রতিদিনের বাজার সাব-ক্যাটাগরি ==========
  { id: "daily_vegetable", name: "সবজি", slug: "vegetable", icon: "🥬", parentId: "daily", status: 'active' },
  { id: "daily_fish", name: "মাছ", slug: "fish", icon: "🐟", parentId: "daily", status: 'active' },
  { id: "daily_meat", name: "মাংস", slug: "meat", icon: "🍖", parentId: "daily", status: 'active' },
  { id: "daily_egg", name: "ডিম", slug: "egg", icon: "🥚", parentId: "daily", status: 'active' },
  { id: "daily_rice", name: "চাল", slug: "daily-rice", icon: "🍚", parentId: "daily", status: 'active' },
  { id: "daily_daal", name: "ডাল", slug: "daal", icon: "🫘", parentId: "daily", status: 'active' },
  { id: "daily_oil", name: "তেল", slug: "oil", icon: "🫒", parentId: "daily", status: 'active' },
  { id: "daily_onion", name: "পেঁয়াজ", slug: "onion", icon: "🧅", parentId: "daily", status: 'active' },
  { id: "daily_garlic", name: "রসুন", slug: "garlic", icon: "🧄", parentId: "daily", status: 'active' },
  { id: "daily_ginger", name: "আদা", slug: "ginger", icon: "🫚", parentId: "daily", status: 'active' },
  { id: "daily_potato", name: "আলু", slug: "potato", icon: "🥔", parentId: "daily", status: 'active' },
  { id: "daily_other", name: "অন্যান্য", slug: "daily-other", icon: "📦", parentId: "daily", status: 'active' },

  // ========== গাড়ির সাব-ক্যাটাগরি ==========
  { id: "car_motorcycle", name: "মোটরসাইকেল", slug: "motorcycle", icon: "🏍️", parentId: "car", status: 'active' },
  { id: "car_bicycle", name: "সাইকেল", slug: "bicycle", icon: "🚲", parentId: "car", status: 'active' },
  { id: "car_truck", name: "ট্রাক", slug: "truck", icon: "🚛", parentId: "car", status: 'active' },
  { id: "car_micro", name: "মাইক্রো", slug: "micro", icon: "🚐", parentId: "car", status: 'active' },
  { id: "car_hi-ace", name: "হাইস", slug: "hi-ace", icon: "🚌", parentId: "car", status: 'active' },
  { id: "car_auto", name: "অটো গাড়ি", slug: "auto", icon: "🛺", parentId: "car", status: 'active' },
  { id: "car_van", name: "ভ্যান গাড়ি", slug: "van", icon: "🚐", parentId: "car", status: 'active' },
  { id: "car_other", name: "অন্যান্য", slug: "car-other", icon: "📦", parentId: "car", status: 'active' },

  // ========== মোবাইলের সাব-ক্যাটাগরি ==========
  { id: "mobile_iphone", name: "iPhone", slug: "iphone", icon: "📱", parentId: "mobile", status: 'active' },
  { id: "mobile_samsung", name: "Samsung", slug: "samsung", icon: "📱", parentId: "mobile", status: 'active' },
  { id: "mobile_xiaomi", name: "Xiaomi", slug: "xiaomi", icon: "📱", parentId: "mobile", status: 'active' },
  { id: "mobile_oneplus", name: "OnePlus", slug: "oneplus", icon: "📱", parentId: "mobile", status: 'active' },
  { id: "mobile_other", name: "অন্যান্য", slug: "mobile-other", icon: "📦", parentId: "mobile", status: 'active' },

  // ========== কম্পিউটারের সাব-ক্যাটাগরি ==========
  { id: "computer_laptop", name: "ল্যাপটপ", slug: "laptop", icon: "💻", parentId: "computer", status: 'active' },
  { id: "computer_desktop", name: "ডেস্কটপ", slug: "desktop", icon: "🖥️", parentId: "computer", status: 'active' },
  { id: "computer_monitor", name: "মনিটর", slug: "monitor", icon: "🖥️", parentId: "computer", status: 'active' },
  { id: "computer_keyboard", name: "কিবোর্ড", slug: "keyboard", icon: "⌨️", parentId: "computer", status: 'active' },
  { id: "computer_mouse", name: "মাউস", slug: "mouse", icon: "🖱️", parentId: "computer", status: 'active' },
  { id: "computer_other", name: "অন্যান্য", slug: "computer-other", icon: "📦", parentId: "computer", status: 'active' },

  // ========== ফ্যাশনের সাব-ক্যাটাগরি ==========
  { id: "fashion_baby", name: "বেবি আইটেম", slug: "baby", icon: "👶", parentId: "fashion", status: 'active' },
  { id: "fashion_women", name: "উইমেন আইটেম", slug: "women", icon: "👗", parentId: "fashion", status: 'active' },
  { id: "fashion_man", name: "ম্যান আইটেম", slug: "man", icon: "👔", parentId: "fashion", status: 'active' },
  { id: "fashion_cosmetic", name: "কসমেটিক আইটেম", slug: "cosmetic", icon: "💄", parentId: "fashion", status: 'active' },
  { id: "fashion_other", name: "অন্যান্য", slug: "fashion-other", icon: "📦", parentId: "fashion", status: 'active' },

  // ========== চাকরির সাব-ক্যাটাগরি ==========
  { id: "job_teach", name: "পড়াতে চায়", slug: "teach", icon: "📚", parentId: "job", status: 'active' },
  { id: "job_learn", name: "পড়তে চায়", slug: "learn", icon: "🎓", parentId: "job", status: 'active' },
  { id: "job_hire", name: "চাকরি নিয়োগ", slug: "hire", icon: "👥", parentId: "job", status: 'active' },
  { id: "job_seek", name: "চাকরি চায়", slug: "seek", icon: "🔍", parentId: "job", status: 'active' },
  { id: "job_labor", name: "দিন মজুর কাজের লোক চায়", slug: "labor", icon: "🔨", parentId: "job", status: 'active' },
  { id: "job_other", name: "অন্যান্য", slug: "job-other", icon: "📦", parentId: "job", status: 'active' },

  // ========== সার্ভিসের সাব-ক্যাটাগরি ==========
  { id: "service_plumber", name: "প্লাম্বার মিস্ত্রি", slug: "plumber", icon: "🔧", parentId: "service", status: 'active' },
  { id: "service_electrician", name: "ইলেকট্রিশিয়ান", slug: "electrician", icon: "⚡", parentId: "service", status: 'active' },
  { id: "service_mason", name: "রাজমিস্ত্রি", slug: "mason", icon: "🧱", parentId: "service", status: 'active' },
  { id: "service_tiles", name: "টাইলস মিস্ত্রি", slug: "tiles", icon: "🔨", parentId: "service", status: 'active' },
  { id: "service_tv", name: "টিভি মেকানিক", slug: "tv-mechanic", icon: "📺", parentId: "service", status: 'active' },
  { id: "service_ac", name: "এসি মেকানিক", slug: "ac-mechanic", icon: "❄️", parentId: "service", status: 'active' },
  { id: "service_other", name: "অন্যান্য", slug: "service-other", icon: "📦", parentId: "service", status: 'active' },

  // ========== জমির সাব-ক্যাটাগরি ==========
  { id: "property_sell", name: "জমি ক্রয়-বিক্রয়", slug: "sell", icon: "🏞️", parentId: "property", status: 'active' },
  { id: "property_lease", name: "জমি লিজ", slug: "lease", icon: "📄", parentId: "property", status: 'active' },
  { id: "property_other", name: "অন্যান্য", slug: "property-other", icon: "📦", parentId: "property", status: 'active' },

  // ========== ভাড়ার সাব-ক্যাটাগরি ==========
  { id: "rent_car", name: "গাড়ি ভাড়া", slug: "rent-car", icon: "🚗", parentId: "rent", status: 'active' },
  { id: "rent_micro", name: "মাইক্রো ভাড়া", slug: "rent-micro", icon: "🚐", parentId: "rent", status: 'active' },
  { id: "rent_truck", name: "ট্রাক ভাড়া", slug: "rent-truck", icon: "🚛", parentId: "rent", status: 'active' },
  { id: "rent_auto", name: "অটো ভাড়া", slug: "rent-auto", icon: "🛺", parentId: "rent", status: 'active' },
  { id: "rent_house", name: "বাড়ি ভাড়া", slug: "rent-house", icon: "🏠", parentId: "rent", status: 'active' },
  { id: "rent_room", name: "রুম ভাড়া", slug: "rent-room", icon: "🚪", parentId: "rent", status: 'active' },
  { id: "rent_shop", name: "দোকান ভাড়া", slug: "rent-shop", icon: "🏪", parentId: "rent", status: 'active' },
  { id: "rent_other", name: "অন্যান্য", slug: "rent-other", icon: "📦", parentId: "rent", status: 'active' },
];

// 🔥 লোকাল স্টোরেজ থেকে ক্যাটাগরি লোড
const loadCategoriesFromStorage = (): Category[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("siteCategories");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("ক্যাটাগরি লোড করতে সমস্যা:", e);
      }
    }
  }
  return defaultCategories;
};

// 🔥 এক্সপোর্টেড ক্যাটাগরি - লোকাল স্টোরেজ থেকে লোড
export const categories: Category[] = typeof window !== 'undefined' 
  ? loadCategoriesFromStorage() 
  : defaultCategories;

// Helper functions
export function getRootCategories(): Category[] {
  const cats = typeof window !== 'undefined' ? loadCategoriesFromStorage() : defaultCategories;
  return cats.filter(cat => cat.parentId === null && cat.status !== 'inactive');
}

export function getSubCategories(parentId: string): Category[] {
  const cats = typeof window !== 'undefined' ? loadCategoriesFromStorage() : defaultCategories;
  return cats.filter(cat => cat.parentId === parentId && cat.status !== 'inactive');
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const cats = typeof window !== 'undefined' ? loadCategoriesFromStorage() : defaultCategories;
  return cats.find(cat => cat.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  const cats = typeof window !== 'undefined' ? loadCategoriesFromStorage() : defaultCategories;
  return cats.find(cat => cat.id === id);
}

// 🔥 ক্যাটাগরি রিফ্রেশ (অ্যাডমিন থেকে আপডেটের পর কল করতে)
export function refreshCategories(): void {
  if (typeof window !== 'undefined') {
    // এই ফাংশন শুধু সিগন্যাল হিসেবে কাজ করে
    console.log("✅ ক্যাটাগরি রিফ্রেশ করা হয়েছে");
  }
}