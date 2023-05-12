import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {getIndexByOffset} from './get-index-by-offset';
import {debounce} from 'debounce';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
} from 'react-native-reanimated';
import {ScrollView as GNScrollView} from 'react-native-gesture-handler';
import {useArgByRef, useIsFirstRender} from '@rozhkov/react-useful-hooks';
import {useSetRefs} from '@utils/react-hooks';

export type SyncIndexConfig = {
  enable: boolean;
  animated: boolean;
  delay: number;
};

const defaultSyncIndexConfig: SyncIndexConfig = {
  enable: true,
  animated: true,
  delay: 200,
};

export type FlatListPagerMethods = Pick<FlatList, 'scrollToIndex'>;
export type RenderPage<ItemT> = (
  info: ListRenderItemInfo<ItemT>,
) => React.ReactElement | null;

export type FlatListPagerProps<ItemT = any> = {
  data: ReadonlyArray<ItemT>;
  index: number;
  syncIndexIfChanged?: Partial<SyncIndexConfig>;
  keyExtractor: (item: ItemT, index: number) => string;
  renderPage: RenderPage<ItemT>;
  onChangeIndex?: (index: number) => void;
  indexProgressSv?: SharedValue<number>;
  pageLength: number;
  horizontal?: boolean;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  contentContainerStyle?: StyleProp<ViewStyle>;
} & Pick<FlatListProps<ItemT>, 'pointerEvents'>;

const FlatListPager = <ItemT,>(
  {
    data,
    index,
    onChangeIndex,
    syncIndexIfChanged: syncIndexIfChangedProp,
    pageLength,
    horizontal,
    renderPage,
    keyExtractor,
    indexProgressSv,
    style,
    contentContainerStyle,
    pointerEvents,
  }: FlatListPagerProps<ItemT>,
  forwardedRef: ForwardedRef<FlatList<ItemT>>,
) => {
  const {
    enable: syncIndexEnable,
    animated: syncIndexAnimated,
    delay: syncIndexDelay,
  } = {...defaultSyncIndexConfig, ...(syncIndexIfChangedProp ?? {})};

  const ref = useAnimatedRef<FlatList>();
  const setRefs = useSetRefs(forwardedRef, ref);
  const pageLengthRef = useArgByRef(pageLength);
  const dataRef = useArgByRef(data);
  const indexRef = useArgByRef(index);
  const syncIndexAnimatedRef = useArgByRef(syncIndexAnimated);

  const scrollOffsetSv = useScrollViewOffset(ref as any);
  useDerivedValue(() => {
    if (indexProgressSv !== undefined) {
      indexProgressSv.value = scrollOffsetSv.value / pageLength;
    }
  });

  const offsetRef = useRef(0);
  const getCurIndex = useCallback(() => {
    return getIndexByOffset(offsetRef.current, {
      indexMax: dataRef.current.length,
      length: pageLengthRef.current,
    });
  }, [dataRef, pageLengthRef]);

  const syncIndex = useMemo(() => {
    return debounce(
      () => {
        const curIndex = getCurIndex();
        const indexProp = indexRef.current;
        const dataLength = dataRef.current.length;
        const animated = syncIndexAnimatedRef.current;
        if (
          indexProp !== curIndex &&
          indexProp >= 0 &&
          indexProp < dataLength
        ) {
          ref.current?.scrollToIndex({
            index: indexProp,
            animated,
          });
        }
      },
      syncIndexDelay,
      false,
    );
  }, [
    dataRef,
    getCurIndex,
    indexRef,
    ref,
    syncIndexAnimatedRef,
    syncIndexDelay,
  ]);

  const changeIndex = (i: number) => {
    onChangeIndex?.(i);
    syncIndex();
  };

  const offsetField = horizontal ? 'x' : 'y';

  const onScroll = ({
    nativeEvent: {contentOffset},
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetRef.current = contentOffset[offsetField];
    const calcIndex = getCurIndex();
    if (index !== calcIndex) {
      changeIndex(calcIndex);
    }
  };

  const getItemLayout = useCallback<
    (
      data: Array<ItemT> | null | undefined,
      index: number,
    ) => {length: number; offset: number; index: number}
  >(
    (_, i) => {
      return {
        index: i,
        offset: pageLength * i,
        length: pageLength,
      };
    },
    [pageLength],
  );

  const isFirstRender = useIsFirstRender();

  // Sync FlatListPager when changed index
  useEffect(() => {
    if (!syncIndexEnable || isFirstRender) {
      return;
    }
    syncIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Sync FlatListPager when changed pageLength
  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    if (index >= 0) {
      ref.current?.scrollToIndex({
        index,
        animated: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLength]);

  return (
    <Animated.FlatList
      ref={setRefs as any}
      style={style}
      pointerEvents={pointerEvents}
      pagingEnabled={true}
      onScroll={onScroll}
      getItemLayout={getItemLayout}
      scrollEventThrottle={16}
      data={data}
      horizontal={horizontal}
      initialScrollIndex={index}
      renderScrollComponent={(props) => <GNScrollView {...props} />}
      renderItem={renderPage}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      windowSize={3}
      maxToRenderPerBatch={3}
      initialNumToRender={1}
    />
  );
};

export default memo(forwardRef(FlatListPager)) as typeof FlatListPager;
