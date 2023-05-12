import React, {memo} from 'react';
import {WMCalendar} from '@quidone/react-native-calendars';

type WMCalendarExampleProps = {
  width: number;
};

const WMCalendarExample = ({width}: WMCalendarExampleProps) => {
  return <WMCalendar calendarWidth={width} />;
};

export default memo(WMCalendarExample);
