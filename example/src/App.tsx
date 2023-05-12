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
import Box from './helpers/Box';
import Section from './helpers/Section';

export default function App() {
  const {width} = useWindowDimensions();

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Section title={'Week Calendar'}>
          <WeekCalendarExample width={width} />
        </Section>
        <Box height={60} />
        <Section title={'Month Calendar'}>
          <MonthCalendarExample width={width} />
        </Section>
        <Box height={60} />
        <Section title={'Week-Month Calendar'}>
          <WMCalendarExample width={width} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 20},
});
