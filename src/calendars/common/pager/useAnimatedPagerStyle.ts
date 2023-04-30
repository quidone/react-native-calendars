import {
  DerivedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type {PageData} from '../providers/RenderedPagesProvider';
import {useRef} from 'react';
import {useIsChanged} from '@rozhkov/react-useful-hooks';
import {compareArray} from '@utils/array';

const getInputsAndOutputs = (pages: ReadonlyArray<PageData>) => {
  const sortedPages = pages.slice().sort((a, b) => a.arrayIndex - b.arrayIndex);
  return {
    inputs: sortedPages.map((p) => p.arrayIndex),
    outputs: sortedPages.map((p) => p.pageHeight),
  };
};

const useAnimatedPagerStyle = (
  indexProgressSv: DerivedValue<number>,
  pages: ReadonlyArray<PageData>,
) => {
  const isPagesChanged = useIsChanged(pages);
  const inputsRef = useRef<number[] | null>(null);
  const outputsRef = useRef<number[] | null>(null);

  if (inputsRef.current === null) {
    const {inputs, outputs} = getInputsAndOutputs(pages);
    inputsRef.current = inputs;
    outputsRef.current = outputs;
  } else if (isPagesChanged) {
    const {inputs, outputs} = getInputsAndOutputs(pages);
    if (!compareArray(inputsRef.current, inputs)) {
      inputsRef.current = inputs;
    }
    if (!compareArray(outputsRef.current!, outputs)) {
      outputsRef.current = outputs;
    }
  }

  const inputs = inputsRef.current!;
  const outputs = outputsRef.current!;

  return useAnimatedStyle(() => {
    if (outputs.length === 0) {
      return {height: undefined};
    } else if (outputs.length === 1) {
      return {height: outputs[0]};
    }
    return {
      height: interpolate(indexProgressSv.value, inputs, outputs, 'clamp'),
    };
  });
};

export default useAnimatedPagerStyle;
