import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ক্যাশ কনফিগ
const CACHE_MAX_AGE = 60; // ১ মিনিট
const STALE_WHILE_REVALIDATE = 300; // ৫ মিনিট

// GET /api/matrimony - পাত্র-পাত্রী লিস্ট
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    // পেজিনেশন
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    
    // ফিল্টার
    const gender = searchParams.get('gender');
    const district = searchParams.get('district');
    const religion = searchParams.get('religion');
    const maritalStatus = searchParams.get('maritalStatus');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const profession = searchParams.get('profession');
    const status = searchParams.get('status') || 'approved';
    const search = searchParams.get('search');
    const isPremium = searchParams.get('isPremium');
    const sort = searchParams.get('sort') || 'created_at_desc';
    
    // বেস কুয়েরি
let query = supabase
  .from('matrimony_profiles')
  .select(`
    id,
    name,
    age,
    gender,
    religion,
    village,
    district,
    profession,
    education,
    expected_income,
    height,
    weight,
    marital_status,
    has_children,
    children_count,
    remarry_willing,
    about,
    status,
    is_verified,
    is_premium,
    views,
    interests,
    created_at,
    user_id,
    phone,
    email,
    blood_group,
    complexion,
    family_status,
    hobbies,
    user:profiles!user_id(id, name, avatar, is_verified),
    images:matrimony_images(thumbnail_url, full_url, is_blurred, order_index)
  `, { count: 'exact' });
    
    // ফিল্টার প্রয়োগ
    if (gender) query = query.eq('gender', gender);
    if (district) query = query.eq('district', district);
    if (religion) query = query.eq('religion', religion);
    if (maritalStatus) query = query.eq('marital_status', maritalStatus);
    if (status) query = query.eq('status', status);
    if (isPremium === 'true') query = query.eq('is_premium', true);
    
    if (minAge) query = query.gte('age', parseInt(minAge));
    if (maxAge) query = query.lte('age', parseInt(maxAge));
    if (profession) query = query.ilike('profession', `%${profession}%`);
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,village.ilike.%${search}%,district.ilike.%${search}%,profession.ilike.%${search}%`);
    }
    
    // সর্টিং
    switch (sort) {
      case 'age_asc':
        query = query.order('age', { ascending: true });
        break;
      case 'age_desc':
        query = query.order('age', { ascending: false });
        break;
      case 'views_desc':
        query = query.order('views', { ascending: false });
        break;
      case 'interests_desc':
        query = query.order('interests', { ascending: false });
        break;
      case 'premium_first':
        query = query.order('is_premium', { ascending: false }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    // পেজিনেশন
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Matrimony fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'প্রোফাইল লোড করতে সমস্যা হয়েছে' },
        { status: 500 }
      );
    }
    
    // ইউজার চেক (পেইড স্ট্যাটাস)
    const { data: { user } } = await supabase.auth.getUser();
    let paidProfileIds: string[] = [];
    
    if (user) {
      const { data: payments } = await supabase
        .from('matrimony_payments')
        .select('profile_id')
        .eq('payer_id', user.id)
        .eq('status', 'completed');
      
      paidProfileIds = payments?.map(p => p.profile_id) || [];
    }
    
    // ডাটা ফরম্যাট
    const profiles = (data || []).map(profile => {
      const isPaid = paidProfileIds.includes(profile.id);
      const isOwner = profile.user_id === user?.id;
      
      // পেইড না হলে সেনসিটিভ তথ্য হাইড
      if (!isPaid && !isOwner) {
        return {
          ...profile,
          name: '***',
          phone: null,
          email: null,
          village: null,
          images: profile.images?.map((img: any) => ({
            ...img,
            thumbnail_url: null,
            full_url: null,
            is_blurred: true,
          })),
        };
      }
      
      return profile;
    });
    
    return NextResponse.json({
      success: true,
      profiles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: (page * limit) < (count || 0),
      },
      filters: {
        gender,
        district,
        religion,
        maritalStatus,
        minAge: minAge ? parseInt(minAge) : null,
        maxAge: maxAge ? parseInt(maxAge) : null,
        profession,
      },
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    });
    
  } catch (error) {
    console.error('Matrimony GET error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// POST /api/matrimony - নতুন প্রোফাইল তৈরি
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'প্রোফাইল তৈরি করতে লগইন করুন' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { images, ...profileData } = body;
    
    // ভ্যালিডেশন
    if (!profileData.name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'নাম আবশ্যক' },
        { status: 400 }
      );
    }
    
    if (!profileData.age || profileData.age < 18) {
      return NextResponse.json(
        { success: false, error: 'বয়স কমপক্ষে ১৮ বছর হতে হবে' },
        { status: 400 }
      );
    }
    
    if (!profileData.district) {
      return NextResponse.json(
        { success: false, error: 'জেলা আবশ্যক' },
        { status: 400 }
      );
    }
    
    // ইমেইল ভ্যালিডেশন (যদি থাকে)
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      return NextResponse.json(
        { success: false, error: 'সঠিক ইমেইল দিন' },
        { status: 400 }
      );
    }
    
    // ফোন ভ্যালিডেশন (যদি থাকে)
    if (profileData.phone && !/^01[0-9]{9}$/.test(profileData.phone)) {
      return NextResponse.json(
        { success: false, error: 'সঠিক মোবাইল নম্বর দিন' },
        { status: 400 }
      );
    }
    
    // প্রোফাইল তৈরি
    const { data: profile, error } = await supabase
      .from('matrimony_profiles')
      .insert({
        ...profileData,
        user_id: user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Matrimony create error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // ছবি যোগ
    if (images && images.length > 0) {
      const imageInserts = images.slice(0, 3).map((img: any, index: number) => ({
        profile_id: profile.id,
        thumbnail_url: img.thumbnail,
        full_url: img.full,
        is_blurred: true,
        order_index: index,
      }));
      
      await supabase.from('matrimony_images').insert(imageInserts);
    }
    
    // নোটিফিকেশন
    try {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'প্রোফাইল জমা হয়েছে',
        message: 'আপনার প্রোফাইল রিভিউ এর জন্য অপেক্ষমান আছে।',
        type: 'matrimony',
        data: { profile_id: profile.id },
      });
    } catch {}
    
    return NextResponse.json({
      success: true,
      profile,
      message: 'প্রোফাইল সফলভাবে জমা দেওয়া হয়েছে',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Matrimony POST error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}