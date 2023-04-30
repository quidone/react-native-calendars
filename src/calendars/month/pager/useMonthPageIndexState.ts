import {
  MonthPageIndex,
  OnChangePageIndex,
  useDayState,
} from '@calendars/common';
import {useCallback, useEffect} from 'react';
import {useLocaledDayjs} from '@calendars/common';
import {
  useInit,
  useIsFirstRender,
  useStableCallback,
  useStateRef,
} from '@rozhkov/react-useful-hooks';

const useMonthPageIndexState = (
  initPageIndexProp: MonthPageIndex | string | undefined,
  onChangePageProp: OnChangePageIndex<MonthPageIndex> | undefined,
) => {
  const ldayjs = useLocaledDayjs();
  const [selectedDay] = useDayState();
  const isFirstRender = useIsFirstRender();

  const [pageIndex, setPageIndex, pageIndexRef] = useStateRef<MonthPageIndex>(
    useInit<MonthPageIndex>(() => {
      if (initPageIndexProp !== undefined) {
        if (typeof initPageIndexProp === 'string') {
          const day = ldayjs(initPageIndexProp).startOf('month').utc(true);
          return {
            year: day.year(),
            month: day.month(),
          };
        }
        return initPageIndexProp;
      } else if (selectedDay !== null) {
        const day = selectedDay.startOf('month').utc(true);
        return {
          year: day.year(),
          month: day.month(),
        };
      } else {
        const today = ldayjs().startOf('month').utc(true);
        return {
          year: today.year(),
          month: today.month(),
        };
      }
    }),
  );

  const onChangePage = useStableCallback(onChangePageProp);
  const changePageIndex = useCallback(
    (index: MonthPageIndex) => {
      const curIndex = pageIndexRef.current;
      if (curIndex.month !== index.month || curIndex.year !== index.year) {
        onChangePage?.({value: index});
        setPageIndex(index);
      }
    },
    [onChangePage, pageIndexRef, setPageIndex],
  );

  useEffect(() => {
    if (isFirstRender || selectedDay === null) {
      return;
    }
    changePageIndex({
      year: selectedDay.year(),
      month: selectedDay.month(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  return [pageIndex, changePageIndex] as [
    typeof pageIndex,
    typeof changePageIndex,
  ];
};

export default useMonthPageIndexState;
