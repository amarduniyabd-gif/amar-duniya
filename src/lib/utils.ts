// ইউটিলিটি ফাংশনস

// টাকা ফরম্যাট করার ফাংশন
export function formatPrice(price: number): string {
  return `৳${price.toLocaleString('bn-BD')}`;
}

// তারিখ ফরম্যাট করার ফাংশন
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'এখনই';
  if (diffMins < 60) return `${diffMins} মিনিট আগে`;
  if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
  if (diffDays < 7) return `${diffDays} দিন আগে`;
  return date.toLocaleDateString('bn-BD');
}

// ট্রাঙ্কেট টেক্সট
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// র‍্যান্ডম আইডি জেনারেটর
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// লোকাল স্টোরেজ থেকে ডাটা নেওয়া
export function getLocalData(key: string, defaultValue: any = null) {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

// লোকাল স্টোরেজে ডাটা সেভ করা
export function setLocalData(key: string, data: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}