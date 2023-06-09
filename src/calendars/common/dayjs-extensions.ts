import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import LocaleData from 'dayjs/plugin/localeData';
import Weekday from 'dayjs/plugin/weekday';
import Utc from 'dayjs/plugin/utc';

dayjs.extend(dayOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(LocaleData);
dayjs.extend(Weekday);
dayjs.extend(Utc);
