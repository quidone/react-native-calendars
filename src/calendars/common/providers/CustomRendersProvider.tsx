import React, {createContext, memo, PropsWithChildren} from 'react';
import type dayjs from 'dayjs';
import type {PageIndex} from '../types';
import {useMemoObject} from '@rozhkov/react-useful-hooks';
import {createRequiredContextValueHook} from '@utils/react-hooks';

export type RenderDay = (data: {
  isSecondary: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
  day: dayjs.Dayjs;
  onPress: () => void;
}) => React.ReactNode;

export type RenderMonthTitleHeader = (data: {
  title: string;
  pageIndex: PageIndex;
}) => React.ReactNode;

type CustomRendersVal = {
  renderDay: RenderDay | undefined;
  renderMonthTitleHeader: RenderMonthTitleHeader | undefined;
};

const CustomRendersContext = createContext<CustomRendersVal | undefined>(
  undefined,
);

type CustomRendersProviderProps = PropsWithChildren<{
  renderDay: RenderDay | undefined;
  renderMonthTitleHeader: RenderMonthTitleHeader | undefined;
}>;

const CustomRendersProvider = (props: CustomRendersProviderProps) => {
  const {renderMonthTitleHeader, renderDay, children} = props;

  const result = useMemoObject<CustomRendersVal>({
    renderDay,
    renderMonthTitleHeader,
  });

  return <CustomRendersContext.Provider value={result} children={children} />;
};

export default memo(CustomRendersProvider);

export const useCustomRenders = createRequiredContextValueHook(
  CustomRendersContext,
  'useCustomRenders',
  'CustomRendersProvider',
);
