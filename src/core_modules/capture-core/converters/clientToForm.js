// @flow
import moment from 'moment';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import { dataElementTypes } from '../metaData';

import { stringifyNumber } from './common/stringifyNumber';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

type DateTimeFormValue = {
    date: string,
    time: string
};

type AgeFormValue = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

type RangeValue = {
    from?: ?string,
    to?: ?string
}

function convertDateForEdit(rawValue: string): string {
    return rawValue;
}

function convertDateTimeForEdit(rawValue: string): DateTimeFormValue {
    const dateTime = moment(rawValue);
    const dateString = convertMomentToDateFormatString(dateTime);
    const timeString = dateTime.format('HH:mm');
    return {
        date: dateString,
        time: timeString,
    };
}

function convertTimeForEdit(rawValue: string) {
    const momentTime = moment(rawValue, 'HH:mm', true);
    return momentTime.format('HH:mm');
}
// Function to check if a date is likely Nepali
// function isLikelyNepaliDate(dateString) {
//     const currentYear = new Date().getFullYear();
//     const yearPart = parseInt(dateString.substring(0, 4), 10);
//     return yearPart > (currentYear - 60) && yearPart <= (currentYear + 10);
// }
function convertAgeForEdit(rawValue: string): AgeFormValue {
    console.log(rawValue,'rawValue')
    const now = moment();
    let date = rawValue;
    if(now.add(1, 'years').year() <= parseInt(rawValue.substring(0, 5),10)){
         date = bsToAd(rawValue);
    }
    // if (isLikelyNepaliDate(rawValue)) {
    //     date = bsToAd(rawValue);
    // }
    

    const age = moment(date);

    const years = now.diff(age, 'years');
    age.add(years, 'years');

    const months = now.diff(age, 'months');
    age.add(months, 'months');

    const days = now.diff(age, 'days');
    return {
        date: rawValue,
        years: years.toString(),
        months: months.toString(),
        days: days.toString(),
    };
}

function convertNumberRangeForDisplay(rawValue: RangeValue) {
    return rawValue.to;
}

function convertDateRangeForDisplay(rawValue: RangeValue) {
    return rawValue.to;
}


function convertRangeForDisplay(parser: any, clientValue: any) {
    return parser(clientValue.from);
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.PERCENTAGE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDateForEdit,
    [dataElementTypes.DATETIME]: convertDateTimeForEdit,
    [dataElementTypes.TIME]: convertTimeForEdit,
    [dataElementTypes.TRUE_ONLY]: () => 'true',
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.AGE]: convertAgeForEdit,
    [dataElementTypes.NUMBER_RANGE]: convertNumberRangeForDisplay,
    [dataElementTypes.DATE_RANGE]: convertDateRangeForDisplay,
    [dataElementTypes.INTEGER_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.TIME_RANGE]: value => convertRangeForDisplay(convertTimeForEdit, value),
    [dataElementTypes.DATETIME_RANGE]: value => convertRangeForDisplay(convertDateTimeForEdit, value),
};

export function convertValue(value: any, type: $Keys<typeof dataElementTypes>) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    // $FlowFixMe dataElementTypes flow error
    return (valueConvertersForType[type] ? valueConvertersForType[type](value) : value);
}
