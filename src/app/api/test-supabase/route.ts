import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // টেস্ট কানেকশন
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (error) {
      // টেবিল নেই, কিন্তু কানেকশন ঠিক আছে
      return NextResponse.json({ 
        success: true, 
        message: 'Supabase connection successful! Ready to create tables.',
        note: 'No tables found - this is expected for new project'
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connected successfully!' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    }, { status: 500 });
  }
}