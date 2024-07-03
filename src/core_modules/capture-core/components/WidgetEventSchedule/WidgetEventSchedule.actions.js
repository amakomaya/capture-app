// @flow
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

export const scheduleEventWidgetActionTypes = {
    EVENT_SCHEDULE_REQUEST: 'ScheduleEvent.RequestScheduleEvent',
    EVENT_SCHEDULE: 'ScheduleEvent.ScheduleEvent',
    EVENT_UPDATE_SCHEDULED_DATE: 'ScheduleEvent.UpdateScheduledDate',
};

const isDateString = (value) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value.split('T')[0]);
};

const convertIfDateString = (value) => {
    if (isDateString(value)) {
        const convertedDate = bsToAd(value.split('T')[0]);
        return convertedDate;
    }
    return value;
};

const convertDatesToGregorian = (events) => {
    return events.map(event => {
        if (event.occurredAt) {
            event.occurredAt = convertIfDateString(event.occurredAt);
        }
        if (event.scheduledAt) {
            event.scheduledAt = convertIfDateString(event.scheduledAt);
        }
        return event;
    });
};

export const requestScheduleEvent = ({
    scheduleDate,
    comments,
    programId,
    orgUnitId,
    stageId,
    teiId,
    eventId,
    enrollmentId,
    categoryOptions,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    assignedUser,
}: {
    scheduleDate: string,
    comments: Array<{value: string}>,
    programId: string,
    orgUnitId: string,
    stageId: string,
    teiId: string,
    eventId: string,
    enrollmentId: string,
    categoryOptions: Object,
    onSaveExternal: (eventServerValues: Object, uid: string) => void,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    assignedUser?: ApiAssignedUser | null,
}) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST)({
        scheduleDate,
        comments,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
        eventId,
        categoryOptions,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        assignedUser,
    });
    


    export const scheduleEvent = (
        serverData: object,
        uid: string,
        onSaveSuccessActionType?: string,
        onSaveErrorActionType?: string,
    ) => {
        // Ensure the serverData.events is converted
        serverData.events = convertDatesToGregorian(serverData.events);
    
        return actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE)(
            {},
            {
                offline: {
                    effect: {
                        url: 'tracker?async=false',
                        method: effectMethods.POST,
                        data: serverData,
                    },
                    commit: onSaveSuccessActionType
                        ? { type: onSaveSuccessActionType, meta: { serverData, uid } }
                        : undefined,
                    rollback: onSaveErrorActionType
                        ? { type: onSaveErrorActionType, meta: { serverData, uid } }
                        : undefined,
                },
            }
        );
    };
    

    
//     export const updateScheduledDateForEvent = (
//     serverData: Object,
//     eventId: string,
//     onSaveSuccessActionType?: string,
//     onSaveErrorActionType?: string,
// ) => actionCreator(scheduleEventWidgetActionTypes.EVENT_UPDATE_SCHEDULED_DATE)({}, {
//     offline: {
//         effect: {
//             url: 'tracker?async=false&importStrategy=UPDATE',
//             method: effectMethods.POST,
//             data: serverData,
//         },
//         commit: onSaveSuccessActionType && { type: onSaveSuccessActionType, meta: { eventId, serverData } },
//         rollback: onSaveErrorActionType && { type: onSaveErrorActionType, meta: { eventId, serverData } },
//     },
// });


export const updateScheduledDateForEvent = (
    serverData: object,
    eventId: string,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
) => {
    serverData.events = convertDatesToGregorian(serverData.events);
    // console.log('Schedule update', serverData.events);

    return actionCreator(scheduleEventWidgetActionTypes.EVENT_UPDATE_SCHEDULED_DATE)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false&importStrategy=UPDATE',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: onSaveSuccessActionType
                    ? { type: onSaveSuccessActionType, meta: { eventId, serverData } }
                    : undefined,
                rollback: onSaveErrorActionType
                    ? { type: onSaveErrorActionType, meta: { eventId, serverData } }
                    : undefined,
            },
        }
    );
};
