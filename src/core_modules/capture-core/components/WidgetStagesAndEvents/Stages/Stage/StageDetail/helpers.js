// @flow
import moment from 'moment';
import { convertValue as convertClientToView } from '../../../../../converters/clientToView';
import { convertValue as convertServerToClient } from '../../../../../converters/serverToClient';
import { statusTypes, dataElementTypes } from '../../../../../metaData';

const getEventStatus = (event: any) => {
    const isOverdue = moment(event.dueDate).isSameOrBefore(new Date()) && event.status !== statusTypes.COMPLETED;
    if (isOverdue) {
        return { value: statusTypes.OVERDUE };
    }
    if (event.status === statusTypes.SCHEDULE) {
        return { value: statusTypes.SCHEDULE, options: moment(event.eventDate).from(new Date()) };
    }
    return { value: event.status };
};

export const getValueByKeyFromEvent = (event: any, type: string) => {
    switch (type) {
    case 'status':
        return getEventStatus(event);
    default:
        return event[type];
    }
};

export const formatValueForView = (data: any, type: $Keys<typeof dataElementTypes>) =>
    convertClientToView(convertServerToClient(data, type), type);
