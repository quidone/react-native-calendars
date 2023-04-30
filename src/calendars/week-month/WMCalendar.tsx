import React, {ForwardedRef, forwardRef, RefAttributes, useMemo} from 'react';
import {
  getMonthPageIndexOrDefault,
  getSyncedMonthPageIndex,
  getSyncedWeekPageIndex,
  getWeekPageIndexOrDefault,
} from './utils/page-index';
import useCalendarTypeState, {
  OnTypeChanged,
} from './hooks/useCalendarTypeState';
import Header from './header/Header';
import PagersController from './pager/PagersController';
import type {GetMonthPagerOffsetY} from './hooks/useMonthPagerOffsetY';
import type {CalendarType} from './types';
import type {AnimConfig} from '@utils/react-native-reanimated';
import {
  BaseCalendarProps,
  baseProviders,
  CalendarContainer,
  CalendarMethods,
  GetPageHeight,
  MonthPageIndex,
  OnChangePageIndex,
  OnMonthChanged,
  OnMonthInitialized,
  useDayState,
  useLocaledDayjs,
  WeekPageIndex,
} from '@calendars/common';
import type {Day} from '@utils/day';
import {useInit, useStableCallback} from '@rozhkov/react-useful-hooks';
import {
  getWeekPageEndOrDefault,
  getWeekPageStartOrDefault,
  WeekPager,
  WeekPagesProvider,
} from '@calendars/week';
import {
  getMonthPageEndOrDefault,
  getMonthPageStartOrDefault,
  MonthPager,
  MonthPagesProvider,
} from '@calendars/month';

type WMCalendarCoreProps = {
  type?: CalendarType;
  enableSwitchingByGesture?: boolean; // TODO rename
  switchingAnimConfig?: AnimConfig; // TODO rename
  onTypeChanged?: OnTypeChanged;
  getMonthPagerOffsetY?: GetMonthPagerOffsetY;

  onPageIndexChanged?: OnChangePageIndex<WeekPageIndex | MonthPageIndex>;
  pageHeight?:
    | GetPageHeight
    | Partial<Record<CalendarType, number | GetPageHeight>>;
  /**
   * PageIndex or date in the format 'YYYY-MM-DD'. Default today or firstPage
   */
  initPageIndex?: Day;
  pageStart?: MonthPageIndex | Day;
  pageEnd?: MonthPageIndex | Day;
  visibleMonthHeader?: boolean;
  visibleWeekDaysHeader?: boolean;
  onMonthInitialized?: OnMonthInitialized;
  onMonthChanged?: OnMonthChanged;

  calendarWidth?: number;
};

const WMCalendarCore = (
  {
    type: typeProp,
    onTypeChanged,
    enableSwitchingByGesture,
    switchingAnimConfig,
    initPageIndex,
    pageEnd,
    pageStart,
    onPageIndexChanged,

    pageHeight,
    getMonthPagerOffsetY,

    calendarWidth,
    visibleMonthHeader = true,
    visibleWeekDaysHeader = true,
    onMonthInitialized,
    onMonthChanged,
  }: WMCalendarCoreProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  const [selectedDay] = useDayState();
  const ldayjs = useLocaledDayjs();
  const [type, changeType] = useCalendarTypeState(typeProp, onTypeChanged);

  const {initWeekPageIndex, initMonthPageIndex} = useInit(() => {
    if (type === 'week') {
      const weekIndex = getWeekPageIndexOrDefault(
        initPageIndex,
        selectedDay,
        ldayjs,
      );
      const monthIndex = getSyncedMonthPageIndex(
        ldayjs().year(weekIndex.year).dayOfYear(weekIndex.dayOfYear),
        selectedDay,
      );
      return {
        initWeekPageIndex: weekIndex,
        initMonthPageIndex: monthIndex,
      };
    } else if (type === 'month') {
      const monthIndex = getMonthPageIndexOrDefault(
        initPageIndex,
        selectedDay,
        ldayjs,
      );
      const weekIndex = getSyncedWeekPageIndex(
        ldayjs().year(monthIndex.year).month(monthIndex.month),
        selectedDay,
      );
      return {
        initWeekPageIndex: weekIndex,
        initMonthPageIndex: monthIndex,
      };
    } else {
      throw new Error('No implementation');
    }
  });
  const monthPageStart = useMemo(
    () => getMonthPageStartOrDefault(pageStart, ldayjs),
    [ldayjs, pageStart],
  );
  const monthPageEnd = useMemo(
    () => getMonthPageEndOrDefault(pageEnd, ldayjs),
    [ldayjs, pageEnd],
  );
  const weekPageStart = useMemo(
    () => getWeekPageStartOrDefault(monthPageStart, ldayjs),
    [ldayjs, monthPageStart],
  );
  const weekPageEnd = useMemo(
    () => getWeekPageEndOrDefault(monthPageEnd, ldayjs),
    [ldayjs, monthPageEnd],
  );
  const onWeekPageIndexChanged = useStableCallback<
    OnChangePageIndex<WeekPageIndex>
  >((e) => {
    if (type === 'week') {
      onPageIndexChanged?.(e);
    }
  });
  const onMonthPageIndexChanged = useStableCallback<
    OnChangePageIndex<MonthPageIndex>
  >((e) => {
    if (type === 'month') {
      onPageIndexChanged?.(e);
    }
  });
  const {weekPageHeight, monthPageHeight} = useMemo(() => {
    if (typeof pageHeight === 'object') {
      return {
        weekPageHeight: pageHeight.week,
        monthPageHeight: pageHeight.month,
      };
    }
    return {weekPageHeight: pageHeight, monthPageHeight: pageHeight};
  }, [pageHeight]);

  return (
    <WeekPagesProvider
      pageStart={weekPageStart}
      pageEnd={weekPageEnd}
      onChangePageIndex={onWeekPageIndexChanged}
      initPageIndex={initWeekPageIndex}>
      <MonthPagesProvider
        pageStart={monthPageStart}
        pageEnd={monthPageEnd}
        onChangePageIndex={onMonthPageIndexChanged}
        initPageIndex={initMonthPageIndex}>
        <CalendarContainer width={calendarWidth}>
          <Header
            calendarType={type}
            visibleMonthHeader={visibleMonthHeader}
            visibleWeekDaysHeader={visibleWeekDaysHeader}
            onMonthInitialized={onMonthInitialized}
            onMonthChanged={onMonthChanged}
          />
          <PagersController
            ref={forwardedRef}
            type={type}
            onChangedType={changeType}
            switchingAnimConfig={switchingAnimConfig}
            enableSwitchingByGesture={enableSwitchingByGesture}
            getMonthPagerOffsetY={getMonthPagerOffsetY}
            renderWeekPager={(props) => (
              <WeekPager pageHeight={weekPageHeight} {...props} />
            )}
            renderMonthPager={(props) => (
              <MonthPager pageHeight={monthPageHeight} {...props} />
            )}
          />
        </CalendarContainer>
      </MonthPagesProvider>
    </WeekPagesProvider>
  );
};

export type WMCalendarProps = WMCalendarCoreProps &
  BaseCalendarProps &
  RefAttributes<CalendarMethods>;

const WMCalendar = baseProviders(forwardRef(WMCalendarCore));

WMCalendar.displayName = 'WMCalendar';

export default WMCalendar;
