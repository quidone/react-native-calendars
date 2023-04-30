import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type dayjs from 'dayjs';
import {
  useMemoObject,
  useStableCallback,
  useIsChanged,
  useIsFirstRender,
} from '@rozhkov/react-useful-hooks';

export type PageType = 'week' | 'month';

export type PageData = {
  key: string;
  arrayIndex: number;
  type: PageType;
  start: dayjs.Dayjs; // TODO из свойств нужно только передавать строки дан FDay
  end: dayjs.Dayjs; // TODO из свойств нужно только передавать строки дан FDay
  pageHeight: number;
  rowCount: number;
};

type RenderedPagesEventsContextValue = {
  onPageMounted: (data: PageData) => void;
  onPageChanged: (data: PageData) => void;
  onPageUnmounted: (key: string) => void;
};
type RenderedPagesDataContextValue = ReadonlyArray<PageData>;

const RenderedPageEventsContext =
  createContext<RenderedPagesEventsContextValue | null>(null);
const RenderedPageDataContext =
  createContext<RenderedPagesDataContextValue | null>(null);

type RenderedPagesProviderProps = PropsWithChildren<{
  onPageMounted: ((data: PageData) => void) | undefined;
  onPageUnmounted: ((data: PageData) => void) | undefined;
}>;

const RenderedPagesProvider = ({
  onPageMounted: onPageMountedProp,
  onPageUnmounted: onPageUnmountedProp,
  children,
}: RenderedPagesProviderProps) => {
  const [pages, setPages] = useState<ReadonlyArray<PageData>>([]);

  const onPageMounted = useStableCallback((data: PageData) => {
    onPageMountedProp?.(data);
    setPages((prev) => [...prev, data]);
  });
  const onPageChanged = useCallback((data: PageData) => {
    setPages((prev) => {
      const index = prev.findIndex((x) => x.key === data.key);
      if (index < 0) {
        throw new Error('Page not found');
      }
      const result = [...prev];
      result.splice(index, 1, data);
      return result;
    });
  }, []);
  const onPageUnmounted = useStableCallback((key: string) => {
    setPages((prev) => {
      const index = prev.findIndex((x) => x.key === key);
      if (index < 0) {
        throw new Error('Page not found');
      }
      onPageUnmountedProp?.(prev[index]!);
      const result = [...prev];
      result.splice(index, 1);
      return result;
    });
  });

  const events = useMemoObject<RenderedPagesEventsContextValue>({
    onPageMounted,
    onPageChanged,
    onPageUnmounted,
  });

  return (
    <RenderedPageDataContext.Provider value={pages}>
      <RenderedPageEventsContext.Provider value={events} children={children} />
    </RenderedPageDataContext.Provider>
  );
};

export default RenderedPagesProvider;

export const useRenderedPageData = (type?: PageType) => {
  const value = useContext(RenderedPageDataContext);
  if (value === null) {
    throw new Error(
      'useRenderedPagesData must be called from within RenderedPagesProvider!',
    );
  }
  if (type === undefined) {
    return value;
  }
  return value.filter((x) => x.type === type);
};
export const useRenderedPageEvents = () => {
  const value = useContext(RenderedPageEventsContext);
  if (value === null) {
    throw new Error(
      'useRenderedPageEvents must be called from within RenderedPagesProvider!',
    );
  }
  return value;
};

const createPageKey = (type: PageType, arrayIndex: number) =>
  `${type}_${arrayIndex}`;

export const useRenderedPageRegisterEffect = (
  type: PageType,
  arrayIndex: number,
  pageHeight: number,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  rowCount: number,
) => {
  if (useIsChanged(type)) {
    throw new Error('Page type cannot be changed');
  }
  if (useIsChanged(arrayIndex)) {
    throw new Error('Array index cannot be changed');
  }
  const key = createPageKey(type, arrayIndex);

  const {onPageMounted, onPageChanged, onPageUnmounted} =
    useRenderedPageEvents();
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    onPageChanged({key, arrayIndex, start, end, pageHeight, type, rowCount});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, pageHeight, rowCount]);

  useEffect(() => {
    onPageMounted({key, arrayIndex, start, end, pageHeight, type, rowCount});
    return () => {
      onPageUnmounted(key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
