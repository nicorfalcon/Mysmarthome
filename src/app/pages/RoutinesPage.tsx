import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Plus, Play, Clock, Zap, Pencil, X, Check, Trash2 } from 'lucide-react';
import { DeviceIcon } from '../components/DeviceIcon';
import { useTranslation } from '../i18n/useTranslation';
import { useBasePath } from '../utils/useBasePath';

export function RoutinesPage() {
  const navigate = useNavigate();
  const { activeHome, activeDevices, activeRoutines, toggleRunningRoutine, deleteRoutine } = useApp();
  const { t } = useTranslation();
  const basePath = useBasePath();
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Only look up devices within the active location
  const getDevice = (deviceId: string) => activeDevices.find((d) => d.id === deviceId);

  const handleRun = (routineId: string) => {
    toggleRunningRoutine(routineId);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ height: '48px' }}>
        <div>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1 }}>
            {t('routines.title')}
          </h1>
          {activeHome && (
            <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>
              {activeHome.name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`${basePath}/routines/create`)}
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

      {activeRoutines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{ width: '72px', height: '72px', backgroundColor: 'var(--card)' }}
          >
            <Zap size={32} color="var(--muted-foreground)" strokeWidth={1.5} />
          </div>
          <p className="text-center" style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500 }}>
            {t('routines.noRoutinesYet')}
          </p>
          <p className="text-center mt-1" style={{ color: 'var(--secondary-text)', fontSize: '13px' }}>
            {activeHome
              ? t('routines.noRoutinesForLocation', { name: activeHome.name })
              : t('routines.selectLocationRoutines')}
          </p>
          <button
            onClick={() => navigate(`${basePath}/routines/create`)}
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
            {t('routines.createFirstRoutineButton')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeRoutines.map((routine) => {
            const isRunning = routine.isRunning;
            return (
              <div
                key={routine.id}
                className="rounded-xl"
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--card)',
                  border: isRunning
                    ? '1.5px solid rgba(124,92,255,0.5)'
                    : '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: 1,
                  transition: 'all 250ms ease',
                }}
              >
                {/* Top row: name + edit */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p style={{ color: 'var(--foreground)', fontSize: '16px', fontWeight: 600 }}>
                        {routine.name}
                      </p>
                      {isRunning && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#7C5CFF',
                            backgroundColor: 'rgba(124,92,255,0.12)',
                            borderRadius: '6px',
                            padding: '1px 6px',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {t('common.runningEllipsis')}
                        </span>
                      )}
                      <button
                        onClick={() => setShowActionMenu(routine.id)}
                        className="flex items-center justify-center rounded-full shrink-0 transition-all"
                        style={{ width: '28px', height: '28px', backgroundColor: 'var(--muted)' }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Pencil size={12} color="var(--muted-foreground)" />
                      </button>
                    </div>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', marginTop: '2px' }}>
                      {routine.description}
                    </p>
                  </div>
                </div>

                {/* Trigger time */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={14} color="#7C5CFF" />
                  <span style={{ color: '#7C5CFF', fontSize: '12px', fontWeight: 500 }}>
                    {routine.triggerTime}
                  </span>
                </div>

                {/* Devices involved */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {routine.devices.map((rd) => {
                    const dev = getDevice(rd.deviceId);
                    if (!dev) return null;
                    return (
                      <div key={rd.deviceId} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                        <span style={{ color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}>
                          <DeviceIcon type={dev.type} size={14} color="currentColor" />
                        </span>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>{dev.name} - {rd.action}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Run button */}
                <button
                  onClick={() => handleRun(routine.id)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl transition-all"
                  style={{
                    background: isRunning
                      ? 'linear-gradient(135deg, #34C759, #30B350)'
                      : 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                    boxShadow: '0 4px 12px rgba(124,92,255,0.3)',
                    color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isRunning ? (
                    <><Check size={16} /> {t('common.runningEllipsis')}</>
                  ) : (
                    <><Play size={16} /> {t('common.run')}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Menu */}
      {showActionMenu && (
        <div className="fixed inset-0 z-30 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowActionMenu(null)}>
          <div className="w-full max-w-md rounded-t-2xl p-4" style={{ backgroundColor: 'var(--background)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate(`${basePath}/routines/${showActionMenu}/edit`);
                  setShowActionMenu(null);
                }}
                className="w-full py-3.5 rounded-xl text-left px-4 flex items-center gap-3 transition-all"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', fontSize: '15px', fontWeight: 500 }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
              >
                <Pencil size={18} color="#7C5CFF" />
                {t('routines.editRoutine')}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(showActionMenu);
                  setShowActionMenu(null);
                }}
                className="w-full py-3.5 rounded-xl text-left px-4 flex items-center gap-3 transition-all"
                style={{ backgroundColor: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontSize: '15px', fontWeight: 500 }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.15)')}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.1)')}
              >
                <Trash2 size={18} />
                {t('routines.deleteRoutine')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl p-5" style={{ backgroundColor: 'var(--background)' }} onClick={(e) => e.stopPropagation()}>
            <p style={{ color: 'var(--foreground)', fontSize: '18px', fontWeight: 600 }}>{t('routines.deleteRoutineConfirm')}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
              {t('routines.deleteRoutineMessage', { name: activeRoutines.find(r => r.id === showDeleteConfirm)?.name || '' })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => { deleteRoutine(showDeleteConfirm); setShowDeleteConfirm(null); }}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: '#FF3B30', color: '#fff', fontSize: '15px', fontWeight: 600 }}
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
          padding-bottom: 80px;
          width: 100%;
          max-width: 100%;
        }
        
        @media (orientation: landscape) and (max-width: 900px) {
          .page-container {
            padding: 16px 20px 80px 20px;
          }
        }
        
        @media (min-width: 600px) and (max-width: 767px) {
          .page-container {
            padding: 20px;
            padding-bottom: 80px;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        @media (min-width: 768px) {
          .page-container {
            padding: 24px;
            padding-bottom: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        @media (min-width: 1025px) {
          .page-container {
            padding: 32px;
          }
        }
      `}</style>
    </div>
  );
}