import React, {memo} from 'react';
import {MonthCalendar} from '@quidone/react-native-calendars';

type MonthCalendarExampleProps = {
  width: number;
};

const MonthCalendarExample = ({width}: MonthCalendarExampleProps) => {
  return <MonthCalendar calendarWidth={width} />;
};

export default memo(MonthCalendarExample);
