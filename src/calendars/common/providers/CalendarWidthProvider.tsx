import React, {createContext, PropsWithChildren, useContext} from 'react';

const CalendarWidthContext = createContext<number | null>(null);

type CalendarWidthProviderProps = PropsWithChildren<{width: number}>;

const CalendarWidthProvider = ({
  width,
  children,
}: CalendarWidthProviderProps) => {
  return (
    <CalendarWidthContext.Provider value={width}>
      {children}
    </CalendarWidthContext.Provider>
  );
};

export default CalendarWidthProvider;

export const useCalendarWidth = () => {
  const value = useContext(CalendarWidthContext);
  if (value === null) {
    throw new Error(
      'useIsDayState must be called from within DayStateProvider!',
    );
  }
  return value;
};
