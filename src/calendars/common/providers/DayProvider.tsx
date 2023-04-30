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
export type OnChangeDay = (event: {value: FDay}) => void;

type DayProviderProps = PropsWithChildren<{
  dayMin: FDay | string | undefined;
  dayMax: FDay | string | undefined;
  day: Day | null | undefined;
  onChangeDay: OnChangeDay | undefined;
}>;

const DayProvider = ({
  dayMin,
  dayMax,
  day: selectedDayProp,
  onChangeDay: onChangeDayProp,
  children,
}: DayProviderProps) => {
  const [selectedDay, setDayState, selectedDayRef] =
    useStateRef<dayjs.Dayjs | null>(
      selectedDayProp !== undefined
        ? setNoon(dayjs.utc(selectedDayProp))
        : null,
    );

  const onChangeDay = useStableCallback(onChangeDayProp);
  const changeDay = useCallback(
    (day: dayjs.Dayjs) => {
      if (selectedDayRef.current !== day) {
        setDayState(day);
        onChangeDay?.({value: fDay(day)});
      }
    },
    [onChangeDay, selectedDayRef, setDayState],
  );

  // sync with selectedDayProps
  useEffect(() => {
    if (selectedDayProp !== undefined) {
      const dayProp = setNoon(dayjs.utc(selectedDayProp));
      if (!dayProp.isSame(selectedDayRef.current, 'date')) {
        setDayState(dayProp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayProp]);

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

  return (
    <DayRangeContext.Provider value={rangeResult}>
      <DayStateContext.Provider value={stateResult}>
        {children}
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
