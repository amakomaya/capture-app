// @flow
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../../../utils/converters/date';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import { hasValue } from 'capture-core-utils/validators/form';
import { isValidDate, isValidNonFutureDate } from '../../../../utils/validation/validators/form';


const convertNepaliDateToGregorian = (nepaliDate: string) => {
    return bsToAd(nepaliDate);
};
const isValidIncidentDate = (value: string, isFutureDateAllowed: boolean) => {
    const gregorianDate = convertNepaliDateToGregorian(value);
    const dateContainer = parseDate(gregorianDate);
    if (!dateContainer.isValid) {
        return false;
    }

    if (isFutureDateAllowed) {
        return true;
    }
    return isValidDate(value);
};


export const getIncidentDateValidatorContainer = () => {
    const validatorContainers = [
        {
            validator: hasValue,
            errorMessage:
                i18n.t('A value is required'),
        },
        {
            validator: isValidIncidentDate,
            errorMessage: i18n.t('Please provide a valid date'),
        },
        { validator: isValidNonFutureDate,
            errorMessage: i18n.t('A date in the future is not allowed'),
        },
    ];
    return validatorContainers;
};
