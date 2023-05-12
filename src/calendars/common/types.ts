import type {CalendarTheme} from './providers/ThemeProvider';

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

export type OnChangePageIndex<T extends WeekPageIndex | MonthPageIndex> =
  (event: {value: T}) => void;
