import React, {memo, ReactNode} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import Animated from 'react-native-reanimated';
import {useStyles} from '../providers/StylesProvider';
import LazyAnimatedStylesController from './LazyAnimatedStylesController';
import DotsRow from '../dot/DotsRow';

export type DayViewProps = {
  isSelected?: boolean;
  isDisabled?: boolean;
  isToday?: boolean;
  isSecondary?: boolean;
  day: number | string;
  onPress?: () => void;
};

const DayView = ({
  day,
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
              isSecondary ? base.daySecondaryContainerStyle : undefined,
              dayContainerStyle,
              dayContainerPropStyle,
            ]}>
            <Animated.Text
              style={[base.dayTitleStyle, textColorStyle, dayTextPropStyle]}>
              {day}
            </Animated.Text>
            <DotsRow isDaySelected={isSelected} />
          </Animated.View>,
        );
      }}
    </LazyAnimatedStylesController>
  );
};

export default memo(DayView);
