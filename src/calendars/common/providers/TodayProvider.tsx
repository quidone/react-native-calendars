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

type TodayContextValue = dayjs.Dayjs;

const TodayContext = createContext<TodayContextValue | null>(null);

type TodayProviderProps = PropsWithChildren<{}>;

// TODO setNoon;
const TodayProvider = (props: TodayProviderProps) => {
  const {children} = props;
  const ldayjs = useLocaledDayjs();

  const [today, setToday, todayRef] = useStateRef<dayjs.Dayjs>(
    useInit(() => ldayjs().utc(true)),
  );

  useEffect(() => {
    const id = setInterval(() => {
      const prevToday = todayRef.current;
      const newToday = ldayjs().utc(true);
      if (!newToday.isSame(prevToday, 'date')) {
        setToday(newToday);
      }
    }, 5000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ldayjs]);

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
