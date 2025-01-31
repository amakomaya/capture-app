// @flow
import moment from 'moment';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a string date to a string date with default format based on the system date format
 * @export
 * @param {*} string - the string instance
 * @returns {string}
 */
export function convertStringToDateFormat(date: string) {
    if (!date || !date.length) { return ''; }
    const formattedDateString =date.split('T')[0];;
    return formattedDateString;
}
