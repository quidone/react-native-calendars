import type {CalendarTheme} from './providers/ThemeProvider';
import type {WithSpringConfig, WithTimingConfig} from 'react-native-reanimated';

export type WeekPageIndex = {
  year: number;
  dayOfYear: number;
};
export type MonthPageIndex = {
  year: number;
  month: number;
};
export type PageIndex = WeekPageIndex | MonthPageIndex;

export type GetPageHeight = (info: {
  theme: CalendarTheme;
  rowCount: number;
}) => number;

export type AnimConfig =
  | {
      type: 'timing';
      option?: WithTimingConfig;
    }
  | {
      type: 'spring';
      option?: WithSpringConfig;
    };

export type OnChangePageIndex<T extends WeekPageIndex | MonthPageIndex> =
  (event: {value: T}) => void;
