// @flow
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../converters/date';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

const convertNepaliDateToGregorian = (nepaliDate: string) => {
    return bsToAd(nepaliDate);
};

export const isValidNonFutureDate = (value: string) => {
    const gregorianDate = convertNepaliDateToGregorian(value);
    const { isValid, momentDate } = parseDate(gregorianDate);

    if (!isValid) {
        return isValid;
    }

    return {
        // $FlowFixMe -> if parseDate returns isValid true, there should always be a momentDate
        valid: momentDate.isSameOrBefore(moment()),
        message: i18n.t('A future date is not allowed'),
    };
};
