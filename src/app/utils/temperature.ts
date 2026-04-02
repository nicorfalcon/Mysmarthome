import { Preferences } from '../context/AppContext';

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

/**
 * Format temperature value according to user preference
 * Assumes the stored value is always in Celsius
 */
export function formatTemperature(
  celsiusValue: number,
  unit: Preferences['temperatureUnit']
): { value: number; symbol: string; display: string } {
  if (unit === 'fahrenheit') {
    const fahrenheit = celsiusToFahrenheit(celsiusValue);
    return {
      value: fahrenheit,
      symbol: '°F',
      display: `${fahrenheit}°F`,
    };
  }
  
  return {
    value: celsiusValue,
    symbol: '°C',
    display: `${celsiusValue}°C`,
  };
}

/**
 * Get temperature unit symbol
 */
export function getTemperatureSymbol(unit: Preferences['temperatureUnit']): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}
