import React, {isValidElement} from 'react';
import type dayjs from 'dayjs';
import {useCustomRenders} from '../providers/CustomRendersProvider';
import DayView from './DayView';
import DayViewEmpty from './DayView.Empty';
import {useIsDayToday} from '../providers/TodayProvider';
import {useMarkedData} from '../providers/MarkedDaysProvider';
import {
  useDayInRange,
  useDayState,
  useIsSelectedDay,
} from '../providers/DayProvider';
import {useStableCallback} from '@rozhkov/react-useful-hooks';

type DayProps = {
  day: dayjs.Dayjs;
  isSecondary?: boolean;
};

const Day = ({day, isSecondary = false}: DayProps) => {
  const {renderDay} = useCustomRenders();
  const isSelected = useIsSelectedDay(day);
  const isDisabled = !useDayInRange(day);
  const isToday = useIsDayToday(day);
  const [, changeDay] = useDayState();
  const markedData = useMarkedData(day);
  const onPress = useStableCallback(() => changeDay(day));

  if (renderDay != null) {
    const customDay = renderDay({
      day,
      onPress,
      isSecondary,
      isDisabled,
      isSelected,
      isToday,
    });

    return isValidElement(customDay) ? (
      customDay
    ) : (
      <DayViewEmpty
        isSelected={isSelected}
        isDisabled={isDisabled}
        isToday={isToday}
        isSecondary={isSecondary}
      />
    );
  }

  return (
    <DayView
      day={day.date()}
      dots={markedData?.dots ?? null}
      isSelected={isSelected}
      isDisabled={isDisabled}
      isToday={isToday}
      isSecondary={isSecondary}
      onPress={onPress}
    />
  );
};

export default Day;
