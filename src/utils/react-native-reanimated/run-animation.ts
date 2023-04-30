import {
  AnimationCallback,
  withSpring,
  WithSpringConfig,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

export type AnimConfig =
  | {
      type: 'timing';
      option?: WithTimingConfig;
    }
  | {
      type: 'spring';
      option?: WithSpringConfig;
    };

export const withAnim = <T extends number>(
  value: T,
  anim: AnimConfig,
  callback?: AnimationCallback,
) => {
  'worklet';
  if (anim.type === 'timing') {
    return withTiming(value, anim.option, callback);
  } else {
    return withSpring(value, anim.option, callback);
  }
};
