import React, {memo} from 'react';
import {
  HeaderMonthRow,
  HeaderWeekDaysRow,
  OnMonthChanged,
  OnMonthInitialized,
  useDayState,
  useLocaledDayjs,
  useMonthEventsEffect,
  getYearAndMonthByWeekPageIndex,
} from '@calendars/common';
import {useWeekPageIndexState} from '../pager/WeekPagesProvider';

type HeaderProps = {
  visibleMonthHeader: boolean;
  visibleWeekDaysHeader: boolean;
  onMonthInitialized: OnMonthInitialized | undefined;
  onMonthChanged: OnMonthChanged | undefined;
};

const Header = ({
  visibleMonthHeader,
  visibleWeekDaysHeader,
  onMonthInitialized,
  onMonthChanged,
}: HeaderProps) => {
  const ldayjs = useLocaledDayjs();
  const [pageIndex] = useWeekPageIndexState();
  const [selectedDay] = useDayState();
  const {year: pageIndexYear, dayOfYear} = pageIndex;
  const pageDay = ldayjs().year(pageIndexYear).dayOfYear(dayOfYear);
  const {year, month} = getYearAndMonthByWeekPageIndex(pageDay, selectedDay);

  useMonthEventsEffect(year, month, onMonthInitialized, onMonthChanged);

  return (
    <>
      {visibleMonthHeader && <HeaderMonthRow year={year} month={month} />}
      {visibleWeekDaysHeader && <HeaderWeekDaysRow />}
    </>
  );
};

export default memo(Header);
