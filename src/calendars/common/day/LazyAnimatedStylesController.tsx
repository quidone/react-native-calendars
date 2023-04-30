import React, {ReactNode, useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useStyles} from '../providers/StylesProvider';
import type {TextStyle, ViewStyle} from 'react-native';

type AnimatedStylesControllerProps = {
  isSelected: boolean;
  children: (data: {
    dayContainerStyle: Animated.AnimateStyle<ViewStyle>;
    textColorStyle: Animated.AnimateStyle<TextStyle>;
  }) => ReactNode;
};

const AnimatedStylesController = ({
  isSelected,
  children,
}: AnimatedStylesControllerProps) => {
  const {base} = useStyles();
  // TODO [translate] сначала нам необходимо инициализировать стили без выделения, после этого запустить анимацию при выделении.
  const isSelectedSv = useSharedValue(false);
  const dayContainerStyle = useAnimatedStyle(() => {
    return base.dayContainerAnimatedStyle(isSelectedSv.value);
  });
  const textColorStyle = useAnimatedStyle(() => {
    return base.dayTitleAnimatedStyle(isSelectedSv.value);
  });
  isSelectedSv.value = isSelected;

  return <>{children({dayContainerStyle, textColorStyle})}</>;
};

type EmptyStylesControllerProps = {
  children: (data: {
    dayContainerStyle?: undefined;
    textColorStyle?: undefined;
  }) => ReactNode;
};

const EmptyStylesController = ({children}: EmptyStylesControllerProps) => {
  return <>{children({})}</>;
};

type LazyAnimatedStylesControllerProps = AnimatedStylesControllerProps &
  EmptyStylesControllerProps;

// TODO [translate] Этот контроллер позволяет не инициализировать сразу анимированные стили, что позволяет ускорить рендеринг.
const LazyAnimatedStylesController = ({
  isSelected,
  children,
}: LazyAnimatedStylesControllerProps) => {
  const needLoad = isSelected;
  const isTrueOnceRef = useRef(needLoad);
  if (needLoad) {
    isTrueOnceRef.current = true;
  }
  const Controller = isTrueOnceRef.current
    ? AnimatedStylesController
    : EmptyStylesController;

  return <Controller isSelected={isSelected} children={children} />;
};

export default LazyAnimatedStylesController;
