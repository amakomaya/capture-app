// @flow
/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import moment from 'moment';
import type { IConvertInputRulesValue } from '@dhis2/rules-engine-javascript';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

const dateMomentFormat = 'YYYY-MM-DD';

const convertStringValue = (value: ?string): ?string => (value || null);
const convertNumericValue = (value: any): ?number => (typeof value === 'number' ? value : null);
const convertObjectToString = (value: ?{ name: string }) => (value ? value.name : null);

export const inputConverter: IConvertInputRulesValue = {
    convertText: convertStringValue,
    convertMultiText: convertStringValue,
    convertLongText: convertStringValue,
    convertLetter: convertStringValue,
    convertPhoneNumber: convertStringValue,
    convertEmail: convertStringValue,
    convertBoolean: (value: ?boolean): ?boolean => ((value || value === false) ? value : null),
    convertTrueOnly: (value: ?boolean): ?boolean => (value || null),

        // this was to fix future date issue need to reverify

    convertDate: (value: any): ?string => {
        if (!value) {
            return null;
        }
        let dateEn = null;

        if (value.includes('T')) {
            const [datePart] = value.split('T');
            const isNepaliDate = /^\d{4}/.test(datePart) && parseInt(datePart.substring(0, 4)) >= 2070;
            dateEn = isNepaliDate ? bsToAd(datePart) : datePart;
        } else {
            const isNepaliDate = /^\d{4}/.test(value) && parseInt(value.substring(0, 4)) >= 2070;
            dateEn = isNepaliDate ? bsToAd(value) : value;
        }
        
        const momentObject = moment(dateEn);
        momentObject.locale('en');
        return momentObject.format(dateMomentFormat);
    },
    // convertDate: (value: any): ?string => {
    //     if (!value) {
    //         return null;
    //     }
    //     console.log(value,'value')
    //     const momentObject = moment(value);
    //     momentObject.locale('en');
    //     return momentObject.format(dateMomentFormat);
    // },
    convertDateTime: convertStringValue,
    convertTime: convertStringValue,
    convertNumber: convertNumericValue,
    convertUnitInterval: convertNumericValue,
    convertPercentage: convertNumericValue,
    convertInteger: convertNumericValue,
    convertIntegerPositive: convertNumericValue,
    convertIntegerNegative: convertNumericValue,
    convertIntegerZeroOrPositive: convertNumericValue,
    convertTrackerAssociate: (value: any): ?string => {
        log.warn('convertTrackerAssociate not implemented', value);
        return null;
    },
    convertUserName: convertStringValue,
    convertCoordinate: (value: any): ?string => (
        (value && value.latitude && value.longitude) ? `[${value.latitude},${value.longitude}]` : null),
    convertOrganisationUnit: convertObjectToString,
    convertAge: (value: any): ?string => inputConverter.convertDate(value),
    convertUrl: convertStringValue,
    convertFile: convertObjectToString,
    convertImage: convertObjectToString,
};
