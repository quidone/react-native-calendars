import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import Animated, {withSpring, withTiming} from 'react-native-reanimated';
import {useMemoObject} from '@rozhkov/react-useful-hooks';
import {
  AnimConfig,
  CalendarTheme,
  SpringAnimConfig,
  TimingAnimConfig,
  useTheme,
} from './ThemeProvider';

type CalendarBaseStaticStyles = {
  monthHeaderRowStyle: ViewStyle;
  monthHeaderTitleStyle: TextStyle;
  weekDaysContainerStyle: ViewStyle;
  weekDayContainerStyle: ViewStyle;
  weekDayTitleStyle: TextStyle;
  pageContainerStyle: ViewStyle;
  dayRowStyle: ViewStyle;
  dayContainerStyle: ViewStyle;
  dayTodayContainerStyle: ViewStyle;
  daySecondaryContainerStyle: ViewStyle;
  dayTitleStyle: TextStyle;
  dayDotsRowStyle: ViewStyle;
  dayDotStyle: ViewStyle;
};

const getThemePropValue = <ValueT extends string | number>(
  value: ValueT | AnimConfig<ValueT>,
) => {
  return typeof value === 'object' ? value.value : value;
};

const buildStaticStyles = ({
  calendarHorizontalPaddings,
  monthTitleFontSize,
  monthTitleColor,
  weekDayTitleColor,
  weekDayTitleFontSize,
  pagePaddingTop,
  pagePaddingBottom,
  dayContainerSize,
  dayFontSize,
  dayTodayBorderWidth,
  dayTodayBorderColor,
  dayColor,
  dayBgColor,
  dayDotSize,
}: CalendarTheme) => {
  return StyleSheet.create<CalendarBaseStaticStyles>({
    monthHeaderRowStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: calendarHorizontalPaddings,
    },
    monthHeaderTitleStyle: {
      color: monthTitleColor,
      fontSize: monthTitleFontSize,
    },
    weekDaysContainerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: calendarHorizontalPaddings,
    },
    weekDayContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      width: dayContainerSize,
    },
    weekDayTitleStyle: {
      color: weekDayTitleColor,
      fontSize: weekDayTitleFontSize,
    },
    pageContainerStyle: {
      paddingTop: pagePaddingTop,
      paddingBottom: pagePaddingBottom,
      justifyContent: 'space-between',
    },
    dayRowStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: calendarHorizontalPaddings,
    },
    dayContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      height: dayContainerSize,
      width: dayContainerSize,
      // initialize values
      backgroundColor: getThemePropValue(dayBgColor),
    },
    dayTodayContainerStyle: {
      borderWidth: dayTodayBorderWidth,
      borderColor: dayTodayBorderColor,
    },
    daySecondaryContainerStyle: {
      opacity: 0.4,
    },
    dayTitleStyle: {
      fontSize: dayFontSize,
      // initialize values
      color: getThemePropValue(dayColor),
    },
    dayDotsRowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      bottom: 3,
    },
    dayDotStyle: {
      width: dayDotSize,
      height: dayDotSize,
      borderRadius: dayDotSize,
      margin: 1,
    },
  });
};

type CalendarBaseAnimatedStyles = {
  dayContainerAnimatedStyle: (
    isSelected: boolean,
  ) => Animated.AnimateStyle<ViewStyle>;
  dayTitleAnimatedStyle: (
    isSelected: boolean,
  ) => Animated.AnimateStyle<ViewStyle>;
};

const isTimingConfig = <ValueT extends string | number>(
  prop: ValueT | AnimConfig<ValueT>,
): prop is TimingAnimConfig<ValueT> => {
  'worklet';
  return typeof prop === 'object' && prop.type === 'timing';
};
const isSpringConfig = <ValueT extends string | number>(
  prop: ValueT | AnimConfig<ValueT>,
): prop is SpringAnimConfig<ValueT> => {
  'worklet';
  return typeof prop === 'object' && prop.type === 'spring';
};
const getStaticOrTiming = <ValueT extends string | number>(
  prop: ValueT | TimingAnimConfig<ValueT>,
) => {
  'worklet';
  return isTimingConfig(prop) ? withTiming(prop.value, prop.option) : prop;
};
const getStaticOrSpring = <ValueT extends string | number>(
  prop: ValueT | SpringAnimConfig<ValueT>,
) => {
  'worklet';
  return isSpringConfig(prop) ? withSpring(prop.value, prop.option) : prop;
};
const getStaticOrAnimate = <ValueT extends string | number>(
  prop: ValueT | AnimConfig<ValueT>,
) => {
  'worklet';
  if (isTimingConfig(prop)) {
    return withTiming(prop.value, prop.option);
  } else if (isSpringConfig(prop)) {
    return withSpring(prop.value, prop.option);
  } else {
    return prop;
  }
};

const useCalendarBaseAnimatedStyles = ({
  dayBgColor,
  daySelectedBgColor,
  dayColor,
  daySelectedColor,
}: CalendarTheme): CalendarBaseAnimatedStyles => {
  const dayContainerAnimatedStyle = useMemo<
    (isSelected: boolean) => Animated.AnimateStyle<ViewStyle>
  >(() => {
    const hasTiming =
      isTimingConfig(dayBgColor) || isTimingConfig(daySelectedBgColor);
    const hasSpring =
      isSpringConfig(dayBgColor) || isSpringConfig(daySelectedBgColor);
    if (!hasTiming && !hasSpring) {
      return (isSelected) => {
        'worklet';
        return {
          backgroundColor: isSelected ? daySelectedBgColor : dayBgColor,
        };
      };
    } else if (hasTiming && !hasSpring) {
      return (isSelected) => {
        'worklet';
        return {
          backgroundColor: getStaticOrTiming(
            isSelected ? daySelectedBgColor : dayBgColor,
          ),
        };
      };
    } else if (!hasTiming && hasSpring) {
      return (isSelected) => {
        'worklet';
        return {
          backgroundColor: getStaticOrSpring(
            isSelected ? daySelectedBgColor : dayBgColor,
          ),
        };
      };
    } else {
      return (isSelected) => {
        'worklet';
        return {
          backgroundColor: getStaticOrAnimate(
            isSelected ? daySelectedBgColor : dayBgColor,
          ),
        };
      };
    }
  }, [dayBgColor, daySelectedBgColor]);

  const dayTitleAnimatedStyle = useMemo<
    (isSelected: boolean) => Animated.AnimateStyle<TextStyle>
  >(() => {
    const hasTiming =
      isTimingConfig(dayColor) || isTimingConfig(daySelectedColor);
    const hasSpring =
      isSpringConfig(dayColor) || isSpringConfig(daySelectedColor);
    if (!hasTiming && !hasSpring) {
      return (isSelected) => {
        'worklet';
        return {
          color: isSelected ? daySelectedColor : dayColor,
        };
      };
    } else if (hasTiming && !hasSpring) {
      return (isSelected) => {
        'worklet';
        return {
          color: getStaticOrTiming(isSelected ? daySelectedColor : dayColor),
        };
      };
    } else if (!hasTiming && hasSpring) {
      return (isSelected) => {
        'worklet';
        return {
          color: getStaticOrSpring(isSelected ? daySelectedColor : dayColor),
        };
      };
    } else {
      return (isSelected) => {
        'worklet';
        return {
          color: getStaticOrAnimate(isSelected ? daySelectedColor : dayColor),
        };
      };
    }
  }, [dayColor, daySelectedColor]);

  return useMemoObject<CalendarBaseAnimatedStyles>({
    dayContainerAnimatedStyle,
    dayTitleAnimatedStyle,
  });
};

type CalendarBaseStyles = CalendarBaseStaticStyles & CalendarBaseAnimatedStyles;
export type CalendarStyles = {
  calendarContainerStyle: StyleProp<ViewStyle> | undefined;
  monthHeaderRowStyle: StyleProp<ViewStyle> | undefined;
  monthHeaderTitleStyle: StyleProp<TextStyle> | undefined;
  weekDaysContainerStyle: StyleProp<ViewStyle> | undefined;
  weekDayContainerStyle: StyleProp<ViewStyle> | undefined;
  weekDayTitleStyle: StyleProp<TextStyle> | undefined;
  pageContainerStyle: StyleProp<ViewStyle> | undefined;
  dayRowStyle: StyleProp<ViewStyle>;
  dayContainerStyle:
    | StyleProp<ViewStyle>
    | ((info: {
        isSelected: boolean;
        isToday: boolean;
        isDisabled: boolean;
        isSecondary: boolean;
      }) => ViewStyle)
    | undefined;
  dayTextStyle:
    | StyleProp<TextStyle>
    | ((info: {
        isSelected: boolean;
        isToday: boolean;
        isDisabled: boolean;
        isSecondary: boolean;
      }) => TextStyle)
    | undefined;
  dayDotsRowStyle: StyleProp<ViewStyle> | undefined;
  dayDotStyle: StyleProp<ViewStyle> | undefined;
};

type StylesContextValue = {
  base: CalendarBaseStaticStyles & CalendarBaseAnimatedStyles;
  prop: CalendarStyles;
};

const StylesContext = createContext<StylesContextValue | null>(null);

type StylesProviderProps = PropsWithChildren<CalendarStyles>;

const StylesProvider = ({children, ...restProps}: StylesProviderProps) => {
  const theme = useTheme();
  const staticStyles = useMemo(() => buildStaticStyles(theme), [theme]);
  const animatedStyles = useCalendarBaseAnimatedStyles(theme);
  const baseStyles = useMemo<CalendarBaseStyles>(
    () => ({...staticStyles, ...animatedStyles}),
    [animatedStyles, staticStyles],
  );
  const propStyles = useMemoObject<CalendarStyles>(restProps);

  const result = useMemoObject<StylesContextValue>({
    base: baseStyles,
    prop: propStyles,
  });

  return <StylesContext.Provider value={result} children={children} />;
};

export default StylesProvider;

export const useStyles = () => {
  const value = useContext(StylesContext);
  if (value == null) {
    throw new Error('useStyles must be called from within StylesProvider!');
  }
  return value;
};
