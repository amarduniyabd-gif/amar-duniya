import { NextRequest, NextResponse } from 'next/server';

type DocumentRequest = {
  id: string;
  postId: number;
  postTitle: string;
  sellerId: string;
  buyerId: string;
  documentUrl: string;
  status: 'pending' | 'released';
  fee: number;
  createdAt: string;
  releasedAt?: string;
};

let documentRequests: DocumentRequest[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId প্রয়োজন' }, { status: 400 });
  }

  let userDocs = [];
  if (role === 'seller') {
    userDocs = documentRequests.filter(doc => doc.sellerId === userId);
  } else {
    userDocs = documentRequests.filter(doc => doc.buyerId === userId);
  }

  return NextResponse.json({ success: true, data: userDocs });
}

export async function POST(req: NextRequest) {
  try {
    const { postId, postTitle, sellerId, buyerId, documentUrl, fee } = await req.json();

    const newRequest: DocumentRequest = {
      id: `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      postTitle,
      sellerId,
      buyerId,
      documentUrl,
      status: 'pending',
      fee,
      createdAt: new Date().toISOString(),
    };

    documentRequests.push(newRequest);

    return NextResponse.json({
      success: true,
      message: 'ডকুমেন্ট রিকোয়েস্ট পাঠানো হয়েছে!',
      data: newRequest,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ডকুমেন্ট রিকোয়েস্ট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { requestId, status } = await req.json();

    const index = documentRequests.findIndex(doc => doc.id === requestId);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'রিকোয়েস্ট পাওয়া যায়নি' }, { status: 404 });
    }

    documentRequests[index].status = status;
    if (status === 'released') {
      documentRequests[index].releasedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      message: status === 'released' ? 'ডকুমেন্ট রিলিজ হয়েছে!' : 'ডকুমেন্ট পেন্ডিং',
      data: documentRequests[index],
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'আপডেট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}