import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../components/MobileFrame';
import { ArrowLeft } from 'lucide-react';

export function VerificationPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 px-8 pt-4">
        <button onClick={() => navigate('/reset-password')} className="mb-8">
          <ArrowLeft size={24} style={{ color: '#FFFFFF' }} />
        </button>

        <h1 className="text-white mb-3" style={{ fontSize: '24px', fontWeight: 700 }}>
          Verification
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }} className="mb-10">
          Enter the 6-digit code sent to your email.
        </p>

        {/* Code inputs */}
        <div className="flex gap-3 justify-center mb-10">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="text-center text-white outline-none"
              style={{
                width: '48px',
                height: '56px',
                backgroundColor: 'var(--card)',
                border: digit ? '2px solid #7C5CFF' : '1px solid var(--muted)',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 600,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
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
          Confirm
        </button>

        <button
          className="mt-6 self-center"
          style={{ color: '#7C5CFF', fontSize: '14px' }}
        >
          Resend code
        </button>
      </div>
    </MobileFrame>
  );
}