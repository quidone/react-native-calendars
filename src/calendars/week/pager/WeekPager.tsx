import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
} from 'react';
import useWeekArrayIndex from './usePageIndexNumber';
import WeekPageView from './WeekPage';
import {
  useCalendarWidth,
  CalendarMethods,
  GetPageHeight,
  useLocaledDayjs,
  WeekPageIndex,
  useRenderedPageData,
  useAnimatedPagerHeight,
  SyncIndexConfig,
  FlatListPager,
} from '@calendars/common';
import {getPageIndexNumber, getWeekPageIndexByDay} from '../utils/page-index';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type {FlatList, StyleProp, ViewStyle} from 'react-native';
import {
  useWeekPageIndexes,
  useWeekPageIndexProgress,
  useWeekPageIndexState,
} from './WeekPagesProvider';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {useAnimatedListener} from '@utils/react-native-reanimated';

export type WeekPagerProps = {
  pageHeight: number | GetPageHeight | undefined;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  onHeightChanged?: SharedValue<number>;
  syncIndexIfChanged?: Partial<SyncIndexConfig>;
  translateY?: SharedValue<number>;
  opacity?: SharedValue<number>;
};

const WeekPager = (
  {
    pageHeight,
    style: styleProp,
    pointerEvents,
    onHeightChanged,
    syncIndexIfChanged,
    translateY,
    opacity,
  }: WeekPagerProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  const ldayjs = useLocaledDayjs();
  const indexes = useWeekPageIndexes();
  const pagerRef = useAnimatedRef<FlatList<WeekPageIndex>>();
  const curIndex = useWeekArrayIndex();
  const calendarWidth = useCalendarWidth();
  const [, changePageIndex] = useWeekPageIndexState();
  const changeIndex = useStableCallback((index: number) => {
    changePageIndex(indexes[index]);
  });

  const indexProgressSv = useWeekPageIndexProgress();
  const pages = useRenderedPageData('week');
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
      const targetIndex = getPageIndexNumber(
        indexes,
        getWeekPageIndexByDay(ldayjs()),
      );
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
    <FlatListPager<WeekPageIndex>
      // @ts-ignore
      ref={pagerRef}
      style={[styleProp, style]}
      data={indexes}
      index={curIndex}
      onChangeIndex={changeIndex}
      syncIndexIfChanged={syncIndexIfChanged}
      horizontal={true}
      pageLength={calendarWidth}
      pointerEvents={pointerEvents}
      renderPage={({item, index}) => (
        <WeekPageView
          pageIndex={item}
          arrayIndex={index}
          pageHeight={pageHeight}
        />
      )}
    />
  );
};

export default memo(forwardRef(WeekPager));
