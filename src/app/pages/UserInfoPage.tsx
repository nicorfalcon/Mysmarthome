import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera, Check } from 'lucide-react';

export function UserInfoPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [defaultHome, setDefaultHome] = useState('Home');
  const [editing, setEditing] = useState(false);

  const infoRows = [
    { label: 'Full Name', value: name, onChange: setName },
    { label: 'Email', value: email, onChange: setEmail },
    { label: 'Phone', value: phone, onChange: setPhone },
    { label: 'Default Home', value: defaultHome, onChange: setDefaultHome },
  ];

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" style={{ height: '48px' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
            User Information
          </h1>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center justify-center rounded-full"
          style={{
            width: '36px', height: '36px',
            backgroundColor: editing ? '#7C5CFF' : 'var(--card)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
        >
          {editing ? <Check size={16} color="#fff" /> : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8B8C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '96px', height: '96px',
              background: 'linear-gradient(135deg, #7C5CFF, #9B84FF)',
              boxShadow: '0 8px 24px rgba(124,92,255,0.35)',
            }}
          >
            <span className="text-white" style={{ fontSize: '36px', fontWeight: 700 }}>JD</span>
          </div>
          {editing && (
            <button
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
              style={{
                width: '32px', height: '32px',
                backgroundColor: '#7C5CFF',
                border: '3px solid var(--background)',
              }}
            >
              <Camera size={14} color="#fff" />
            </button>
          )}
        </div>
        {!editing && (
          <>
            <p className="text-white" style={{ fontSize: '20px', fontWeight: 600 }}>{name}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginTop: '4px' }}>{email}</p>
          </>
        )}
      </div>

      {/* Info Card */}
      <div
        className="overflow-hidden"
        style={{
          borderRadius: '12px',
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: i < infoRows.length - 1 ? '1px solid var(--muted)' : 'none' }}
          >
            <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', minWidth: '100px' }}>{row.label}</p>
            {editing ? (
              <input
                type="text"
                value={row.value}
                onChange={(e) => row.onChange(e.target.value)}
                className="text-right bg-transparent text-white outline-none flex-1"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
            ) : (
              <p className="text-white text-right" style={{ fontSize: '14px', fontWeight: 500 }}>
                {row.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Additional info */}
      <div
        className="mt-4 overflow-hidden"
        style={{
          borderRadius: '12px',
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--muted)' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>Account Type</p>
          <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>Premium</p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>Member Since</p>
          <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>Jan 2024</p>
        </div>
      </div>
    </div>
  );
}