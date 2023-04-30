import React, {
  createContext,
  memo,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import type dayjs from 'dayjs';
import type {PageIndex} from '../types';

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

type CustomRendersContextValue = {
  renderDay: RenderDay | undefined;
  renderMonthTitleHeader: RenderMonthTitleHeader | undefined;
};

const CustomRendersContext = createContext<CustomRendersContextValue | null>(
  null,
);

type CustomRendersProviderProps = PropsWithChildren<{
  renderDay: RenderDay | undefined;
  renderMonthTitleHeader: RenderMonthTitleHeader | undefined;
}>;

const CustomRendersProvider = (props: CustomRendersProviderProps) => {
  const {renderMonthTitleHeader, renderDay, children} = props;

  const result = useMemo(
    () => ({
      renderDay,
      renderMonthTitleHeader,
    }),
    [renderDay, renderMonthTitleHeader],
  );

  return <CustomRendersContext.Provider value={result} children={children} />;
};

export default memo(CustomRendersProvider);

export const useCustomRenders = (): CustomRendersContextValue => {
  const value = useContext(CustomRendersContext);
  if (value == null) {
    throw new Error(
      'useCustomRenders must be called from within CustomRendersProvider!',
    );
  }

  return value;
};
