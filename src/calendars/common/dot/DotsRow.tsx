import React, {memo} from 'react';
import type {DotData} from '../providers/MarkedDaysProvider';
import {View} from 'react-native';
import {useStyles} from '../providers/StylesProvider';

type DotProps = {
  isDaySelected: boolean;
} & DotData;

const Dot = memo(({isDaySelected, color, selectedColor}: DotProps) => {
  const {base, prop} = useStyles();
  const backgroundColor = isDaySelected ? selectedColor ?? color : color;

  return (
    <View style={[base.dayDotStyle, prop.dayDotStyle, {backgroundColor}]} />
  );
});

type DotRowProps = {
  isDaySelected: boolean;
  dots: ReadonlyArray<DotData>;
};

const DotsRow = ({isDaySelected, dots}: DotRowProps) => {
  const {base, prop} = useStyles();

  if (dots.length === 0) {
    return null;
  }
  return (
    <View style={[base.dayDotsRowStyle, prop.dayDotsRowStyle]}>
      {dots.map(({key, ...rest}, index) => (
        <Dot key={key ?? index} isDaySelected={isDaySelected} {...rest} />
      ))}
    </View>
  );
};

export default memo(DotsRow);
