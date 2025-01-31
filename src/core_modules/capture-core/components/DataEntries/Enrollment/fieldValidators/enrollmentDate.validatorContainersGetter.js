// @flow
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../../../utils/converters/date';
import { bsToAd } from '@sbmdkl/nepali-date-converter';


const isValidEnrollmentDate = (value: string, internalComponentError?: ?{error: ?string, errorCode: ?string}) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
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
