import { useState, useMemo } from 'react';
import { Zap, ArrowUp, ArrowDown, Lightbulb, Fan, Flame, Snowflake, Bot, Speaker, DoorOpen, Blinds, BellRing, Droplets } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

const deviceIconMap: Record<string, LucideIcon> = {
  lamp: Lightbulb,
  ac: Fan,
  oven: Flame,
  fridge: Snowflake,
  vacuum: Bot,
  speaker: Speaker,
  door: DoorOpen,
  curtains: Blinds,
  alarm: BellRing,
  sprinkler: Droplets,
};

// Violet palette shades for device bars
const barColors = ['#7C5CFF', '#9B84FF', '#6B4FE0', '#B5A3FF', '#5A3FCC', '#8B6FFF', '#4A30B0', '#C4B0FF'];

type Period = 'weekly' | 'monthly' | 'yearly';

const CustomTooltip = ({ active, payload, label, period }: any) => {
  if (active && payload && payload.length) {
    const currentValue = payload[0].value;
    const prevValue = payload[0].payload.prevValue;
    const change = prevValue ? ((currentValue - prevValue) / prevValue) * 100 : 0;
    const isIncrease = change > 0;
    const periodLabel =
      period === 'weekly' ? 'previous week' :
      period === 'monthly' ? 'previous month' :
      'previous year';

    return (
      <div
        className="px-3 py-2 rounded-lg"
        style={{
          backgroundColor: '#3A3A44',
          border: '1px solid rgba(124,92,255,0.3)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <p style={{ color: 'var(--muted-foreground)', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
          {currentValue} kWh
        </p>
        {prevValue && (
          <div
            className="flex items-center gap-1"
            style={{
              color: isIncrease ? '#FF3B30' : '#34C759',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {isIncrease ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {isIncrease ? '+' : ''}{change.toFixed(1)}% vs {periodLabel}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function EnergyConsumption() {
  const { activeDevices, activeHome } = useApp();
  const { t } = useTranslation();
  const [chartPeriod, setChartPeriod] = useState<Period>('weekly');

  // Build device consumption list from real device data, sorted highest first
  const deviceConsumption = useMemo(() => {
    return activeDevices
      .filter((d) => (d.energyConsumption ?? 0) > 0)
      .map((d, idx) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        energy: d.energyConsumption ?? 0,
        color: barColors[idx % barColors.length],
      }))
      .sort((a, b) => b.energy - a.energy);
  }, [activeDevices]);

  // Scale simulated chart data proportionally based on active location's total energy
  const totalEnergy = useMemo(
    () => deviceConsumption.reduce((sum, d) => sum + d.energy, 0),
    [deviceConsumption]
  );

  // Baseline: "Home" has ~90 kWh across all its devices
  const baselineTotal = 90;
  const scaleFactor = totalEnergy > 0 ? totalEnergy / baselineTotal : 1;
  const scale = (v: number) => parseFloat((v * scaleFactor).toFixed(1));

  const weeklyData = useMemo(() => [
    { name: 'Mon', value: scale(10.4), prevValue: scale(11.2) },
    { name: 'Tue', value: scale(13.1), prevValue: scale(12.8) },
    { name: 'Wed', value: scale(11.8), prevValue: scale(12.4) },
    { name: 'Thu', value: scale(14.3), prevValue: scale(13.6) },
    { name: 'Fri', value: scale(11.5), prevValue: scale(12.1) },
    { name: 'Sat', value: scale(12.7), prevValue: scale(12.0) },
    { name: 'Sun', value: scale(10.4), prevValue: scale(11.0) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [scaleFactor]);

  const monthlyData = useMemo(() => [
    { name: 'Week 1', value: scale(72), prevValue: scale(75) },
    { name: 'Week 2', value: scale(88), prevValue: scale(85) },
    { name: 'Week 3', value: scale(75), prevValue: scale(80) },
    { name: 'Week 4', value: scale(85), prevValue: scale(88) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [scaleFactor]);

  const yearlyData = useMemo(() => [
    { name: 'Jan', value: scale(285), prevValue: scale(295) },
    { name: 'Feb', value: scale(265), prevValue: scale(270) },
    { name: 'Mar', value: scale(320), prevValue: scale(310) },
    { name: 'Apr', value: scale(290), prevValue: scale(285) },
    { name: 'May', value: scale(340), prevValue: scale(330) },
    { name: 'Jun', value: scale(380), prevValue: scale(360) },
    { name: 'Jul', value: scale(420), prevValue: scale(400) },
    { name: 'Aug', value: scale(410), prevValue: scale(395) },
    { name: 'Sep', value: scale(350), prevValue: scale(360) },
    { name: 'Oct', value: scale(310), prevValue: scale(320) },
    { name: 'Nov', value: scale(290), prevValue: scale(280) },
    { name: 'Dec', value: scale(300), prevValue: scale(290) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [scaleFactor]);

  const dataMap: Record<Period, typeof weeklyData> = {
    weekly: weeklyData,
    monthly: monthlyData,
    yearly: yearlyData,
  };

  // Summary stats scaled by active location
  const energySummary = useMemo(() => [
    { label: t('energy.today'), value: scale(12.5).toFixed(1), unit: 'kWh' },
    { label: t('energy.thisWeek'), value: scale(84.2).toFixed(1), unit: 'kWh' },
    { label: t('energy.thisMonth'), value: scale(320.4).toFixed(1), unit: 'kWh' },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [scaleFactor, t]);

  const chartData = dataMap[chartPeriod];
  const maxDeviceEnergy =
    deviceConsumption.length > 0
      ? Math.max(...deviceConsumption.map((d) => d.energy))
      : 1;

  // Empty state when no devices in active location
  if (activeDevices.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ paddingTop: '64px', paddingBottom: '64px' }}
      >
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{ width: '72px', height: '72px', backgroundColor: 'var(--card)' }}
        >
          <Zap size={32} color="#3A3A44" strokeWidth={1.5} />
        </div>
        <p className="text-center" style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500 }}>
          {t('energy.noEnergyData')}
        </p>
        <p className="text-center mt-1" style={{ color: 'var(--secondary-text)', fontSize: '13px' }}>
          {activeHome
            ? t('energy.noDevicesInLocation', { name: activeHome.name })
            : t('energy.selectLocationEnergy')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: '16px' }}>
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Zap size={20} style={{ color: '#7C5CFF' }} />
        <h2 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>
          {t('energy.title')}
        </h2>
        {activeHome && (
          <span
            className="ml-auto"
            style={{
              color: '#7C5CFF',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: 'rgba(124,92,255,0.12)',
              padding: '2px 10px',
              borderRadius: '20px',
              flexShrink: 0,
            }}
          >
            {activeHome.name}
          </span>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="flex" style={{ gap: '10px' }}>
        {energySummary.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col"
            style={{
              padding: '14px 12px',
              borderRadius: '12px',
              backgroundColor: '#2A2A31',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            }}
          >
            <p style={{ color: 'var(--muted-foreground)', fontSize: '11px', marginBottom: '6px' }}>
              {stat.label}
            </p>
            <p className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              {stat.value}
            </p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '10px', marginTop: '2px' }}>
              {stat.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#2A2A31',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        {/* Period Tabs */}
        <div className="flex rounded-xl p-1 mb-4" style={{ backgroundColor: 'var(--background)' }}>
          {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setChartPeriod(p)}
              className="flex-1 py-2 rounded-lg transition-all"
              style={{
                background: chartPeriod === p
                  ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)'
                  : 'transparent',
                color: chartPeriod === p ? '#FFFFFF' : '#B8B8C2',
                fontSize: '12px',
                fontWeight: chartPeriod === p ? 600 : 400,
              }}
            >
              {t(`energy.${p}` as any)}
            </button>
          ))}
        </div>

        {/* Chart — keyed by location + period so it re-renders on location switch */}
        <div style={{ height: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={`chart-${chartPeriod}-${activeHome?.id}`}
              data={chartData}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6A6A75', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6A6A75', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip period={chartPeriod} />} cursor={false} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => {
                  const maxVal = Math.max(...chartData.map((d) => d.value));
                  const isMax = entry.value === maxVal;
                  return (
                    <Cell
                      key={`${chartPeriod}-${index}`}
                      fill={isMax ? '#7C5CFF' : 'rgba(124,92,255,0.3)'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Breakdown — real data from active location */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#2A2A31',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        <p className="text-white mb-4" style={{ fontSize: '15px', fontWeight: 600 }}>
          {t('energy.usageByDevice')}
        </p>

        {deviceConsumption.length === 0 ? (
          <p style={{ color: 'var(--secondary-text)', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
            {t('energy.noEnergyDataLocation')}
          </p>
        ) : (
          <div className="flex flex-col" style={{ gap: '14px' }}>
            {deviceConsumption.map((device) => {
              const Icon = deviceIconMap[device.type] ?? Zap;
              return (
                <div key={device.id} className="flex items-center" style={{ gap: '12px' }}>
                  {/* Device Icon */}
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, rgba(124,92,255,0.2), rgba(124,92,255,0.06))',
                    }}
                  >
                    <Icon size={16} color="#7C5CFF" strokeWidth={1.5} />
                  </div>

                  {/* Name + Progress bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white truncate" style={{ fontSize: '13px', fontWeight: 500 }}>
                        {device.name}
                      </span>
                      <span
                        style={{
                          color: '#B8B8C2',
                          fontSize: '12px',
                          fontWeight: 500,
                          marginLeft: '8px',
                          flexShrink: 0,
                        }}
                      >
                        {device.energy} kWh
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: '5px', backgroundColor: 'var(--background)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(device.energy / maxDeviceEnergy) * 100}%`,
                          background: `linear-gradient(90deg, ${device.color}, ${device.color}99)`,
                          transition: 'width 500ms ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}