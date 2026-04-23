import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ক্যাশ কনফিগ
const CACHE_MAX_AGE = 3600; // ১ ঘন্টা
const STALE_WHILE_REVALIDATE = 86400; // ২৪ ঘন্টা

// GET /api/sliders - সব স্লাইডার
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    let query = supabase
      .from('sliders')
      .select(`
        id,
        title,
        description,
        image_url,
        link,
        button_text,
        order_index,
        is_active,
        created_at,
        updated_at
      `)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Sliders fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'স্লাইডার লোড করতে সমস্যা হয়েছে' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      sliders: data || [],
      total: data?.length || 0,
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    });
    
  } catch (error) {
    console.error('Sliders GET error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// POST /api/sliders - নতুন স্লাইডার তৈরি (শুধু অ্যাডমিন)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // অ্যাডমিন চেক
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const {
      title,
      description,
      image_url,
      link = '/',
      button_text,
      order_index = 0,
      is_active = true,
    } = body;
    
    if (!title || !image_url) {
      return NextResponse.json(
        { success: false, error: 'টাইটেল এবং ইমেজ URL আবশ্যক' },
        { status: 400 }
      );
    }
    
    const { data: slider, error } = await supabase
      .from('sliders')
      .insert({
        title,
        description,
        image_url,
        link,
        button_text,
        order_index,
        is_active,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Slider create error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      slider,
      message: 'স্লাইডার সফলভাবে তৈরি হয়েছে',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Sliders POST error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// PUT /api/sliders - স্লাইডার আপডেট (শুধু অ্যাডমিন)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // অ্যাডমিন চেক
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'আইডি আবশ্যক' },
        { status: 400 }
      );
    }
    
    const { data: slider, error } = await supabase
      .from('sliders')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Slider update error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      slider,
      message: 'স্লাইডার আপডেট হয়েছে',
    });
    
  } catch (error) {
    console.error('Sliders PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// DELETE /api/sliders - স্লাইডার ডিলিট (শুধু অ্যাডমিন)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'আইডি আবশ্যক' },
        { status: 400 }
      );
    }
    
    // অ্যাডমিন চেক
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // স্লাইডার ইমেজ ডিলিট (স্টোরেজ থেকে)
    const { data: slider } = await supabase
      .from('sliders')
      .select('image_url')
      .eq('id', id)
      .single();
    
    if (slider?.image_url) {
      const path = extractPathFromUrl(slider.image_url);
      if (path) {
        await supabase.storage.from('sliders').remove([path]);
      }
    }
    
    const { error } = await supabase
      .from('sliders')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Slider delete error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'স্লাইডার সফলভাবে ডিলিট হয়েছে',
    });
    
  } catch (error) {
    console.error('Sliders DELETE error:', error);
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
    const bucketIndex = pathParts.findIndex(part => part === 'sliders');
    if (bucketIndex === -1) return '';
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return '';
  }
}