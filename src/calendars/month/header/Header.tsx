import {
  HeaderMonthRow,
  HeaderWeekDaysRow,
  OnMonthChanged,
  OnMonthInitialized,
} from '@calendars/common';
import React, {memo} from 'react';
import {useMonthPageIndexState} from '../pager/MonthPagesProvider';
import {useMonthEventsEffect} from '@calendars/common';

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
  const [{year, month}] = useMonthPageIndexState();

  useMonthEventsEffect(year, month, onMonthInitialized, onMonthChanged);

  return (
    <>
      {visibleMonthHeader && <HeaderMonthRow year={year} month={month} />}
      {visibleWeekDaysHeader && <HeaderWeekDaysRow />}
    </>
  );
};

export default memo(Header);
