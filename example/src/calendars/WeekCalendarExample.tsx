import React, {memo} from 'react';
import {WeekCalendar} from '@quidone/react-native-calendars';

type WeekCalendarExampleProps = {
  width: number;
};

const WeekCalendarExample = ({width}: WeekCalendarExampleProps) => {
  return <WeekCalendar calendarWidth={width} />;
};

export default memo(WeekCalendarExample);
