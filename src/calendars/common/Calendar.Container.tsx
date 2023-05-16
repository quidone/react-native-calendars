import React, {PropsWithChildren, useState} from 'react';
import {LayoutChangeEvent, View} from 'react-native';
import {useStyles} from './providers/StylesProvider';
import CalendarWidthProvider from './providers/CalendarWidthProvider';

type CalendarContainerProps = PropsWithChildren<{
  width: number | undefined;
}>;

const CalendarContainer = ({
  width: widthProp,
  children,
}: CalendarContainerProps) => {
  const [calendarWidthStt, setCalendarWidthStt] = useState<number | null>(null);
  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const width = nativeEvent.layout.width;
    if (calendarWidthStt !== width) {
      setCalendarWidthStt(width);
    }
  };
  const width = widthProp ?? calendarWidthStt;
  const {prop} = useStyles();

  return (
    <View style={[prop.containerStyle, {width: widthProp}]} onLayout={onLayout}>
      {width != null && (
        <CalendarWidthProvider width={width}>{children}</CalendarWidthProvider>
      )}
    </View>
  );
};

CalendarContainer.displayName = 'Calendar.Container';

export default CalendarContainer;
