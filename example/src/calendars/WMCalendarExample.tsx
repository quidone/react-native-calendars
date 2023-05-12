import React, {memo} from 'react';
import {WMCalendar} from '@quidone/react-native-calendars';
import {StyleSheet, Text, View} from 'react-native';

type WMCalendarExampleProps = {width: number};

// TODO add a button to switch between view modes
const WMCalendarExample = ({width}: WMCalendarExampleProps) => {
  return (
    <View style={styles.root}>
      <WMCalendar calendarWidth={width} />
      <Text style={styles.bottomSecondary}>
        You can switch views with a gesture (swipe up/down)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {minHeight: 360},
  bottomSecondary: {paddingVertical: 4, paddingHorizontal: 20, color: 'gray'},
});

export default memo(WMCalendarExample);
