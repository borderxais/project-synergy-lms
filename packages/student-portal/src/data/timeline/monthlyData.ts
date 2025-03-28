import { MonthlyData } from '../../types/timeline';
import { decemberData } from './months/december';
import { januaryData } from './months/january';
import { februaryData } from './months/february';
import { marchData } from './months/march';
import { aprilData } from './months/april';
import { mayData } from './months/may';
import { juneData } from './months/june';
import { julyData } from './months/july';
import { augustData } from './months/august';
import { septemberData } from './months/september';

export const MONTHLY_DATA: Record<string, MonthlyData> = {
  'Dec-2024': decemberData,
  'Jan-2025': januaryData,
  'Feb-2025': februaryData,
  'Mar-2025': marchData,
  'Apr-2025': aprilData,
  'May-2025': mayData,
  'Jun-2025': juneData,
  'Jul-2025': julyData,
  'Aug-2025': augustData,
  'Sep-2025': septemberData
};