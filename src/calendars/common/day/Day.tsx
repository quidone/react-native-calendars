import React, {isValidElement} from 'react';
import type dayjs from 'dayjs';
import {useCustomRenders} from '../providers/CustomRendersProvider';
import DayView from './DayView';
import DayViewEmpty from './DayView.Empty';
import {useIsDayToday} from '../providers/TodayProvider';
import {useMarkedData} from '../providers/MarkedDaysProvider';
import {
  useDayInRange,
  useIsSelectedDay,
  useOnDayPress,
} from '../providers/DayProvider';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import DotsContext from '../dot/DotsContext';
import {EMPTY_ARRAY} from 'default-values';

type DayProps = {
  day: dayjs.Dayjs;
  isSecondary?: boolean;
};

const Day = ({day, isSecondary = false}: DayProps) => {
  const {renderDay} = useCustomRenders();
  const markedData = useMarkedData(day);
  const isSelected = useIsSelectedDay(day) || Boolean(markedData?.selected);
  const isDisabled = !useDayInRange(day) || Boolean(markedData?.disabled);
  const isToday = useIsDayToday(day);
  const onDayPress = useOnDayPress();
  const onPress = useStableCallback(() => onDayPress({day}));

  const renderContent = () => {
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
        isSelected={isSelected}
        isDisabled={isDisabled}
        isToday={isToday}
        isSecondary={isSecondary}
        onPress={onPress}
      />
    );
  };

  return (
    <DotsContext.Provider value={markedData?.dots ?? EMPTY_ARRAY}>
      {renderContent()}
    </DotsContext.Provider>
  );
};

export default Day;
