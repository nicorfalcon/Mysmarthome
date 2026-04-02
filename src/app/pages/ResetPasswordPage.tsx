import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../components/MobileFrame';
import { ArrowLeft, Mail } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 px-8 pt-4">
        {/* Back */}
        <button onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft size={24} style={{ color: '#FFFFFF' }} />
        </button>

        <h1 className="text-white mb-3" style={{ fontSize: '24px', fontWeight: 700 }}>
          Reset Password
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }} className="mb-10">
          An email will be sent to reset your password to your email address.
        </p>

        {/* Email Input */}
        <label style={{ color: 'var(--muted-foreground)', fontSize: '14px' }} className="mb-2">
          Email address
        </label>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-10"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)' }}
        >
          <Mail size={18} style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
            style={{ fontSize: '14px' }}
          />
        </div>

        {/* Send Code */}
        <button
          onClick={() => navigate('/verification')}
          className="w-full py-3.5 rounded-xl transition-all"
          style={{
            backgroundColor: '#7C5CFF',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 600,
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#9B84FF')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFF')}
        >
          Send code
        </button>
      </div>
    </MobileFrame>
  );
}