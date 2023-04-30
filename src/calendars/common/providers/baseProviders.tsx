import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import CustomRendersProvider, {
  RenderDay,
  RenderMonthTitleHeader,
} from './CustomRendersProvider';
import LocaleProvider, {Locale} from './LocaleProvider';
import MarkedDaysProvider, {MarkedDays} from './MarkedDaysProvider';
import RenderedPagesProvider, {PageData} from './RenderedPagesProvider';
import StylesProvider, {CalendarStyles} from './StylesProvider';
import ThemeProvider, {CalendarTheme} from './ThemeProvider';
import TodayProvider from './TodayProvider';
import DayProvider, {OnChangeDay} from './DayProvider';
import type {Day, FDay} from '@utils/day';

export type BaseCalendarProps = {
  locale?: Locale;
  theme?: Partial<CalendarTheme>;

  selectedDay?: FDay | string | null;
  onChangeDay?: OnChangeDay;
  dayMin?: Day;
  dayMax?: Day;
  markedDays?: MarkedDays;

  onPageMounted?: (data: PageData) => void;
  onPageUnmounted?: (data: PageData) => void;

  renderDay?: RenderDay;
  renderMonthTitleHeader?: RenderMonthTitleHeader;
} & Partial<CalendarStyles>;

const baseProviders = <
  PropsT extends Omit<PropsT, keyof BaseCalendarProps>,
  MethodsT,
>(
  WrappedComponent: ForwardRefExoticComponent<
    PropsWithoutRef<PropsT> & RefAttributes<MethodsT>
  >,
) => {
  const BaseProviders = (
    {
      locale,
      theme,

      selectedDay,
      onChangeDay,
      markedDays,
      dayMin,
      dayMax,

      onPageUnmounted,
      onPageMounted,

      renderMonthTitleHeader,
      renderDay,

      calendarContainerStyle,
      monthHeaderRowStyle,
      monthHeaderTitleStyle,
      weekDayTitleStyle,
      weekDaysContainerStyle,
      weekDayContainerStyle,
      pageContainerStyle,
      dayRowStyle,
      dayContainerStyle,
      dayTextStyle,
      dayDotsRowStyle,
      dayDotStyle,
      ...restProps
    }: PropsT & BaseCalendarProps,
    forwardedRef: ForwardedRef<MethodsT>,
  ) => {
    return (
      <LocaleProvider locale={locale}>
        <ThemeProvider theme={theme}>
          <TodayProvider>
            <DayProvider
              dayMin={dayMin}
              dayMax={dayMax}
              day={selectedDay}
              onChangeDay={onChangeDay}>
              <RenderedPagesProvider
                onPageMounted={onPageMounted}
                onPageUnmounted={onPageUnmounted}>
                <MarkedDaysProvider markedDays={markedDays}>
                  <CustomRendersProvider
                    renderDay={renderDay}
                    renderMonthTitleHeader={renderMonthTitleHeader}>
                    <StylesProvider
                      calendarContainerStyle={calendarContainerStyle}
                      monthHeaderRowStyle={monthHeaderRowStyle}
                      monthHeaderTitleStyle={monthHeaderTitleStyle}
                      weekDaysContainerStyle={weekDaysContainerStyle}
                      weekDayContainerStyle={weekDayContainerStyle}
                      weekDayTitleStyle={weekDayTitleStyle}
                      pageContainerStyle={pageContainerStyle}
                      dayRowStyle={dayRowStyle}
                      dayContainerStyle={dayContainerStyle}
                      dayTextStyle={dayTextStyle}
                      dayDotsRowStyle={dayDotsRowStyle}
                      dayDotStyle={dayDotStyle}>
                      <WrappedComponent
                        {...(restProps as any)}
                        ref={forwardedRef}
                      />
                    </StylesProvider>
                  </CustomRendersProvider>
                </MarkedDaysProvider>
              </RenderedPagesProvider>
            </DayProvider>
          </TodayProvider>
        </ThemeProvider>
      </LocaleProvider>
    );
  };
  return forwardRef(BaseProviders);
};

export default baseProviders;
