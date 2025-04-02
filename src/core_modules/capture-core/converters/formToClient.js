// @flow
import isString from 'd2-utilizr/lib/isString';
import { parseNumber, parseTime } from 'capture-core-utils/parsers';
import { dataElementTypes } from '../metaData';
import { parseDate } from '../utils/converters/date';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import { getTimeZone } from 'capture-core-utils/date/date.utils';
import moment from 'moment';
type DateTimeValue = {
    date: string,
    time: string,
};

type RangeValue = {
    from: string,
    to: string,
}

function convertDateTime(formValue: DateTimeValue): ?string {


    const editedDate = bsToAd(formValue.date);
    const editedTime = formValue.time;

    const parsedTime = parseTime(editedTime);
    if (!parsedTime.isValid) return null;
    const momentTime = parsedTime.momentTime;
    const hours = momentTime.hour();
    const minutes = momentTime.minute();

    const parsedDate = editedDate ? parseDate(editedDate) : null;
    if (!(parsedDate && parsedDate.isValid)) return null;
    const momentDateTime: moment$Moment = parsedDate.momentDate;
    // momentDateTime.hour(hours);
    // momentDateTime.minute(minutes);
    // const test = momentDateTime.toISOString();
   const formatDate = moment(momentDateTime).format('YYYY-MM-DD');
   const dateBs = adToBs(formatDate);
   
   return `${dateBs}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000Z`;

    
}

// function convertDate(dateValue: string) {
//     const parsedDate = parseDate(dateValue);
//     // $FlowFixMe[incompatible-use] automated comment
//     return parsedDate.isValid ? parsedDate.momentDate.toISOString() : null;
// }

function convertDate(dateValue: string) {
    if(dateValue==="Invalid date"){
        return;
    }
    try{
        const timezone = getTimeZone(bsToAd(dateValue));
        const date = `${dateValue}T${timezone}Z`;
        return date;
    }
    catch(e){
        const timezone = getTimeZone(dateValue);
        const date = `${dateValue}T${timezone}Z`;
        return date;
    }
   
}

function convertTime(timeValue: string) {
    const parsedTime = parseTime(timeValue);
    if (!parsedTime.isValid) return null;
    const momentTime = parsedTime.momentTime;
    momentTime.locale('en');
    return momentTime.format('HH:mm');
}

function convertAge(ageValue: Object) {
    return convertDate(ageValue.date);
}

function convertRange(parser: Function, value: RangeValue) {
    return {
        from: parser(value.from),
        to: parser(value.to),
    };
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.PERCENTAGE]: (value: string) => parseNumber(value.replace('%', '')),
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [dataElementTypes.DATETIME]: convertDateTime,
    [dataElementTypes.DATETIME_RANGE]: (value: RangeValue) => convertRange(convertDateTime, value),
    [dataElementTypes.TIME]: convertTime,
    [dataElementTypes.TIME_RANGE]: (value: RangeValue) => convertRange(convertTime, value),
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [dataElementTypes.AGE]: convertAge,
};

export function convertValue(value: any, type: $Keys<typeof dataElementTypes>) {
    if (value == null) {
        return null;
    }

    let toConvertValue;
    if (isString(value)) {
        toConvertValue = value.trim();
        if (!toConvertValue) {
            return null;
        }
    } else {
        toConvertValue = value;
    }

    // $FlowFixMe[prop-missing] automated comment
    return valueConvertersForType[type] ? valueConvertersForType[type](toConvertValue) : toConvertValue;
}
