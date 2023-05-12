import React, {
  ForwardedRef,
  forwardRef,
  memo,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import Animated, {
  AnimationCallback,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import useSyncWeekMonthPageIndexEffect from '../hooks/useSyncWeekMonthPageIndexEffect';
import useMonthPagerOffsetY, {
  GetMonthPagerOffsetY,
} from '../hooks/useMonthPagerOffsetY';
import useWMCalendarRef from '../hooks/useWMCalendarRef';
import {AnimConfig, withAnim} from '@utils/react-native-reanimated';
import type {CalendarMethods} from '@calendars/common';
import type {WeekPagerProps} from '@calendars/week';
import type {MonthPagerProps} from '@calendars/month';
import type {CalendarType} from '../types';
import {
  isFastSwipeDown,
  isFastSwipeUp,
} from '@utils/react-native-gesture-handler';

const syncWithAnim = {animated: true};
const syncWithoutAnim = {animated: false};

const defaultProgressAnimConfig: AnimConfig = {
  type: 'spring',
  option: {
    damping: 20,
    mass: 0.2,
    stiffness: 200,
    overshootClamping: false,
    restSpeedThreshold: 0.2,
    restDisplacementThreshold: 0.02,
  },
};

export type RenderMonthPager = (
  props: {
    ref: RefObject<CalendarMethods>;
  } & Pick<
    MonthPagerProps,
    | 'style'
    | 'pointerEvents'
    | 'onHeightChanged'
    | 'syncIndexIfChanged'
    | 'translateY'
    | 'opacity'
  >,
) => ReactNode;
export type RenderWeekPager = (
  props: {
    ref: RefObject<CalendarMethods>;
  } & Pick<
    WeekPagerProps,
    | 'style'
    | 'pointerEvents'
    | 'onHeightChanged'
    | 'syncIndexIfChanged'
    | 'translateY'
    | 'opacity'
  >,
) => ReactNode;

type PagesControllerProps = {
  type: CalendarType;
  onChangedType: (type: CalendarType) => void;
  switchingAnimConfig: AnimConfig | undefined;
  enableSwitchingByGesture: boolean | undefined;
  getMonthPagerOffsetY: GetMonthPagerOffsetY | undefined;
  renderMonthPager: RenderMonthPager;
  renderWeekPager: renderWeekPager;
};

const PagersController = (
  {
    type,
    onChangedType,
    getMonthPagerOffsetY,
    switchingAnimConfig = defaultProgressAnimConfig,
    enableSwitchingByGesture = true,
    renderWeekPager,
    renderMonthPager,
  }: PagesControllerProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  const weekPagerRef = useRef<CalendarMethods>(null);
  const monthPagerRef = useRef<CalendarMethods>(null);

  const isWeekType = type === 'week';
  const isMonthType = type === 'month';
  // week => 0; month => 1;
  const typeProgressSv = useSharedValue(isWeekType ? 0 : 1);
  const weekPagerHeightSv = useSharedValue(-1);
  const monthPagerHeightSv = useSharedValue(-1);
  const monthPagerOffsetY = useMonthPagerOffsetY(getMonthPagerOffsetY);
  const weekPagerOffsetY = -monthPagerOffsetY;

  const animateProgress = useCallback(
    (value: 0 | 1, callback?: AnimationCallback) => {
      'worklet';
      typeProgressSv.value = withAnim(value, switchingAnimConfig, callback);
    },
    [switchingAnimConfig, typeProgressSv],
  );

  const setTypeProgressEnd = useCallback(
    (calendarType: CalendarType | undefined = undefined) => {
      'worklet';
      const animate = (tp: CalendarType) => {
        animateProgress(tp === 'week' ? 0 : 1, (finished) => {
          if (finished) {
            runOnJS(onChangedType)(tp);
          }
        });
      };
      if (calendarType === undefined) {
        const progress = typeProgressSv.value;
        animate(progress < 0.5 ? 'week' : 'month');
      } else {
        animate(calendarType);
      }
    },
    [animateProgress, onChangedType, typeProgressSv],
  );

  useWMCalendarRef(forwardedRef, {
    type,
    weekPagerRef,
    monthPagerRef,
    typeProgressSv,
    setTypeProgressEnd,
    monthPagerHeightSv,
    weekPagerHeightSv,
  });

  const containerStyle = useAnimatedStyle(() => {
    const weekPagerHeight = weekPagerHeightSv.value;
    const monthPagerHeight = monthPagerHeightSv.value;
    if (weekPagerHeight === -1 || monthPagerHeight === -1) {
      return {height: undefined};
    }
    const progress = typeProgressSv.value;
    return {
      height: interpolate(
        progress,
        [0, 1],
        [weekPagerHeight, monthPagerHeight],
      ),
    };
  });

  // If to pass animated styles to components, then styles are not always used in initialization.
  const weekTranslateYSv = useDerivedValue(() =>
    interpolate(typeProgressSv.value, [0, 1], [0, weekPagerOffsetY]),
  );
  const weekOpacitySv = useDerivedValue(() =>
    interpolate(typeProgressSv.value, [0.8, 1], [1, 0], 'clamp'),
  );
  const monthTranslateYSv = useDerivedValue(() =>
    interpolate(typeProgressSv.value, [0, 1], [monthPagerOffsetY, 0]),
  );
  const monthOpacitySv = useDerivedValue(() =>
    interpolate(typeProgressSv.value, [0, 1], [0, 1], 'clamp'),
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enableSwitchingByGesture)
        .failOffsetX([-5, 5])
        .activeOffsetY([-5, 5])
        .onChange(({translationY}) => {
          const weekPagerHeight = weekPagerHeightSv.value;
          const monthPagerHeight = monthPagerHeightSv.value;
          const inputs = isWeekType
            ? [0, monthPagerHeight - weekPagerHeight]
            : [0, weekPagerHeight - monthPagerHeight];
          const outputs = isWeekType ? [0, 1] : [1, 0];
          typeProgressSv.value = interpolate(
            translationY,
            inputs,
            outputs,
            'clamp',
          );
        })
        .onEnd(({velocityY}) => {
          'worklet';
          if (isWeekType && isFastSwipeDown(velocityY)) {
            setTypeProgressEnd('month');
          } else if (isMonthType && isFastSwipeUp(velocityY)) {
            setTypeProgressEnd('week');
          } else {
            setTypeProgressEnd();
          }
        }),
    [
      enableSwitchingByGesture,
      weekPagerHeightSv,
      monthPagerHeightSv,
      isWeekType,
      typeProgressSv,
      isMonthType,
      setTypeProgressEnd,
    ],
  );

  useEffect(() => {
    if (isWeekType && typeProgressSv.value !== 0) {
      animateProgress(0);
    } else if (isMonthType && typeProgressSv.value !== 1) {
      animateProgress(1);
    }
  }, [
    animateProgress,
    isMonthType,
    isWeekType,
    switchingAnimConfig,
    typeProgressSv,
  ]);

  useSyncWeekMonthPageIndexEffect(type);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.root, containerStyle]}>
        {renderWeekPager({
          ref: weekPagerRef,
          pointerEvents: isWeekType ? 'auto' : 'none',
          onHeightChanged: weekPagerHeightSv,
          syncIndexIfChanged: isWeekType ? syncWithAnim : syncWithoutAnim,
          translateY: weekTranslateYSv,
          opacity: weekOpacitySv,
        })}
        {renderMonthPager({
          ref: monthPagerRef,
          style: styles.absolute,
          pointerEvents: isMonthType ? 'auto' : 'none',
          onHeightChanged: monthPagerHeightSv,
          syncIndexIfChanged: isMonthType ? syncWithAnim : syncWithoutAnim,
          translateY: monthTranslateYSv,
          opacity: monthOpacitySv,
        })}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  absolute: {
    position: 'absolute',
  },
  opacity0: {
    opacity: 0,
  },
});

export default memo(forwardRef(PagersController));
