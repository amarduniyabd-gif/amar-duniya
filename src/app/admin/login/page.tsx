"use client";
import { useEffect, useState } from "react";
import { Shield, Zap } from "lucide-react";

export default function AdminLogin() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goToAdmin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", "admin@amarduniya.com");
      window.location.href = "/admin";
    }
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#1a1a2e' }}></div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* লোগো */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #f85606, #ff6b35)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 10px 30px rgba(248, 86, 6, 0.3)'
        }}>
          <Shield size={40} color="white" />
        </div>

        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          অ্যাডমিন প্যানেল
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>
          আমার দুনিয়া
        </p>

        {/* কুইক লগইন বাটন */}
        <button
          onClick={goToAdmin}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 5px 20px rgba(34, 197, 94, 0.4)'
          }}
        >
          <Zap size={22} />
          ⚡ অ্যাডমিন প্যানেলে প্রবেশ করুন
        </button>

        <p style={{ color: '#666', fontSize: '12px', marginTop: '20px' }}>
          admin@amarduniya.com / admin123
        </p>
      </div>
    </div>
  );
}