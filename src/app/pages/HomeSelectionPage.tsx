import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { HomeIcon } from '../components/DeviceIcon';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const homeTypes = ['home', 'apartment', 'office', 'villa', 'cabin'];

export function HomeSelectionPage() {
  const navigate = useNavigate();
  const { homes, setSelectedHomeId, addHome } = useApp();
  const { t } = useTranslation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('home');

  const handleSelectHome = (homeId: string) => {
    setSelectedHomeId(homeId);
    navigate('/web');
  };

  const handleAddHome = () => {
    if (!newName.trim()) return;
    const newHome = {
      id: `home-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      rooms: [],
    };
    addHome(newHome);
    setSelectedHomeId(newHome.id);
    setNewName('');
    setNewType('home');
    setShowAddModal(false);
    navigate('/web');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewName('');
    setNewType('home');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <h1
        className="text-white"
        style={{
          fontSize: '28px',
          fontWeight: 600,
          marginBottom: '12px',
          textAlign: 'center',
        }}
      >
        {t('selectHome.title')}
      </h1>
      <p
        style={{
          color: 'var(--muted-foreground)',
          fontSize: '14px',
          marginBottom: '48px',
          textAlign: 'center',
        }}
      >
        {t('selectHome.chooseHome')}
      </p>

      <div className="home-selection-grid">
        {homes.map((home) => {
          const totalDevices = home.rooms.reduce((sum, r) => sum + r.devices.length, 0);
          const activeDevices = home.rooms.reduce(
            (sum, r) => sum + r.devices.filter((d) => d.isOn).length,
            0
          );

          return (
            <button
              key={home.id}
              onClick={() => handleSelectHome(home.id)}
              className="home-selection-card"
              style={{
                backgroundColor: 'var(--card)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(124,92,255,0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                minWidth: '240px',
                maxWidth: '320px',
                width: '100%',
                transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                cursor: 'pointer',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                e.currentTarget.style.borderColor = 'rgba(124,92,255,0.15)';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,92,255,0.3)';
                e.currentTarget.style.borderColor = 'rgba(124,92,255,0.4)';
              }}
            >
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: '96px',
                  height: '96px',
                  background: 'linear-gradient(135deg, rgba(124,92,255,0.3), rgba(124,92,255,0.1))',
                }}
              >
                <HomeIcon type={home.type} size={48} color="#7C5CFF" />
              </div>

              <div className="text-center">
                <p
                  className="text-white"
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  {home.name}
                </p>
                <p
                  style={{
                    color: '#B8B8C2',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  {home.rooms.length} {t('common.rooms')} · {totalDevices} {t('common.devices')}
                </p>
                {activeDevices > 0 && (
                  <div
                    className="flex items-center justify-center gap-1.5"
                    style={{ marginTop: '8px' }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#34C759',
                        boxShadow: '0 0 8px rgba(52,199,89,0.6)',
                      }}
                    />
                    <span
                      style={{
                        color: '#34C759',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {activeDevices} {t('common.active')}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Add New Home Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="home-selection-card"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '16px',
            padding: '32px',
            border: '2px dashed rgba(124,92,255,0.35)',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            minWidth: '240px',
            maxWidth: '320px',
            width: '100%',
            transition: 'transform 200ms ease, border-color 200ms ease, background-color 200ms ease',
            cursor: 'pointer',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.96)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(124,92,255,0.35)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(124,92,255,0.7)';
            e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.05)';
          }}
        >
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: '96px',
              height: '96px',
              background: 'linear-gradient(135deg, rgba(124,92,255,0.2), rgba(124,92,255,0.06))',
              border: '1px solid rgba(124,92,255,0.25)',
            }}
          >
            <Plus size={40} color="#7C5CFF" strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <p
              style={{
                color: '#7C5CFF',
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              {t('selectHome.addHome')}
            </p>
            <p
              style={{
                color: 'var(--secondary-text)',
                fontSize: '14px',
              }}
            >
              {t('selectHome.setupNewLocation')}
            </p>
          </div>
        </button>
      </div>

      {/* Add Home Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-md rounded-t-2xl p-5"
            style={{ backgroundColor: '#1E1E22' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>
                {t('selectHome.addNewHome')}
              </p>
              <button onClick={handleCloseModal}>
                <X size={20} color="#B8B8C2" />
              </button>
            </div>

            <div className="mb-4">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('homes.homeName')}</p>
              <input
                type="text"
                placeholder="e.g. Beach House"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddHome()}
                autoFocus
                className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: '#2A2A31',
                  border: '1px solid #3A3A44',
                  fontSize: '14px',
                }}
              />
            </div>

            <div className="mb-6">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('selectHome.homeType')}</p>
              <div className="flex gap-2 flex-wrap">
                {homeTypes.map((ht) => (
                  <button
                    key={ht}
                    onClick={() => setNewType(ht)}
                    className="px-3 py-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: newType === ht ? '#7C5CFF' : 'var(--card)',
                      color: newType === ht ? '#fff' : 'var(--muted-foreground)',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: `1px solid ${newType === ht ? '#7C5CFF' : 'var(--muted)'}`,
                    }}
                  >
                    {t(`homeType.${ht}` as any)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddHome}
              className="w-full py-3.5 rounded-xl"
              style={{
                background: newName.trim()
                  ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)'
                  : 'var(--muted)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                transition: 'background 200ms ease',
              }}
            >
              {t('selectHome.createHome')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .home-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 320px));
          gap: 24px;
          width: 100%;
          max-width: 800px;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .home-selection-grid {
            grid-template-columns: 1fr;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
}