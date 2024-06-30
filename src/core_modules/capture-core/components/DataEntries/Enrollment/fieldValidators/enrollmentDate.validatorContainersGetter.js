// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../../../utils/converters/date';
import { bsToAd, } from '@sbmdkl/nepali-date-converter';
// import NepaliDate from 'nepali-date-converter';


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
    // const parsedNepaliDate = NepaliDate.parse(nepaliDate);
    // const adDate = parsedNepaliDate.getAD();
    
    // console.log('nepalidate',nepaliDate);
    // console.log('engdate',adDate);
    const engdate = bsToAd(nepaliDate);
    return bsToAd(nepaliDate);
    // return adDate;
};

// const convertNepaliDateToGregorian = (nepaliDate) => {
//     const parsedNepaliDate = NepaliDate.parse(nepaliDate);
//     const adDate = parsedNepaliDate.getAD();
//     const jsAdDate = new Date(adDate.year, adDate.month, adDate.date);
//     return moment(jsAdDate).format('YYYY-MM-DD');
// };


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
