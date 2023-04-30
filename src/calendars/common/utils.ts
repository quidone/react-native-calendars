import type {AnimConfig, GetPageHeight, MonthPageIndex} from './types';
import type dayjs from 'dayjs';
import {
  AnimationCallback,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const getMonthPageIndexByDay = (day: dayjs.Dayjs): MonthPageIndex => {
  return {
    year: day.year(),
    month: day.month(),
  };
};

export const WEEK_LENGTH = 7;

export const getDefaultPageHeight: GetPageHeight = ({theme, rowCount}) => {
  return (
    theme.pagePaddingTop +
    theme.pagePaddingBottom +
    rowCount * theme.dayContainerSize +
    (rowCount - 1) * theme.pageBetweenRows
  );
};

export const getMonthRowCount = (day: dayjs.Dayjs) => {
  const weekCount = day
    .endOf('month')
    .diff(day.startOf('month').startOf('week'), 'week', true);
  return Math.ceil(weekCount);
};

export const withAnim = <T extends number>(
  value: T,
  anim: AnimConfig,
  callback?: AnimationCallback,
) => {
  'worklet';
  if (anim.type === 'timing') {
    return withTiming(value, anim.option, callback);
  } else {
    return withSpring(value, anim.option, callback);
  }
};

export const isFastSwipeUp = (velocity: number) => {
  'worklet';
  return velocity < -1500;
};

export const isFastSwipeDown = (velocity: number) => {
  'worklet';
  return velocity > 1500;
};
