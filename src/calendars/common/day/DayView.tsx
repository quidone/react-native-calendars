import React, {memo, ReactNode} from 'react';
import {
  Platform,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';
import {TouchableWithoutFeedback as GHTouchableWithoutFeedback} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {useStyles} from '../providers/StylesProvider';
import LazyAnimatedStylesController from './LazyAnimatedStylesController';
import type {DotData} from '../providers/MarkedDaysProvider';
import DotsRow from '../dot/DotsRow';

const TouchableWithoutFeedback = Platform.select({
  // Days are not selected if we use RNTouchableWithoutFeedback on android
  // @ts-ignore
  android: GHTouchableWithoutFeedback as RNTouchableWithoutFeedback,
  // Days are not selected if we use GHTouchableWithoutFeedback on ios
  ios: RNTouchableWithoutFeedback,
  default: RNTouchableWithoutFeedback,
});

export type DayViewProps = {
  isSelected?: boolean;
  isDisabled?: boolean;
  isToday?: boolean;
  isSecondary?: boolean;
  day: number | string;
  dots: ReadonlyArray<DotData> | null;
  onPress?: () => void;
};

const DayView = ({
  day,
  dots,
  isSelected = false,
  isDisabled = false,
  isToday = false,
  isSecondary = false,
  onPress,
}: DayViewProps) => {
  const {base, prop} = useStyles();

  const dayContainerPropStyle =
    typeof prop.dayContainerStyle === 'function'
      ? prop.dayContainerStyle({
          isToday,
          isDisabled,
          isSelected,
          isSecondary,
        })
      : prop.dayContainerStyle;
  const dayTextPropStyle =
    typeof prop.dayTextStyle === 'function'
      ? prop.dayTextStyle({
          isToday,
          isDisabled,
          isSelected,
          isSecondary,
        })
      : prop.dayTextStyle;

  const renderTouchableContainer = (child: ReactNode) => {
    return !isDisabled ? (
      <TouchableWithoutFeedback onPress={onPress}>
        {child as any}
      </TouchableWithoutFeedback>
    ) : (
      child
    );
  };

  return (
    <LazyAnimatedStylesController isSelected={isSelected}>
      {({dayContainerStyle, textColorStyle}) => {
        return renderTouchableContainer(
          <Animated.View
            style={[
              base.dayContainerStyle,
              isToday ? base.dayTodayContainerStyle : undefined,
              isSecondary ? base.daySecondaryContainerStyle : undefined,
              dayContainerStyle,
              dayContainerPropStyle,
            ]}>
            <Animated.Text
              style={[base.dayTitleStyle, textColorStyle, dayTextPropStyle]}>
              {day}
            </Animated.Text>
            {dots !== null && (
              <DotsRow isDaySelected={isSelected} dots={dots} />
            )}
          </Animated.View>,
        );
      }}
    </LazyAnimatedStylesController>
  );
};

export default memo(DayView);
