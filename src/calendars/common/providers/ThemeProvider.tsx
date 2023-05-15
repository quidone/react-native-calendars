import React, {createContext, PropsWithChildren, useContext} from 'react';
import type {WithSpringConfig, WithTimingConfig} from 'react-native-reanimated';
import {useMemoObject} from '@rozhkov/react-useful-hooks';

export type TimingAnimConfig<ValueT> = {
  type: 'timing';
  value: ValueT;
  option?: WithTimingConfig;
};
export type SpringAnimConfig<ValueT> = {
  type: 'spring';
  value: ValueT;
  option?: WithSpringConfig;
};

export type AnimConfig<ValueT> =
  | TimingAnimConfig<ValueT>
  | SpringAnimConfig<ValueT>;

export type CalendarTheme = {
  calendarHorizontalPaddings: number;

  monthTitleColor: string;
  monthTitleFontSize: number;

  weekDayTitleColor: string;
  weekDayTitleFontSize: number;

  pagePaddingTop: number;
  pagePaddingBottom: number;
  pageBetweenRows: number;

  dayContainerSize: number;
  dayFontSize: number;
  dayBgColor: string | AnimConfig<string>;
  dayColor: string | AnimConfig<string>;
  daySelectedBgColor: string | AnimConfig<string>;
  daySelectedColor: string | AnimConfig<string>;
  dayDisabledOpacity: number;
  dayDotSize: number;
};

const WHITE_COLOR = '#ffffff';
const PRIMARY_COLOR = '#2C98F0';
const PRIMARY_FONT_COLOR = '#000000';
const SECONDARY_FONT_COLOR = '#707070';
const defaultTheme: CalendarTheme = {
  calendarHorizontalPaddings: 16, // TODO лучше разделить.

  monthTitleColor: PRIMARY_FONT_COLOR,
  monthTitleFontSize: 17,

  weekDayTitleColor: SECONDARY_FONT_COLOR,
  weekDayTitleFontSize: 12,

  pagePaddingTop: 4,
  pagePaddingBottom: 4,
  pageBetweenRows: 2,

  dayContainerSize: 40,
  dayFontSize: 17,
  dayBgColor: {value: 'transparent', type: 'timing', option: {duration: 50}},
  daySelectedBgColor: {
    value: PRIMARY_COLOR,
    type: 'timing',
    option: {duration: 50},
  },
  dayColor: {value: PRIMARY_FONT_COLOR, type: 'timing', option: {duration: 50}},
  daySelectedColor: {
    value: WHITE_COLOR,
    type: 'timing',
    option: {duration: 50},
  },
  dayDisabledOpacity: 0.5,
  dayDotSize: 5,
} as const;

const ThemeContext = createContext<CalendarTheme | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  theme: Partial<CalendarTheme> | undefined;
}>;

const ThemeProvider = (props: ThemeProviderProps) => {
  const {theme, children} = props;

  const result = useMemoObject<CalendarTheme>({
    ...defaultTheme,
    ...(theme ?? {}),
  });

  return <ThemeContext.Provider value={result} children={children} />;
};

export default ThemeProvider;

export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (value == null) {
    throw new Error('useTheme must be called from within ThemeProvider!');
  }

  return value;
};
