import type dayjs from 'dayjs';

export const FIRST_DAY_OF_WEEK_INDEX = 0;
export const LAST_DAY_OF_WEEK_INDEX = 6;

export type DaysOfWeek = [
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
];

export const createDaysOfWeek = (start: dayjs.Dayjs): DaysOfWeek => {
  return [
    start,
    start.add(1, 'd'),
    start.add(2, 'd'),
    start.add(3, 'd'),
    start.add(4, 'd'),
    start.add(5, 'd'),
    start.add(6, 'd'),
  ];
};
