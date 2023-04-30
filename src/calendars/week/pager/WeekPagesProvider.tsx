import {
  OnChangePageIndex,
  WeekPageIndex,
  useLocaledDayjs,
} from '@calendars/common';
import {SharedValue, useSharedValue} from 'react-native-reanimated';
import React, {createContext, PropsWithChildren, useMemo} from 'react';
import type dayjs from 'dayjs';
import usePageIndexState from './useWeekPageIndexState';
import {
  createWeekIndexes,
  getWeekPageEndOrDefault,
  getWeekPageIndexNumber,
  getWeekPageStartOrDefault,
} from './utils';
import {
  useInit,
  useMemoArray,
  useMemoObject,
} from '@rozhkov/react-useful-hooks';
import {createRequiredContextValueHook} from '@utils/react-hooks';

export type WeekPagesInfoContextValue = {
  indexes: ReadonlyArray<WeekPageIndex>;
  indexProgress: SharedValue<number>;
};
export type WeekPageIndexStateContextValue = [
  WeekPageIndex,
  (index: WeekPageIndex) => void,
];

const WeekPagesInfoContext = createContext<
  WeekPagesInfoContextValue | undefined
>(undefined);
const WeekPageIndexStateContext = createContext<
  WeekPageIndexStateContextValue | undefined
>(undefined);

type WeekPagesProviderProps = PropsWithChildren<{
  pageStart: WeekPageIndex | dayjs.Dayjs | string | undefined;
  pageEnd: WeekPageIndex | dayjs.Dayjs | string | undefined;
  onChangePageIndex: OnChangePageIndex<WeekPageIndex> | undefined;
  initPageIndex: WeekPageIndex | string | undefined;
}>;

const WeekPagesProvider = ({
  pageStart: pageStartProp,
  pageEnd: pageEndProp,
  initPageIndex,
  onChangePageIndex,
  children,
}: WeekPagesProviderProps) => {
  const ldayjs = useLocaledDayjs();
  const [index, changeIndex] = usePageIndexState(
    initPageIndex,
    onChangePageIndex,
  );

  const pageStart = useMemo(
    () => getWeekPageStartOrDefault(pageStartProp, ldayjs),
    [ldayjs, pageStartProp],
  );
  const pageEnd = useMemo(
    () => getWeekPageEndOrDefault(pageEndProp, ldayjs),
    [ldayjs, pageEndProp],
  );

  const indexes = useMemo(() => {
    return createWeekIndexes(pageStart, pageEnd);
  }, [pageStart, pageEnd]);

  const indexProgress = useSharedValue(
    useInit(() => getWeekPageIndexNumber(indexes, index)),
  );

  const infoResult = useMemoObject<WeekPagesInfoContextValue>({
    indexes,
    indexProgress,
  });
  const stateResult = useMemoArray<WeekPageIndexStateContextValue>([
    index,
    changeIndex,
  ]);

  return (
    <WeekPagesInfoContext.Provider value={infoResult}>
      <WeekPageIndexStateContext.Provider value={stateResult}>
        {children}
      </WeekPageIndexStateContext.Provider>
    </WeekPagesInfoContext.Provider>
  );
};

export default WeekPagesProvider;

export const useWeekPagesInfo = createRequiredContextValueHook(
  WeekPagesInfoContext,
  'useWeekPagesInfoState',
  'WeekPagesProvider',
);
export const useWeekPageIndexState = createRequiredContextValueHook(
  WeekPageIndexStateContext,
  'useWeekPageIndexState',
  'WeekPagesProvider',
);
export const useWeekPageIndexes = () => useWeekPagesInfo().indexes;
export const useWeekPageIndexProgress = () => useWeekPagesInfo().indexProgress;
