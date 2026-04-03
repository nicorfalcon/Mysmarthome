import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { MobileFrame } from '../components/MobileFrame';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { setIsLoggedIn, homes, setSelectedHomeId } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    
    // Single home flow: go directly to Rooms
    if (homes.length === 1) {
      setSelectedHomeId(homes[0].id);
      navigate('/rooms');
    } 
    // Multi-home flow: show home selection screen
    else if (homes.length > 1) {
      navigate('/select-home');
    }
    // No homes: fallback to homes management page
    else {
      navigate('/homes');
    }
  };

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 px-8 justify-center items-center">
        {/* Logo */}
        <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--primary)' }}>
          My Smart Home
        </h1>

        <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }} className="mb-10">
          Manage your home, anywhere
        </p>

        {/* Username Input */}
        <div className="w-full mb-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)' }}
          >
            <User size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="w-full mb-3">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)' }}
          >
            <Lock size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} style={{ color: 'var(--muted-foreground)' }} />
              ) : (
                <Eye size={18} style={{ color: 'var(--muted-foreground)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="w-full flex justify-end mb-8">
          <button
            onClick={() => navigate('/reset-password')}
            style={{ color: '#7C5CFF', fontSize: '13px' }}
          >
            Forgot your password?
          </button>
        </div>

        {/* Sign in */}
        <button
          onClick={handleLogin}
          className="w-full py-3.5 rounded-xl mb-4 transition-all"
          style={{
            background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
            boxShadow: '0 4px 16px rgba(124,92,255,0.35)',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 600,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Sign in
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full mb-4">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--muted)' }} />
          <span style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--muted)' }} />
        </div>

        {/* Create account */}
        <button
          onClick={() => navigate('/create-account')}
          className="w-full py-3.5 rounded-xl transition-all"
          style={{
            backgroundColor: 'transparent',
            color: '#7C5CFF',
            fontSize: '16px',
            fontWeight: 600,
            border: '1px solid #7C5CFF',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.1)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Create account
        </button>
      </div>
    </MobileFrame>
  );
}