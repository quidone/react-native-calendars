import React, {
  createContext,
  PropsWithChildren,
  useCallback,
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
  const [selectedDay, setDayState, selectedDayRef] =
    useStateRef<dayjs.Dayjs | null>(() =>
      selectedDayProp != null ? setNoon(dayjs.utc(selectedDayProp)) : null,
    );

  const onDayChanged = useStableCallback(onDayChangedProp);
  const changeDay = useCallback(
    (day: dayjs.Dayjs) => {
      if (selectedDayRef.current !== day) {
        setDayState(day);
        onDayChanged?.({day: fDay(day)});
      }
    },
    [onDayChanged, selectedDayRef, setDayState],
  );

  // sync with selectedDayProps
  useEffect(() => {
    if (selectedDayProp != null) {
      const dayProp = setNoon(dayjs.utc(selectedDayProp));
      if (!dayProp.isSame(selectedDayRef.current, 'date')) {
        setDayState(dayProp);
      }
    }
  }, [selectedDayProp]); // eslint-disable-line react-hooks/exhaustive-deps

  const stateResult = useMemoArray<DayStateContextValue>([
    selectedDay,
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
        onDayPressProp({
          day: fDay(day),
          selectedDay: selectedDay != null ? fDay(selectedDay) : null,
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
