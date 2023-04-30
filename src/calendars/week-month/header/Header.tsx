import React, {memo, useMemo} from 'react';
import {
  getYearAndMonthByWeekPageIndex,
  HeaderMonthRow,
  HeaderWeekDaysRow,
  OnMonthChanged,
  OnMonthInitialized,
  useDayState,
  useLocaledDayjs,
  useMonthEventsEffect,
} from '@calendars/common';
import {useMonthPageIndexState} from '@calendars/month';
import {useWeekPageIndexState} from '@calendars/week';
import type {CalendarType} from '../types';

type HeaderProps = {
  calendarType: CalendarType;
  visibleMonthHeader: boolean;
  visibleWeekDaysHeader: boolean;
  onMonthInitialized: OnMonthInitialized | undefined;
  onMonthChanged: OnMonthChanged | undefined;
};

const Header = ({
  calendarType,
  visibleMonthHeader,
  visibleWeekDaysHeader,
  onMonthInitialized,
  onMonthChanged,
}: HeaderProps) => {
  const ldayjs = useLocaledDayjs();
  const [weekPageIndex] = useWeekPageIndexState();
  const [monthPageIndex] = useMonthPageIndexState();
  const [selectedDay] = useDayState();

  const {year, month} = useMemo(() => {
    if (calendarType === 'week') {
      const {year: pageIndexYear, dayOfYear} = weekPageIndex;
      const pageDay = ldayjs().year(pageIndexYear).dayOfYear(dayOfYear);
      return getYearAndMonthByWeekPageIndex(pageDay, selectedDay);
    } else if (calendarType === 'month') {
      return monthPageIndex;
    } else {
      throw new Error('No implementation');
    }
  }, [calendarType, ldayjs, monthPageIndex, selectedDay, weekPageIndex]);

  useMonthEventsEffect(year, month, onMonthInitialized, onMonthChanged);

  return (
    <>
      {visibleMonthHeader && <HeaderMonthRow year={year} month={month} />}
      {visibleWeekDaysHeader && <HeaderWeekDaysRow />}
    </>
  );
};

export default memo(Header);
