import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, Pencil, ChevronRight, Plus, X, Trash2, DoorOpen, Check,
  Home as HomeIcon, Bed, Sofa, Bath, Car, Briefcase, Users, UtensilsCrossed,
  Trees, Armchair, Tv, Building, Coffee, BookOpen, Dumbbell, Music,
  Baby, PawPrint, Shirt, Wrench, Wine, Flower, Gamepad2, Lamp
} from 'lucide-react';
import { RoomIcon } from '../components/DeviceIcon';
import { useTranslation } from '../i18n/useTranslation';
import { useBasePath } from '../utils/useBasePath';

// Flexible icon library for rooms and spaces
const roomIconOptions = [
  { type: 'bedroom', label: 'Bedroom', Icon: Bed },
  { type: 'living-room', label: 'Living Room', Icon: Sofa },
  { type: 'kitchen', label: 'Kitchen', Icon: UtensilsCrossed },
  { type: 'bathroom', label: 'Bathroom', Icon: Bath },
  { type: 'office', label: 'Office', Icon: Briefcase },
  { type: 'garage', label: 'Garage', Icon: Car },
  { type: 'dining', label: 'Dining', Icon: Wine },
  { type: 'meeting-room', label: 'Meeting Room', Icon: Users },
  { type: 'garden', label: 'Garden', Icon: Trees },
  { type: 'lounge', label: 'Lounge', Icon: Armchair },
  { type: 'entertainment', label: 'Entertainment', Icon: Tv },
  { type: 'balcony', label: 'Balcony', Icon: Flower },
  { type: 'home', label: 'Home', Icon: HomeIcon },
  { type: 'library', label: 'Library', Icon: BookOpen },
  { type: 'gym', label: 'Gym', Icon: Dumbbell },
  { type: 'music-room', label: 'Music Room', Icon: Music },
  { type: 'nursery', label: 'Nursery', Icon: Baby },
  { type: 'pet-area', label: 'Pet Area', Icon: PawPrint },
  { type: 'laundry', label: 'Laundry', Icon: Shirt },
  { type: 'workshop', label: 'Workshop', Icon: Wrench },
  { type: 'game-room', label: 'Game Room', Icon: Gamepad2 },
  { type: 'study', label: 'Study', Icon: Lamp },
  { type: 'cafe', label: 'Cafe', Icon: Coffee },
  { type: 'building', label: 'Building', Icon: Building },
];

export function RoomsPage() {
  const { homeId: urlHomeId } = useParams();
  const navigate = useNavigate();
  const { homes, selectedHomeId, addRoom, updateRoom, deleteRoom } = useApp();
  const { t } = useTranslation();
  const basePath = useBasePath();

  // Use URL homeId if available (for backwards compatibility), otherwise use selectedHomeId
  const activeHomeId = urlHomeId || selectedHomeId;
  const home = homes.find((h) => h.id === activeHomeId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('bedroom');
  const [inlineEditNames, setInlineEditNames] = useState<Record<string, string>>({});
  const [showIconSelector, setShowIconSelector] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);

  if (!home) return null;

  const handleAdd = () => {
    if (!newName.trim()) {
      setNameError(true);
      return;
    }
    if (!activeHomeId) return;
    addRoom(activeHomeId, {
      id: `room-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      homeId: activeHomeId,
      devices: [],
    });
    setNewName('');
    setNewType('bedroom');
    setNameError(false);
    setShowAddModal(false);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm || !activeHomeId) return;
    deleteRoom(activeHomeId, showDeleteConfirm);
    setShowDeleteConfirm(null);
  };

  const handleInlineNameChange = (roomId: string, newName: string) => {
    setInlineEditNames(prev => ({ ...prev, [roomId]: newName }));
  };

  const handleInlineNameBlur = (roomId: string) => {
    const updatedName = inlineEditNames[roomId];
    if (updatedName && updatedName.trim() && activeHomeId) {
      updateRoom(activeHomeId, roomId, { name: updatedName.trim() });
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between" style={{ height: '48px' }}>
          <div className="flex items-center gap-3">
            {/* Show back button only if we came from URL routing */}
            {urlHomeId && (
              <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
                <ArrowLeft size={22} color="var(--foreground)" />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1 }}>{t('rooms.title')}</h1>
              <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>{home.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--card)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Pencil size={16} color="var(--muted-foreground)" />
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)', boxShadow: '0 2px 8px rgba(124,92,255,0.3)' }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Plus size={18} color="#fff" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--card)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: '24px', height: '24px', backgroundColor: '#7C5CFF' }}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State or Room Cards */}
      {home.rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{ width: '72px', height: '72px', backgroundColor: 'var(--card)' }}
          >
            <DoorOpen size={32} color="#3A3A44" strokeWidth={1.5} />
          </div>
          <p className="text-center" style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500 }}>
            {t('rooms.noRoomsYet')}
          </p>
          <p className="text-center mt-1" style={{ color: 'var(--secondary-text)', fontSize: '13px' }}>
            {t('rooms.addFirstRoom')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
              boxShadow: '0 4px 12px rgba(124,92,255,0.3)',
              color: '#fff', fontSize: '14px', fontWeight: 600,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus size={16} />
            {t('rooms.addFirstRoomButton')}
          </button>
        </div>
      ) : (
        <div className="responsive-grid">
          {home.rooms.map((room) => {
            const activeCount = room.devices.filter((d) => d.isOn).length;
            const currentName = inlineEditNames[room.id] ?? room.name;
            
            return (
              <div key={room.id} className="relative">
                <button
                  onClick={() => !isEditMode && navigate(`${basePath}/homes/${activeHomeId}/rooms/${room.id}/devices`)}
                  className="flex items-center gap-4 text-left w-full"
                  style={{
                    padding: '16px', borderRadius: '12px', backgroundColor: 'var(--card)', border: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 200ms ease-in-out',
                    cursor: isEditMode ? 'default' : 'pointer',
                    paddingRight: isEditMode ? '56px' : '16px', // Add space for delete button
                  }}
                  onMouseDown={(e) => !isEditMode && (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {/* Icon with edit overlay */}
                  <button
                    className="shrink-0 relative"
                    onClick={(e) => {
                      if (isEditMode) {
                        e.stopPropagation();
                        setShowIconSelector(room.id);
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0',
                      borderRadius: '8px',
                      cursor: isEditMode ? 'pointer' : 'default',
                      transition: 'all 200ms ease',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RoomIcon type={room.type} size={32} color="#7C5CFF" />
                    {isEditMode && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '8px',
                        }}
                      >
                        <Pencil size={14} color="#FFFFFF" strokeWidth={2} />
                      </div>
                    )}
                  </button>
                  <div className="flex-1">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={currentName}
                        onChange={(e) => handleInlineNameChange(room.id, e.target.value)}
                        onBlur={() => handleInlineNameBlur(room.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-white outline-none w-full"
                        style={{ 
                          fontSize: '16px', 
                          fontWeight: 600,
                          border: 'none',
                          padding: '4px 8px',
                          fontFamily: 'inherit',
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          marginLeft: '-8px',
                        }}
                        autoFocus={false}
                      />
                    ) : (
                      <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>{room.name}</p>
                    )}
                    <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>{room.devices.length} {t('common.devices')}</span>
                      {activeCount > 0 && (
                        <span className="flex items-center gap-1">
                          <span style={{ color: '#3A3A44' }}>·</span>
                          <span className="flex items-center gap-1" style={{ color: '#34C759', fontSize: '12px', fontWeight: 500 }}>
                            <span className="inline-block rounded-full" style={{ width: '5px', height: '5px', backgroundColor: '#34C759' }} />
                            {activeCount} {t('common.active')}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  {!isEditMode && (
                    <ChevronRight size={20} style={{ color: 'var(--muted-foreground)', transition: 'opacity 200ms ease-in-out' }} />
                  )}
                </button>
                
                {/* Circular Delete Button */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(room.id);
                    }}
                    className="absolute flex items-center justify-center transition-all"
                    style={{
                      top: '50%',
                      right: '16px',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)';
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <Trash2 size={20} color="#FF3B30" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-30 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => { setShowAddModal(false); setNameError(false); }}>
          <div className="w-full max-w-md rounded-t-2xl p-5" style={{ backgroundColor: 'var(--background)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>{t('rooms.addRoom')}</p>
              <button onClick={() => { setShowAddModal(false); setNameError(false); }}><X size={20} color="var(--muted-foreground)" /></button>
            </div>
            <div className="mb-4">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('rooms.roomName')}</p>
              <input type="text" placeholder="e.g. Guest Room" value={newName} onChange={(e) => { setNewName(e.target.value); if (nameError) setNameError(false); }}
                className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: `1px solid ${nameError ? '#FF3B30' : 'var(--muted)'}`, fontSize: '14px' }} />
              {nameError && (
                <p style={{ color: '#FF3B30', fontSize: '12px', marginTop: '6px' }}>Room name is required.</p>
              )}
            </div>
            <div className="mb-6">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('rooms.selectIcon')}</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                maxHeight: '240px',
                overflowY: 'auto',
              }}>
                {roomIconOptions.map((rt) => (
                  <button key={rt.type} onClick={() => setNewType(rt.type)}
                    className="flex flex-col items-center justify-center transition-all"
                    style={{
                      aspectRatio: '1',
                      backgroundColor: newType === rt.type ? 'rgba(124,92,255,0.15)' : 'var(--card)',
                      borderRadius: '12px',
                      border: `2px solid ${newType === rt.type ? '#7C5CFF' : 'var(--muted)'}`,
                      padding: '8px',
                    }}
                  >
                    <rt.Icon size={24} color={newType === rt.type ? '#7C5CFF' : 'var(--muted-foreground)'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAdd} className="w-full py-3.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)', color: '#fff', fontSize: '16px', fontWeight: 600 }}>
              {t('rooms.addRoom')}
            </button>
          </div>
        </div>
      )}


      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl p-5" style={{ backgroundColor: 'var(--background)' }} onClick={(e) => e.stopPropagation()}>
            <p className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>{t('rooms.deleteRoomConfirm')}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
              {t('rooms.deleteRoomMessage', { name: home.rooms.find(r => r.id === showDeleteConfirm)?.name || '' })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: 'var(--card)', color: '#fff', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: '#FF3B30', color: '#fff', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Icon Selector Modal */}
      {showIconSelector && (() => {
        const room = home.rooms.find(r => r.id === showIconSelector);
        if (!room) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowIconSelector(null)}>
            <div className="w-full max-w-md rounded-t-2xl p-5" style={{ backgroundColor: 'var(--background)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>{t('rooms.selectIcon')}</p>
                <button onClick={() => setShowIconSelector(null)}><X size={20} color="var(--muted-foreground)" /></button>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                overflowY: 'auto',
                paddingBottom: '8px',
              }}>
                {roomIconOptions.map((option) => {
                  const isSelected = room.type === option.type;
                  return (
                    <button
                      key={option.type}
                      onClick={() => {
                        if (activeHomeId) {
                          updateRoom(activeHomeId, room.id, { type: option.type });
                        }
                        setShowIconSelector(null);
                      }}
                      className="flex items-center justify-center transition-all"
                      style={{
                        aspectRatio: '1',
                        backgroundColor: isSelected ? 'rgba(124,92,255,0.15)' : 'var(--card)',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#7C5CFF' : 'var(--muted)'}`,
                        padding: '8px',
                      }}
                    >
                      <option.Icon size={24} color={isSelected ? '#7C5CFF' : 'var(--muted-foreground)'} strokeWidth={1.5} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        .page-container {
          padding: 16px;
          width: 100%;
          max-width: 100%;
        }
        
        .breadcrumb {
          margin-left: 52px;
        }
        
        .responsive-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: 1fr;
        }
        
        /* Mobile Landscape: orientation-based */
        @media (orientation: landscape) and (max-width: 900px) {
          .page-container {
            padding: 16px 20px;
          }
          
          .breadcrumb {
            margin-left: 0;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        
        /* Small Tablet: 600px - 767px */
        @media (min-width: 600px) and (max-width: 767px) {
          .page-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .breadcrumb {
            margin-left: 0;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        
        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) {
          .page-container {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .breadcrumb {
            margin-left: 0;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 12px;
          }
        }
        
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .page-container {
            padding: 32px;
          }
          
          .responsive-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}