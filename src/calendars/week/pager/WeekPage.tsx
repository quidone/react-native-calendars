import React, {memo, useMemo} from 'react';
import useWeekRowData from './useWeekRowData';
import {
  useCalendarWidth,
  useRenderedPageRegisterEffect,
  FIRST_DAY_OF_WEEK_INDEX,
  LAST_DAY_OF_WEEK_INDEX,
  getDefaultPageHeight,
  useTheme,
  PageView,
} from '@calendars/common';
import type {GetPageHeight, WeekPageIndex} from '@calendars/common';

const ROW_COUNT = 1;
const MAX_ROW_COUNT = 1;
const isSecondary = () => false;

type WeekPageProps = {
  pageIndex: WeekPageIndex;
  arrayIndex: number;
  pageHeight: number | GetPageHeight | undefined;
};

const WeekPage = ({
  pageIndex,
  arrayIndex,
  pageHeight = getDefaultPageHeight,
}: WeekPageProps) => {
  const days = useWeekRowData(pageIndex);
  const calendarWidth = useCalendarWidth();
  const theme = useTheme();
  const height =
    typeof pageHeight === 'number'
      ? pageHeight
      : pageHeight({
          theme,
          rowCount: ROW_COUNT,
          maxRowCount: MAX_ROW_COUNT,
        });

  useRenderedPageRegisterEffect(
    'week',
    arrayIndex,
    height,
    days[FIRST_DAY_OF_WEEK_INDEX],
    days[LAST_DAY_OF_WEEK_INDEX],
    ROW_COUNT,
  );

  const rows = useMemo(() => [days], [days]);

  return (
    <PageView
      rows={rows}
      width={calendarWidth}
      height={height}
      isSecondary={isSecondary}
    />
  );
};

export default memo(WeekPage);
