import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/matrimony/[id] - প্রোফাইল ডিটেইলস
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // চেক ইউজার পেইড করেছে কিনা
    let isPaid = false;
    let isOwner = false;
    
    if (user) {
      const { data: payment } = await supabase
        .from('matrimony_payments')
        .select('id')
        .eq('payer_id', user.id)
        .eq('profile_id', id)
        .eq('status', 'completed')
        .maybeSingle();
      
      isPaid = !!payment;
    }
    
    // প্রোফাইল লোড
    const { data: profile, error } = await supabase
      .from('matrimony_profiles')
      .select(`
        *,
        user:profiles!user_id(id, name, avatar, is_verified),
        images:matrimony_images(thumbnail_url, full_url, is_blurred, order_index)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Matrimony fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'প্রোফাইল পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'প্রোফাইল পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    isOwner = profile.user_id === user?.id;
    
    // ভিউ কাউন্ট বাড়ান (অ্যাসিঙ্ক্রোনাস)
    supabase
      .from('matrimony_profiles')
      .update({ views: (profile.views || 0) + 1 })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('View update error:', error);
      });
    
    // পেইড না হলে সেনসিটিভ তথ্য হাইড
    let displayProfile = { ...profile };
    
    if (!isPaid && !isOwner) {
      displayProfile = {
        ...profile,
        name: '***',
        phone: null,
        email: null,
        village: profile.district, // শুধু জেলা দেখাবে
        images: profile.images?.map((img: any) => ({
          ...img,
          thumbnail_url: null,
          full_url: null,
          is_blurred: true,
        })),
      };
    }
    
    // অ্যাডমিন চেক
    let isAdmin = false;
    if (user) {
      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      isAdmin = adminCheck?.is_admin || false;
    }
    
    return NextResponse.json({
      success: true,
      profile: displayProfile,
      isPaid,
      isOwner,
      isAdmin,
      canViewFull: isPaid || isOwner || isAdmin,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
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

// PUT /api/matrimony/[id] - প্রোফাইল আপডেট
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'লগইন করা নেই' },
        { status: 401 }
      );
    }
    
    // মালিক চেক
    const { data: existing, error: fetchError } = await supabase
      .from('matrimony_profiles')
      .select('user_id, status')
      .eq('id', id)
      .single();
    
    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'প্রোফাইল পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    // অ্যাডমিন চেক
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_admin || false;
    
    if (existing.user_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'অনুমতি নেই' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // যে ফিল্ডগুলো আপডেট করা যাবে
    const allowedUpdates = [
      'name', 'age', 'religion', 'village', 'district', 'profession',
      'education', 'expected_income', 'height', 'weight', 'blood_group',
      'complexion', 'marital_status', 'has_children', 'children_count',
      'remarry_willing', 'phone', 'email', 'about', 'family_status', 'hobbies'
    ];
    
    const updates: any = {};
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'আপডেট করার মতো কোনো ফিল্ড নেই' },
        { status: 400 }
      );
    }
    
    updates.updated_at = new Date().toISOString();
    
    // অ্যাডমিন না হলে status পরিবর্তন করা যাবে না
    if (!isAdmin) {
      delete updates.status;
      delete updates.is_verified;
      delete updates.is_premium;
    }
    
    const { data: updatedProfile, error: updateError } = await supabase
      .from('matrimony_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'প্রোফাইল আপডেট হয়েছে',
    });
    
  } catch (error) {
    console.error('Matrimony PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// DELETE /api/matrimony/[id] - প্রোফাইল ডিলিট
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'লগইন করা নেই' },
        { status: 401 }
      );
    }
    
    // মালিক চেক
    const { data: existing, error: fetchError } = await supabase
      .from('matrimony_profiles')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'প্রোফাইল পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    // অ্যাডমিন চেক
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_admin || false;
    
    if (existing.user_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'অনুমতি নেই' },
        { status: 403 }
      );
    }
    
    // ছবি ডিলিট (স্টোরেজ থেকে)
    const { data: images } = await supabase
      .from('matrimony_images')
      .select('thumbnail_url, full_url')
      .eq('profile_id', id);
    
    if (images && images.length > 0) {
      const paths: string[] = [];
      images.forEach((img: any) => {
        if (img.thumbnail_url) paths.push(extractPathFromUrl(img.thumbnail_url));
        if (img.full_url) paths.push(extractPathFromUrl(img.full_url));
      });
      
      if (paths.length > 0) {
        await supabase.storage.from('matrimony-photos').remove(paths);
      }
    }
    
    // প্রোফাইল ডিলিট (ক্যাসকেডিং)
    const { error: deleteError } = await supabase
      .from('matrimony_profiles')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'প্রোফাইল সফলভাবে ডিলিট হয়েছে',
    });
    
  } catch (error) {
    console.error('Matrimony DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// ============ হেল্পার ============
function extractPathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'matrimony-photos');
    if (bucketIndex === -1) return '';
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return '';
  }
}