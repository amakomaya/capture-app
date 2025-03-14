// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import { relatedStageActions } from '../../WidgetRelatedStages';
import type { RequestEvent, LinkedRequestEvent } from '../../DataEntries';
import type { ExternalSaveHandler } from '../common.types';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import moment from 'moment';

export const newEventBatchActionTypes = {
    REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS: 'NewEvent.RequestSaveAndSetSubmissionInProgress',
};

export const newEventWidgetActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_SAVE_REQUEST: 'NewEvent.RequestSaveEvent',
    EVENT_SAVE: 'NewEvent.SaveEvent',
    EVENT_SAVE_SUCCESS: 'NewEvent.SaveEventSuccess',  // TEMPORARY - pass in success action name to the widget
    EVENT_SAVE_ERROR: 'NewEvent.SaveEventError', // TEMPORARY - pass in error action name to the widget
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
    START_CREATE_NEW_AFTER_COMPLETING: 'NewEvent.StartCreateNewAfterCompleting',
    SET_SAVE_ENROLLMENT_EVENT_IN_PROGRESS: 'NewEvent.SetSaveEnrollmentEventInProgress',
    CLEAN_UP_EVENT_SAVE_IN_PROGRESS: 'NewEvent.CleanUpDataEntry',
    EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST: 'NewEvent.EventSaveAndEnrollmentCompleteRequest',
    EVENT_SAVE_ENROLLMENT_COMPLETE: 'NewEvent.EventSaveAndEnrollmentComplete',
};

export const requestSaveEvent = ({
    requestEvent,
    linkedEvent,
    relationship,
    serverData,
    linkMode,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
}: {
    requestEvent: RequestEvent,
    linkedEvent: ?LinkedRequestEvent,
    relationship: ?Object,
    serverData: Object,
    linkMode: ?$Keys<typeof relatedStageActions>,
    onSaveExternal: ?ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_REQUEST)({
        requestEvent,
        linkedEvent,
        relationship,
        serverData,
        linkMode,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    }, { skipLogging: ['formFoundation'] });

export const setSaveEnrollmentEventInProgress = ({
    requestEventId,
    linkedEventId,
    linkedOrgUnitId,
    linkMode,
}: {
    requestEventId: string,
    linkedEventId: ?string,
    linkedOrgUnitId: ?string,
    linkMode: ?$Keys<typeof relatedStageActions>,
}) => actionCreator(newEventWidgetActionTypes.SET_SAVE_ENROLLMENT_EVENT_IN_PROGRESS)({
    requestEventId,
    linkedEventId,
    linkedOrgUnitId,
    linkMode,
});


// const isDateString = (value) => {
//     if (typeof value !== 'string') {
//         return false;
//     }
//     const datePattern = /^\d{4}-\d{2}-\d{2}$/;
//     return datePattern.test(value);
// };
const isDateString = (value) => {
    const datePattern1 = /^\d{4}-\d{2}-\d{2}$/; 
    const datePattern2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/; 

    return datePattern1.test(value) || datePattern2.test(value);
};

const convertIfDateString = (value) => {
    if (value && isDateString(value)) { 
        console.log(value,'convertDatesToGregorian')
        if (value.includes('T')) {
            const [bsDate, timePart] = value.split('T');
            
            if (bsDate) {
                const adDate = bsToAd(bsDate);
                const convertedDate = `${formatDate(adDate)}T${timePart}`;
                return convertedDate;
            }
        } else {
            const adDate = bsToAd(value);
            const convertedDate = `${formatDate(adDate)}`; 
            return convertedDate;
        }
    }
    return value; 
};

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}


const convertDatesToGregorian = (events) => {
    return events.map(event => {
        if (event.occurredAt) {
            event.occurredAt = convertIfDateString(event.occurredAt);
        }
        if (event.scheduledAt) {
            event.scheduledAt = convertIfDateString(event.scheduledAt);
        }
        if (event.dataValues && event.dataValues.length > 0) {
            event.dataValues = event.dataValues.map(dataValue => {
                if (isDateString(dataValue.value)) {
                    dataValue.value = convertIfDateString(dataValue.value);
                }
                return dataValue;
            });
        }
        
        return event;
    });
};

export const saveEvents = ({ serverData, onSaveErrorActionType, onSaveSuccessActionType }: Object) => {

    if (serverData.events) {
        serverData.events = convertDatesToGregorian(serverData.events);
    }

    return actionCreator(newEventWidgetActionTypes.EVENT_SAVE)({}, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: onSaveSuccessActionType && { type: onSaveSuccessActionType, meta: { serverData } },
            rollback: onSaveErrorActionType && { type: onSaveErrorActionType, meta: { serverData } },
        },
    });
};

export const startCreateNewAfterCompleting = ({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages }: Object) =>
    actionCreator(newEventWidgetActionTypes.START_CREATE_NEW_AFTER_COMPLETING)({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages });

export const cleanUpEventSaveInProgress = () =>
    actionCreator(newEventWidgetActionTypes.CLEAN_UP_EVENT_SAVE_IN_PROGRESS)();
