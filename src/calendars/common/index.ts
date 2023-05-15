import './dayjs-extensions';

export {default as CalendarContainer} from './Calendar.Container';

export {default as HeaderMonthRow} from './header/Header.MonthRow';
export {default as HeaderWeekDaysRow} from './header/Header.WeekDaysRow';
export {getYearAndMonthByWeekPageIndex} from './header/utils';
export type {
  OnMonthChanged,
  OnMonthInitialized,
} from './header/useMonthEventsEffect';
export {default as useMonthEventsEffect} from './header/useMonthEventsEffect';

import type {CalendarTheme} from './providers/ThemeProvider';
export type PartialCalendarTheme = Partial<CalendarTheme>;
export {useTheme, CalendarTheme} from './providers/ThemeProvider';

export type {
  DayContainerStyleFn,
  DayTextStyleFn,
} from './providers/StylesProvider';

export type {PageData} from './providers/RenderedPagesProvider';
export {
  useRenderedPageData,
  useRenderedPageRegisterEffect,
} from './providers/RenderedPagesProvider';
export type {SyncIndexConfig, RenderPage} from './pager/FlatListPager';
export {default as FlatListPager} from './pager/FlatListPager';
export {default as useAnimatedPagerHeight} from './pager/useAnimatedPagerHeight';
export {default as PageView} from './page/Page.View';
export type {DaysOfWeek} from './page/utils';
export {
  createDaysOfWeek,
  FIRST_DAY_OF_WEEK_INDEX,
  LAST_DAY_OF_WEEK_INDEX,
} from './page/utils';

export type {LDayjs, Locale} from './providers/LocaleProvider';
export {useLocaledDayjs} from './providers/LocaleProvider';
export {useDayState, OnDayPress, OnDayChanged} from './providers/DayProvider';
export {CalendarMethods} from './providers/MethodsProvider';
export {useCalendarWidth} from './providers/CalendarWidthProvider';

export type {
  MarkedDays,
  MarkedDaysSelector,
  MarkedDayItem,
  MarkedDayData,
  DotData,
} from './providers/MarkedDaysProvider';
export type {
  RenderDay,
  RenderMonthTitleHeader,
} from './providers/CustomRendersProvider';
export {useDots} from './dot/DotsContext';

export {
  OnChangePageIndex,
  WeekPageIndex,
  MonthPageIndex,
  GetPageHeight,
} from './types';
export {getDefaultPageHeight, getMonthRowCount} from './page/utils';

export type {BaseCalendarProps} from './providers/baseProviders';
export {default as baseProviders} from './providers/baseProviders';
