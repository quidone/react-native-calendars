import * as React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import MonthCalendarExample from './calendars/MonthCalendarExample';
import WeekCalendarExample from './calendars/WeekCalendarExample';
import WMCalendarExample from './calendars/WMCalendarExample';
import Box from './utils/Box';

export default function App() {
  const {width} = useWindowDimensions();

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <WeekCalendarExample width={width} />
        <Box height={80} />
        <MonthCalendarExample width={width} />
        <Box height={80} />
        <WMCalendarExample width={width} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 20},
});
