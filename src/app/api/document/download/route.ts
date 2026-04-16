import { NextRequest, NextResponse } from 'next/server';

// ডামি ডকুমেন্ট ডাটা (প্রোডাকশনে ডাটাবেস থেকে আনবেন)
const documents = [
  { id: '1', postTitle: 'iPhone 15 Pro Max', fileUrl: '/documents/iphone-bill.pdf', fileName: 'iphone-15-pro-max-bill.pdf' },
  { id: '2', postTitle: 'MacBook Pro M2', fileUrl: '/documents/macbook-bill.pdf', fileName: 'macbook-pro-m2-bill.pdf' },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const docId = searchParams.get('id');

  if (!docId) {
    return NextResponse.json({ success: false, message: 'ডকুমেন্ট আইডি প্রয়োজন' }, { status: 400 });
  }

  const document = documents.find(doc => doc.id === docId);

  if (!document) {
    return NextResponse.json({ success: false, message: 'ডকুমেন্ট পাওয়া যায়নি' }, { status: 404 });
  }

  // ডাউনলোড URL রিটার্ন (প্রোডাকশনে ফাইল স্ট্রিম করতে পারেন)
  return NextResponse.json({
    success: true,
    downloadUrl: document.fileUrl,
    fileName: document.fileName,
    message: 'ডকুমেন্ট ডাউনলোডের জন্য প্রস্তুত',
  });
}