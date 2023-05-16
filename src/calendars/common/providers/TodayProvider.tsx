import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import type dayjs from 'dayjs';
import {useLocaledDayjs} from './LocaleProvider';
import {useInit, useStateRef} from '@rozhkov/react-useful-hooks';
import {setNoon} from '@utils/day';

type TodayContextValue = dayjs.Dayjs;

const TodayContext = createContext<TodayContextValue | null>(null);

type TodayProviderProps = PropsWithChildren<{}>;

const TodayProvider = (props: TodayProviderProps) => {
  const {children} = props;
  const ldayjs = useLocaledDayjs();

  const [today, setToday, todayRef] = useStateRef<dayjs.Dayjs>(
    useInit(() => setNoon(ldayjs().utc(true))),
  );

  useEffect(() => {
    const id = setInterval(() => {
      const prevToday = todayRef.current;
      const newToday = ldayjs().utc(true);
      if (!newToday.isSame(prevToday, 'date')) {
        setToday(setNoon(newToday));
      }
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [ldayjs]); // eslint-disable-line react-hooks/exhaustive-deps

  return <TodayContext.Provider value={today} children={children} />;
};

export default TodayProvider;

export const useToday = (): TodayContextValue => {
  const value = useContext(TodayContext);
  if (value == null) {
    throw new Error('useToday must be called from within TodayProvider!');
  }
  return value;
};

export const useIsDayToday = (day: dayjs.Dayjs): boolean => {
  const today = useToday();
  return useMemo(() => today.isSame(day.utc(true), 'date'), [day, today]);
};
