// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../../../utils/converters/date';
import { bsToAd, } from '@sbmdkl/nepali-date-converter';


const isValidEnrollmentDate = (value: string, isFutureDateAllowed: boolean) => {
    const dateContainer = parseDate(value);
    if (!dateContainer.isValid) {
        return false;
    }

    if (isFutureDateAllowed) {
        return true;
    }

    const momentDate = dateContainer.momentDate;
    const momentToday = moment();
    // $FlowFixMe -> if parseDate returns isValid true, there should always be a momentDate
    const isNotFutureDate = momentDate.isSameOrBefore(momentToday);
    return {
        valid: isNotFutureDate,
        message: i18n.t('A future date is not allowed'),
    };
};

const convertNepaliDateToGregorian = (nepaliDate: string) => {
    return bsToAd(nepaliDate);
};


export const getEnrollmentDateValidatorContainer = (isFutureEnrollmentDateAllowed: boolean) => {
    const validatorContainers = [
        {
            validator: hasValue,
            message: i18n.t('A value is required'),
        },
        {
            validator: (value: string) => {
                const gregorianDate = convertNepaliDateToGregorian(value);
                return isValidEnrollmentDate(gregorianDate, isFutureEnrollmentDateAllowed);
            },
            message: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};
