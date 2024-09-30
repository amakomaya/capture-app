// @flow
import { parseDate } from '../../parsers';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

/**
 *
 * @export
 * @param {string} value
 * @param {string} format
 * @returns {boolean}
 */

export function isValidDate(value: string, format: string) {
    const parseData = parseDate(bsToAd(value), format);
    return parseData.isValid;
}
