import { NextRequest, NextResponse } from 'next/server';

type FeaturedPost = {
  postId: number;
  userId: string;
  endDate: string;
  status: 'active' | 'expired';
};

let featuredPosts: FeaturedPost[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId প্রয়োজন' }, { status: 400 });
  }

  const userFeatured = featuredPosts.filter(fp => fp.userId === userId && fp.status === 'active');
  return NextResponse.json({ success: true, data: userFeatured });
}

export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    const newFeatured: FeaturedPost = {
      postId,
      userId,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };

    featuredPosts.push(newFeatured);

    return NextResponse.json({
      success: true,
      message: 'পোস্ট ফিচার্ড হয়েছে!',
      data: newFeatured,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ফিচার্ড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}