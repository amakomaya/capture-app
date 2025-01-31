// @flow
import { dataElementTypes, DataElement, OptionSet, Option } from '../../../../metaData';
import { convertValue } from '../../../../converters/clientToView';
import { adToBs} from '@sbmdkl/nepali-date-converter';


type Attribute = {
    attribute: string,
    value: string,
    valueType: $Keys<typeof dataElementTypes>,
    optionSet: { options: Array<{ name: string, code: string, displayName: string }> },
}

export const convertClientToView = (clientAttribute: Attribute) => {
    const { value, attribute, valueType, optionSet } = clientAttribute;
    const dataElement = new DataElement((o) => {
        o.id = attribute;
        o.type = valueType;
    });

    if (optionSet) {
        const options = optionSet.options.map(
            option =>
                new Option((o) => {
                    o.text = option.displayName;
                    o.value = option.code;
                }),
        );
        dataElement.optionSet = new OptionSet(attribute, options, null, dataElement);
    }
    if (typeof value === 'string' && (value.match(/^\d{4}-\d{2}-\d{2}$/) || value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/))) {
        const dateOnlyString = value.split('T')[0];
        return adToBs(dateOnlyString);
    }
    // return value;
    return convertValue(value, valueType, dataElement);
};
