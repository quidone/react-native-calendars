import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
} from 'react';
import MonthPageView from './MonthPage';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type {FlatList, StyleProp, ViewStyle} from 'react-native';
import {
  useMonthPageIndexes,
  useMonthPageIndexProgress,
  useMonthPageIndexState,
} from './MonthPagesProvider';
import useMonthPageArrayIndex from './useMonthPageArrayIndex';
import {getMonthPageArrayIndex} from './utils';
import {
  CalendarMethods,
  FlatListPager,
  GetPageHeight,
  MonthPageIndex,
  SyncIndexConfig,
  useAnimatedPagerHeight,
  useCalendarWidth,
  useLocaledDayjs,
  useRenderedPageData,
} from '@calendars/common';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {useAnimatedListener} from '@utils/react-native-reanimated';

export type MonthPagerProps = {
  pageHeight: number | GetPageHeight | undefined;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  onHeightChanged?: SharedValue<number>;
  syncIndexIfChanged?: Partial<SyncIndexConfig>;
  translateY?: SharedValue<number>;
  opacity?: SharedValue<number>;
};

const MonthPager = (
  {
    pageHeight,
    style: styleProp,
    pointerEvents,
    onHeightChanged,
    syncIndexIfChanged,
    translateY,
    opacity,
  }: MonthPagerProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  const ldayjs = useLocaledDayjs();
  const indexes = useMonthPageIndexes();
  const pagerRef = useAnimatedRef<FlatList<MonthPageIndex>>();
  const curIndex = useMonthPageArrayIndex();
  const calendarWidth = useCalendarWidth();
  const [, changePageIndex] = useMonthPageIndexState();
  const changeIndex = useStableCallback((index: number) => {
    changePageIndex(indexes[index]);
  });

  const indexProgressSv = useMonthPageIndexProgress();
  const pages = useRenderedPageData('month');
  const pagerHeightSv = useAnimatedPagerHeight(indexProgressSv, pages);
  const style = useAnimatedStyle(() => {
    return {
      height: pagerHeightSv.value,
      transform: [{translateY: translateY?.value ?? 0}],
      opacity: opacity?.value ?? 1,
    };
  });

  useAnimatedListener(pagerHeightSv, onHeightChanged);
  useImperativeHandle(forwardedRef, () => ({
    scrollToToday: ({animated} = {}) => {
      if (pagerRef.current === null) {
        return;
      }
      const today = ldayjs();
      const targetIndex = getMonthPageArrayIndex(indexes, {
        year: today.year(),
        month: today.month(),
      });
      if (targetIndex < 0) {
        if (__DEV__) {
          console.warn("Today's page is not exists");
        }
        return;
      }
      pagerRef.current.scrollToIndex({index: targetIndex, animated});
    },
  }));

  return (
    <FlatListPager<MonthPageIndex>
      // @ts-ignore
      ref={pagerRef}
      data={indexes}
      style={[styleProp, style]}
      index={curIndex}
      indexProgressSv={indexProgressSv}
      onChangeIndex={changeIndex}
      syncIndexIfChanged={syncIndexIfChanged}
      horizontal={true}
      pageLength={calendarWidth}
      pointerEvents={pointerEvents}
      renderPage={({item, index}) => (
        <MonthPageView
          pageIndex={item}
          arrayIndex={index}
          pageHeight={pageHeight}
        />
      )}
    />
  );
};

export default memo(forwardRef(MonthPager));
