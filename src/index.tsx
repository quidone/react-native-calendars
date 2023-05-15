export type {Day, FDay} from '@utils/day';
export {F_DAY} from '@utils/day';

export type {
  CalendarMethods,
  Locale,
  PartialCalendarTheme as CalendarTheme,
  PageData,
  WeekPageIndex,
  MonthPageIndex,
  GetPageHeight,
  // events
  OnMonthInitialized,
  OnMonthChanged,
  OnChangePageIndex,
  OnDayChanged,
  OnDayPress,
  // renders
  RenderDay,
  RenderMonthTitleHeader,
  // marked days
  MarkedDays,
  MarkedDaysSelector,
  MarkedDayItem,
  MarkedDayData,
  DotData,
  // styles
  DayContainerStyleFn,
  DayTextStyleFn,
} from '@calendars/common';
export {useTheme, useDots} from '@calendars/common';

export type {WeekCalendarProps} from '@calendars/week';
export {default as WeekCalendar} from '@calendars/week';

export type {MonthCalendarProps} from '@calendars/month';
export {default as MonthCalendar} from '@calendars/month';

export type {WMCalendarProps, CalendarType} from '@calendars/week-month';
export {
  default as WMCalendar,
  createOuterSwitchContainer,
} from '@calendars/week-month';
