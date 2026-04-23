import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/offers - অফার লিস্ট
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const priority = searchParams.get('priority');
    const status = searchParams.get('status') || 'active';
    
    let query = supabase
      .from('offer_banners')
      .select('*')
      .eq('status', status)
      .gte('valid_until', new Date().toISOString())
      .order('priority_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ offers: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/offers - নতুন অফার তৈরি (অ্যাডমিন)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // অ্যাডমিন চেক
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }
    
    const body = await request.json();
    
    const { data: offer, error } = await supabase
      .from('offer_banners')
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}