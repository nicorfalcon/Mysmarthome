import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, ChevronRight, X, Check, Trash2 } from 'lucide-react';
import { HomeIcon } from '../components/DeviceIcon';
import { useTranslation } from '../i18n/useTranslation';

export function HomesPage() {
  const { homes, addHome, updateHome, deleteHome } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [editName, setEditName] = useState('');
  const [inlineEditNames, setInlineEditNames] = useState<Record<string, string>>({});

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHome({
      id: `home-${Date.now()}`,
      name: newName.trim(),
      type: 'home',
      rooms: [],
    });
    setNewName('');
    setShowAddModal(false);
  };

  const handleEdit = () => {
    if (!showEditModal || !editName.trim()) return;
    updateHome(showEditModal, { name: editName.trim() });
    setShowEditModal(null);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) return;
    deleteHome(showDeleteConfirm);
    setShowDeleteConfirm(null);
  };

  const handleInlineNameChange = (homeId: string, newName: string) => {
    setInlineEditNames(prev => ({ ...prev, [homeId]: newName }));
  };

  const handleInlineNameBlur = (homeId: string) => {
    const updatedName = inlineEditNames[homeId];
    if (updatedName && updatedName.trim()) {
      updateHome(homeId, { name: updatedName.trim() });
    }
  };

  const openEdit = (home: typeof homes[0]) => {
    setEditName(home.name);
    setShowEditModal(home.id);
  };

  const openDeleteConfirm = (home: typeof homes[0]) => {
    setShowDeleteConfirm(home.id);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ height: '48px' }}>
        <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '0' }}>
          {t('homes.title')}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: '36px', height: '36px',
              backgroundColor: isEditMode ? '#7C5CFF' : 'var(--card)',
              boxShadow: isEditMode ? '0 2px 8px rgba(124,92,255,0.3)' : 'var(--shadow-sm)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Pencil size={16} color={isEditMode ? '#fff' : 'var(--muted-foreground)'} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
              boxShadow: '0 2px 8px rgba(124,92,255,0.3)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* Home Cards - Responsive Grid */}
      <div className="responsive-grid">
        {homes.map((home) => {
          const totalDevices = home.rooms.reduce((sum, r) => sum + r.devices.length, 0);
          const activeDevices = home.rooms.reduce(
            (sum, r) => sum + r.devices.filter((d) => d.isOn).length,
            0
          );
          return (
            <div key={home.id}>
              <button
                onClick={() => !isEditMode && navigate(`/homes/${home.id}/rooms`)}
                className="flex items-center gap-4 text-left w-full"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--card)',
                  border: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
                  cursor: isEditMode ? 'default' : 'pointer',
                }}
                onMouseDown={(e) => !isEditMode && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    width: '56px', height: '56px',
                    background: 'linear-gradient(135deg, rgba(124,92,255,0.25), rgba(124,92,255,0.08))',
                  }}
                >
                  <HomeIcon type={home.type} size={32} color="#7C5CFF" />
                </div>
                <div className="flex-1">
                  <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
                    {home.name}
                  </p>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginTop: '2px' }}>
                    {home.rooms.length} {t('common.rooms')} &middot; {totalDevices} {t('common.devices')}
                  </p>
                  {activeDevices > 0 && (
                    <div className="flex items-center gap-1.5" style={{ marginTop: '4px' }}>
                      <div
                        className="rounded-full"
                        style={{
                          width: '6px', height: '6px',
                          backgroundColor: '#34C759',
                          boxShadow: '0 0 6px rgba(52,199,89,0.5)',
                        }}
                      />
                      <span style={{ color: '#34C759', fontSize: '11px', fontWeight: 500 }}>
                        {activeDevices} {t('common.active')}
                      </span>
                    </div>
                  )}
                </div>
                {!isEditMode && (
                  <ChevronRight size={20} style={{ color: 'var(--muted-foreground)', transition: 'opacity 200ms ease-in-out' }} />
                )}
                {isEditMode && (
                  <div className="flex flex-col gap-2" style={{ transition: 'opacity 200ms ease-in-out' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEdit(home)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        backgroundColor: 'rgba(124,92,255,0.15)',
                        border: '1px solid rgba(124,92,255,0.3)',
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.25)';
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.15)';
                      }}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.15)')}
                    >
                      <Pencil size={12} color="#7C5CFF" />
                      <span style={{ color: '#7C5CFF', fontSize: '12px', fontWeight: 500 }}>{t('common.rename')}</span>
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(home)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        backgroundColor: 'rgba(255,59,48,0.1)',
                        border: '1px solid rgba(255,59,48,0.3)',
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.15)';
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.1)';
                      }}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.1)')}
                    >
                      <Trash2 size={12} color="#FF3B30" />
                      <span style={{ color: '#FF3B30', fontSize: '12px', fontWeight: 500 }}>{t('common.delete')}</span>
                    </button>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Home Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center modal-backdrop"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-content"
            style={{ backgroundColor: 'var(--background)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>{t('homes.addHome')}</p>
              <button onClick={() => setShowAddModal(false)}><X size={20} color="var(--muted-foreground)" /></button>
            </div>
            <div className="mb-4">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('homes.homeName')}</p>
              <input
                type="text" placeholder="e.g. Beach House" value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)', fontSize: '14px' }}
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-3.5 rounded-xl transition-all"
              style={{
                background: newName.trim() ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)' : 'var(--muted)',
                color: '#fff', fontSize: '16px', fontWeight: 600,
              }}
            >
              {t('homes.addHome')}
            </button>
          </div>
        </div>
      )}

      {/* Edit Home Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center modal-backdrop"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowEditModal(null)}
        >
          <div
            className="modal-content"
            style={{ backgroundColor: 'var(--background)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>{t('homes.editHome')}</p>
              <button onClick={() => setShowEditModal(null)}><X size={20} color="var(--muted-foreground)" /></button>
            </div>
            <div className="mb-6">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('homes.homeName')}</p>
              <input
                type="text" value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)', fontSize: '14px' }}
              />
            </div>
            <button
              onClick={handleEdit}
              className="w-full py-3.5 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                color: '#fff', fontSize: '16px', fontWeight: 600,
              }}
            >
              {t('common.saveChanges')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center modal-backdrop"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => closeDeleteConfirm()}
        >
          <div
            className="modal-content"
            style={{ backgroundColor: 'var(--background)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>{t('homes.deleteHome')}</p>
              <button onClick={() => closeDeleteConfirm()}><X size={20} color="var(--muted-foreground)" /></button>
            </div>
            <div className="mb-6">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('homes.homeName')}</p>
              <input
                type="text" value={homes.find((h) => h.id === showDeleteConfirm)?.name}
                className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)', fontSize: '14px' }}
                readOnly
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => closeDeleteConfirm()}
                className="w-full py-3.5 rounded-xl transition-all"
                style={{
                  background: '#3A3A44',
                  color: '#fff', fontSize: '16px', fontWeight: 600,
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-3.5 rounded-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FF5C5C, #FF4444)',
                  color: '#fff', fontSize: '16px', fontWeight: 600,
                }}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .page-container {
          padding: 16px;
          width: 100%;
          max-width: 100%;
        }
        
        .responsive-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
        }
        
        .modal-backdrop {
          align-items: end;
        }
        
        .modal-content {
          width: 100%;
          max-width: 450px;
          border-radius: 16px 16px 0 0;
          padding: 20px;
        }
        
        /* Mobile Landscape: orientation-based */
        @media (orientation: landscape) and (max-width: 900px) {
          .page-container {
            padding: 16px 20px;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }
        
        /* Small Tablet: 600px - 767px */
        @media (min-width: 600px) and (max-width: 767px) {
          .page-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          
          .modal-backdrop {
            align-items: center;
          }
          
          .modal-content {
            border-radius: 16px;
          }
        }
        
        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) {
          .page-container {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
          }
          
          .modal-backdrop {
            align-items: center;
          }
          
          .modal-content {
            border-radius: 16px;
          }
        }
        
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .page-container {
            padding: 32px;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}