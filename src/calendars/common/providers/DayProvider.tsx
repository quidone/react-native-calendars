import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
} from 'react';
import dayjs from 'dayjs';
import {createRequiredContextValueHook} from '@utils/react-hooks';
import {
  useMemoArray,
  useStableCallback,
  useStateRef,
} from '@rozhkov/react-useful-hooks';
import {Day, fDay, FDay, setNoon} from '@utils/day';

export type OnDayChanged = (event: {day: FDay}) => void;
export type OnDayPress = (event: {day: FDay; selectedDay: FDay | null}) => void;

type DayRangeContextValue = {
  dayMin: dayjs.Dayjs | null;
  dayMax: dayjs.Dayjs | null;
};
const DayRangeContext = createContext<DayRangeContextValue | undefined>(
  undefined,
);

type DayStateContextValue = [dayjs.Dayjs | null, (day: dayjs.Dayjs) => void];
const DayStateContext = createContext<DayStateContextValue | undefined>(
  undefined,
);

type OnDayPressContextValue = (event: {
  day: dayjs.Dayjs;
  isDisabled: boolean;
}) => void;
const OnDayPressContext = createContext<OnDayPressContextValue | undefined>(
  undefined,
);

type DayProviderProps = PropsWithChildren<{
  dayMin: FDay | string | undefined;
  dayMax: FDay | string | undefined;
  day: Day | null | undefined;
  onDayChanged: OnDayChanged | undefined;
  onDayPress: OnDayPress | undefined;
}>;

const DayProvider = ({
  dayMin,
  dayMax,
  day: selectedDayProp,
  onDayChanged: onDayChangedProp,
  onDayPress: onDayPressProp,
  children,
}: DayProviderProps) => {
  const isDayPropSet = selectedDayProp !== undefined;
  const selectedDayPropObj = useMemo(
    () =>
      selectedDayProp != null ? setNoon(dayjs.utc(selectedDayProp)) : null,
    [selectedDayProp],
  );
  const [selectedDay, setDayState, selectedDayRef] =
    useStateRef<dayjs.Dayjs | null>(() =>
      selectedDayProp != null ? setNoon(dayjs.utc(selectedDayProp)) : null,
    );

  const changeDay = useStableCallback((day: dayjs.Dayjs) => {
    const selDay = isDayPropSet ? selectedDayPropObj : selectedDayRef.current;
    if (!day.isSame(selDay, 'date')) {
      if (isDayPropSet) {
        setDayState(day);
      }
      onDayChangedProp?.({day: fDay(day)});
    }
  });

  // sync internal state with selectedDay from props
  useEffect(() => {
    if (isDayPropSet) {
      return;
    }
    const selDay = selectedDayRef.current;
    if (selectedDayProp == null && selDay != null) {
      setDayState(null);
    } else if (selectedDayProp != null) {
      const dayProp = dayjs.utc(selectedDayProp);
      if (!dayProp.isSame(selDay, 'date')) {
        setDayState(setNoon(dayProp));
      }
    }
  }, [isDayPropSet, selectedDayProp]); // eslint-disable-line react-hooks/exhaustive-deps

  const stateResult = useMemoArray<DayStateContextValue>([
    isDayPropSet ? selectedDayPropObj : selectedDay,
    changeDay,
  ]);
  const rangeResult = useMemo<DayRangeContextValue>(() => {
    return {
      dayMin: dayMin !== undefined ? dayjs.utc(dayMin).startOf('day') : null,
      dayMax: dayMax !== undefined ? dayjs.utc(dayMax).endOf('day') : null,
    };
  }, [dayMax, dayMin]);
  const onDayPressResult = useStableCallback<OnDayPressContextValue>(
    ({day, isDisabled}) => {
      if (onDayPressProp !== undefined) {
        const selDay = selectedDayRef.current;
        onDayPressProp({
          day: fDay(day),
          selectedDay: selDay != null ? fDay(selDay) : null,
        });
      }
      if (!isDisabled) {
        changeDay(day);
      }
    },
  );

  return (
    <DayRangeContext.Provider value={rangeResult}>
      <DayStateContext.Provider value={stateResult}>
        <OnDayPressContext.Provider value={onDayPressResult}>
          {children}
        </OnDayPressContext.Provider>
      </DayStateContext.Provider>
    </DayRangeContext.Provider>
  );
};

export default DayProvider;

export const useDayRange = createRequiredContextValueHook(
  DayRangeContext,
  'useDayRange',
  'DayProvider',
);

export const useDayState = createRequiredContextValueHook(
  DayStateContext,
  'useDayState',
  'DayProvider',
);
export const useOnDayPress = createRequiredContextValueHook(
  OnDayPressContext,
  'useOnDayPress',
  'DayProvider',
);

export const useDayInRange = (day: dayjs.Dayjs): boolean => {
  const {dayMin, dayMax} = useDayRange();
  return useMemo(() => {
    return (
      (dayMin === null || day.isSameOrAfter(dayMin, 'date')) &&
      (dayMax === null || day.isSameOrBefore(dayMax, 'date'))
    );
  }, [day, dayMax, dayMin]);
};

export const useIsSelectedDay = (day: dayjs.Dayjs): boolean => {
  const [selectedDay] = useDayState();
  return useMemo(() => day.isSame(selectedDay, 'date'), [day, selectedDay]);
};
