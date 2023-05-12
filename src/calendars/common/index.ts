import './dayjs-extensions';

export {default as CalendarContainer} from './Calendar.Container';
export {default as HeaderMonthRow} from './header/Header.MonthRow';
export {default as HeaderWeekDaysRow} from './header/Header.WeekDaysRow';
export {getYearAndMonthByWeekPageIndex} from './header/utils';
export {
  default as useMonthEventsEffect,
  OnMonthChanged,
  OnMonthInitialized,
} from './header/useMonthEventsEffect';

export {
  default as FlatListPager,
  SyncIndexConfig,
  RenderPage,
} from './pager/FlatListPager';
export {default as useAnimatedPagerHeight} from './pager/useAnimatedPagerHeight';
export {default as PageView} from './page/Page.View';
export {
  DaysOfWeek,
  createDaysOfWeek,
  FIRST_DAY_OF_WEEK_INDEX,
  LAST_DAY_OF_WEEK_INDEX,
} from './page/utils';

export {
  default as baseProviders,
  BaseCalendarProps,
} from './providers/baseProviders';
export {useLocaledDayjs, LDayjs, Locale} from './providers/LocaleProvider';
export {useDayState} from './providers/DayProvider';
export {CalendarMethods} from './providers/MethodsProvider';
export {useCalendarWidth} from './providers/CalendarWidthProvider';
export {useTheme, CalendarTheme} from './providers/ThemeProvider';
import type {CalendarTheme} from './providers/ThemeProvider';
export type PartialCalendarTheme = Partial<CalendarTheme>;
export type {
  MarkedDays,
  MarkedDaysSelector,
  MarkedDaysList,
  MarkedDayData,
  DotData,
} from './providers/MarkedDaysProvider';
export type {
  RenderDay,
  RenderMonthTitleHeader,
} from './providers/CustomRendersProvider';

export {
  useRenderedPageData,
  useRenderedPageRegisterEffect,
  PageData,
} from './providers/RenderedPagesProvider';

export {
  OnChangePageIndex,
  WeekPageIndex,
  MonthPageIndex,
  GetPageHeight,
} from './types';
export {getDefaultPageHeight, getMonthRowCount} from './page/utils';
