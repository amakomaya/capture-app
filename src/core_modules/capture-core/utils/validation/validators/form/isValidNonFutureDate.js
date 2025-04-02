// // @flow
// import i18n from '@dhis2/d2-i18n';
// import { bsToAd } from '@sbmdkl/nepali-date-converter';

// const CUSTOM_VALIDATION_MESSAGES = {
//     INVALID_DATE_MORE_THAN_MAX: i18n.t('A date in the future is not allowed'),
// };

// export const isValidNonFutureDate = (value: string, internalComponentError?: ?{error: ?string, errorCode: ?string}) => {
//     console.log(value,'value')
//     if (!value) {
//         return true;
//     }

//     if (internalComponentError && internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
//         return {
//             valid: false,
//             errorMessage: CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_MORE_THAN_MAX,
//         };
//     }

//     return true;
// };




// @flow
// import i18n from '@dhis2/d2-i18n';
// import { bsToAd } from '@sbmdkl/nepali-date-converter';
// import moment from 'moment';

// const CUSTOM_VALIDATION_MESSAGES = {
//     INVALID_DATE_MORE_THAN_MAX: i18n.t('A date in the future is not allowed'),
//     INVALID_DATE_FORMAT: i18n.t('Invalid date format'),
// };

// const convertNepaliDateToGregorian = (nepaliDate: string) => {
//     return bsToAd(nepaliDate);
// };

// export const isValidNonFutureDate = (value: string, internalComponentError?: ?{error: ?string, errorCode: ?string}) => {
    
//     if (!value) {
//         return true; 
//     }
//     console.log(internalComponentError,'internalComponentError')

//     if (internalComponentError && internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
//         return {
//             valid: false,
//             errorMessage: CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_MORE_THAN_MAX,
//         };
//     }

//     // const gregorianDate = convertNepaliDateToGregorian(value);
//     // if (!gregorianDate) {
//     //     return {
//     //         valid: false,
//     //         errorMessage: CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_FORMAT,
//     //     };
//     // }

//     // const momentDate = moment(gregorianDate);
//     // if (momentDate.isAfter(moment())) {
//     //     return {
//     //         valid: false,
//     //         errorMessage: CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_MORE_THAN_MAX,
//     //     };
//     // }

//     return true;
// };


//@flow
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../../converters/date';
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
