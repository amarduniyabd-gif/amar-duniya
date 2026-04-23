import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const results: any = {
      timestamp: new Date().toISOString(),
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing',
      anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
    };
    
    // টেস্ট কানেকশন - profiles টেবিল
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    results.profiles = {
      connected: !profilesError,
      count: !profilesError ? 'Table exists' : 'Table not found',
      error: profilesError?.message || null,
    };
    
    // টেস্ট কানেকশন - posts টেবিল
    const { error: postsError } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true });
    
    results.posts = {
      connected: !postsError,
      status: !postsError ? 'Table exists' : 'Table not found',
    };
    
    // টেস্ট কানেকশন - categories টেবিল
    const { error: categoriesError } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true });
    
    results.categories = {
      connected: !categoriesError,
      status: !categoriesError ? 'Table exists' : 'Table not found',
    };
    
    // Storage টেস্ট
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets();
    
    results.storage = {
      connected: !storageError,
      buckets: buckets?.map(b => b.name) || [],
      error: storageError?.message || null,
    };
    
    // সব ঠিক আছে কিনা
    const allConnected = !profilesError && !postsError && !categoriesError && !storageError;
    
    return NextResponse.json({ 
      success: allConnected,
      message: allConnected ? '✅ Supabase fully connected!' : '⚠️ Some connections failed',
      results,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}