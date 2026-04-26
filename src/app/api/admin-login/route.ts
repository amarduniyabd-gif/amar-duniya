import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabaseUrl = "https://nryqoyqdwxqdydifatzb.supabase.co";
    const anonKey = "sb_publishable_si3zDsvJIr_WVRV52vKqKQ_UC5b4c4C";

    const res = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,email,name,is_admin&email=eq.${encodeURIComponent(email.toLowerCase().trim())}&is_admin=eq.true`,
      {
        headers: { "apikey": anonKey },
      }
    );

    const profiles = await res.json();

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: "অ্যাডমিন খুঁজে পাওয়া যায়নি!" }, { status: 401 });
    }

    if (password === "AmarDuniya@2026#") {
      return NextResponse.json({ success: true, profile: profiles[0] });
    }

    return NextResponse.json({ error: "পাসওয়ার্ড ভুল!" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "সার্ভার সমস্যা!" }, { status: 500 });
  }
}