import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ক্যাশ কনফিগ
const CACHE_MAX_AGE = 3600; // ১ ঘন্টা
const STALE_WHILE_REVALIDATE = 86400; // ২৪ ঘন্টা

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const flat = searchParams.get('flat') === 'true';
    const parentOnly = searchParams.get('parentOnly') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // বেস কুয়েরি
    let query = supabase
      .from('categories')
      .select(`
        id,
        name,
        name_bn,
        icon,
        slug,
        parent_id,
        order_index,
        is_active,
        has_payment,
        image_url,
        created_at
      `)
      .order('order_index', { ascending: true })
      .order('name_bn', { ascending: true });
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'ক্যাটাগরি লোড করতে সমস্যা হয়েছে' },
        { status: 500 }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: true, categories: [], total: 0 },
        { 
          status: 200,
          headers: {
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          },
        }
      );
    }
    
    let categories;
    
    if (flat) {
      // ফ্ল্যাট লিস্ট
      categories = data;
    } else if (parentOnly) {
      // শুধু প্যারেন্ট ক্যাটাগরি
      categories = data.filter(c => !c.parent_id);
    } else {
      // প্যারেন্ট-চাইল্ড ট্রি স্ট্রাকচার
      const parents = data.filter(c => !c.parent_id);
      const children = data.filter(c => c.parent_id);
      
      categories = parents.map(parent => ({
        ...parent,
        children: children
          .filter(child => child.parent_id === parent.id)
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0)),
        children_count: children.filter(child => child.parent_id === parent.id).length,
      }));
    }
    
    return NextResponse.json({
      success: true,
      categories,
      total: categories.length,
      flat: flat,
      parentOnly: parentOnly,
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    });
    
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// POST - নতুন ক্যাটাগরি (শুধু অ্যাডমিন)
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
      name,
      name_bn,
      icon = '📦',
      slug,
      parent_id = null,
      order_index = 0,
      has_payment = false,
    } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'নাম আবশ্যক' },
        { status: 400 }
      );
    }
    
    // স্লাগ জেনারেট
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
    
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        name_bn: name_bn || name,
        icon,
        slug: finalSlug,
        parent_id,
        order_index,
        has_payment,
        is_active: true,
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'এই স্লাগ ইতিমধ্যে আছে' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      category,
      message: 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// PUT - ক্যাটাগরি আপডেট (শুধু অ্যাডমিন)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // অ্যাডমিন চেক
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_admin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'আইডি আবশ্যক' },
        { status: 400 }
      );
    }
    
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      category,
      message: 'ক্যাটাগরি আপডেট হয়েছে',
    });
    
  } catch (error) {
    console.error('Categories PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// DELETE - ক্যাটাগরি ডিলিট (শুধু অ্যাডমিন)
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
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_admin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    
    // সাব-ক্যাটাগরি চেক
    const { count: childCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', id);
    
    if (childCount && childCount > 0) {
      return NextResponse.json(
        { success: false, error: 'প্রথমে সাব-ক্যাটাগরি ডিলিট করুন' },
        { status: 400 }
      );
    }
    
    // পোস্ট চেক
    const { count: postCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);
    
    if (postCount && postCount > 0) {
      // সফট ডিলিট
      const { error } = await supabase
        .from('categories')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'ক্যাটাগরি নিষ্ক্রিয় করা হয়েছে (পোস্ট থাকায়)',
        soft_deleted: true,
      });
    }
    
    // হার্ড ডিলিট
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'ক্যাটাগরি ডিলিট হয়েছে',
    });
    
  } catch (error) {
    console.error('Categories DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}