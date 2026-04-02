import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { EnergyConsumption } from '../components/EnergyConsumption';
import { useTranslation } from '../i18n/useTranslation';

export function EnergyConsumptionPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4" style={{ height: '48px' }}>
        <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
          <ArrowLeft size={22} color="var(--foreground)" />
        </button>
        <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
          {t('energy.title')}
        </h1>
      </div>

      <EnergyConsumption />
      
      <style>{`
        /* Mobile base styles already in place */
        
        /* Mobile Landscape: orientation-based */
        @media (orientation: landscape) and (max-width: 900px) {
          .flex.flex-col.px-4 {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
        
        /* Small Tablet: 600px - 767px */
        @media (min-width: 600px) and (max-width: 767px) {
          .flex.flex-col.px-4 {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) {
          .flex.flex-col.px-4 {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .flex.flex-col.px-4 {
            padding: 32px;
            max-width: 800px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}