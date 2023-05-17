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

export type RenderMonthHeaderTitle = (data: {
  title: string;
  pageIndex: PageIndex;
}) => React.ReactNode;

type CustomRendersVal = {
  renderDay: RenderDay | undefined;
  renderMonthHeaderTitle: RenderMonthHeaderTitle | undefined;
};

const CustomRendersContext = createContext<CustomRendersVal | undefined>(
  undefined,
);

type CustomRendersProviderProps = PropsWithChildren<{
  renderDay: RenderDay | undefined;
  renderMonthHeaderTitle: RenderMonthHeaderTitle | undefined;
}>;

const CustomRendersProvider = (props: CustomRendersProviderProps) => {
  const {renderMonthHeaderTitle, renderDay, children} = props;

  const result = useMemoObject<CustomRendersVal>({
    renderDay,
    renderMonthHeaderTitle,
  });

  return <CustomRendersContext.Provider value={result} children={children} />;
};

export default memo(CustomRendersProvider);

export const useCustomRenders = createRequiredContextValueHook(
  CustomRendersContext,
  'useCustomRenders',
  'CustomRendersProvider',
);
