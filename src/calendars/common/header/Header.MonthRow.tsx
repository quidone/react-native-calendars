import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {useLocale} from '../providers/LocaleProvider';
import {useStyles} from '../providers/StylesProvider';
import {toUpperFirstCase} from '@utils/string';

export type HeaderMonthRowProps = {year: number; month: number};

const HeaderMonthRow = ({year, month}: HeaderMonthRowProps) => {
  const {months} = useLocale();
  const title = `${toUpperFirstCase(months[month] ?? '')} ${year}`;
  const {base, prop} = useStyles();

  return (
    <View style={[base.monthRowStyle, prop.monthRowStyle]}>
      <Text style={[base.monthHeaderTitleStyle, prop.monthHeaderTitleStyle]}>
        {title}
      </Text>
    </View>
  );
};

HeaderMonthRow.displayName = 'Header.MonthRow';

export default memo(HeaderMonthRow);
