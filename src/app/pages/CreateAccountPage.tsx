import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../components/MobileFrame';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Phone, Home } from 'lucide-react';

export function CreateAccountPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [homeName, setHomeName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'At least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid #3A3A44',
  };

  const errorBorder = {
    backgroundColor: 'var(--card)',
    border: '1px solid #FF3B30',
  };

  const getStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Weak', color: '#FF3B30' };
    if (password.length < 10) return { label: 'Medium', color: '#FF9500' };
    return { label: 'Strong', color: '#34C759' };
  };

  const strength = getStrength();

  if (success) {
    return (
      <MobileFrame>
        <div className="flex flex-col flex-1 items-center justify-center px-8">
          <div
            className="flex items-center justify-center rounded-full mb-6"
            style={{
              width: '80px', height: '80px',
              background: 'linear-gradient(135deg, #34C759, #30B350)',
            }}
          >
            <span style={{ fontSize: '36px', color: '#fff' }}>✓</span>
          </div>
          <p className="text-white" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Account Created!
          </p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>Redirecting to sign in...</p>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 overflow-y-auto px-6 pt-2 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6" style={{ height: '48px' }}>
          <button onClick={() => navigate('/')} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
            Create Account
          </h1>
        </div>

        <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
          Join My Smart Home and start managing your devices
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Full Name *</p>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={errors.fullName ? errorBorder : inputStyle}
          >
            <User size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text" placeholder="John Doe" value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
          </div>
          {errors.fullName && <p style={{ color: '#FF3B30', fontSize: '11px', marginTop: '4px' }}>{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Email *</p>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={errors.email ? errorBorder : inputStyle}
          >
            <Mail size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="email" placeholder="john@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
          </div>
          {errors.email && <p style={{ color: '#FF3B30', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
        </div>

        {/* Phone (optional) */}
        <div className="mb-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Phone Number</p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={inputStyle}>
            <Phone size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="tel" placeholder="+1 (555) 000-0000" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Home Name (optional) */}
        <div className="mb-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Home Name</p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={inputStyle}>
            <Home size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text" placeholder="My Home" value={homeName}
              onChange={(e) => setHomeName(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Password *</p>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={errors.password ? errorBorder : inputStyle}
          >
            <Lock size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} style={{ color: 'var(--muted-foreground)' }} /> : <Eye size={18} style={{ color: 'var(--muted-foreground)' }} />}
            </button>
          </div>
          {errors.password && <p style={{ color: '#FF3B30', fontSize: '11px', marginTop: '4px' }}>{errors.password}</p>}
          {password && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
                <div className="h-full rounded-full" style={{ width: password.length < 6 ? '33%' : password.length < 10 ? '66%' : '100%', backgroundColor: strength.color, transition: 'all 200ms' }} />
              </div>
              <span style={{ color: strength.color, fontSize: '11px', fontWeight: 500 }}>{strength.label}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Confirm Password *</p>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={errors.confirmPassword ? errorBorder : inputStyle}
          >
            <Lock size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '14px' }}
            />
            <button onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={18} style={{ color: 'var(--muted-foreground)' }} /> : <Eye size={18} style={{ color: 'var(--muted-foreground)' }} />}
            </button>
          </div>
          {errors.confirmPassword && <p style={{ color: '#FF3B30', fontSize: '11px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
        </div>

        {/* Create Account Button */}
        <button
          onClick={handleCreate}
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
          Create Account
        </button>

        <div className="flex justify-center">
          <button onClick={() => navigate('/')} style={{ color: '#7C5CFF', fontSize: '14px', fontWeight: 500 }}>
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}