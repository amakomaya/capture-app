// @flow

import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import moment from 'moment';

// import NepaliDate from 'nepali-date-converter';
export const batchActionTypes = {
    START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH: 'StartSaveEditEventDataEntryBatchForViewSingleEvent',
};


export const actionTypes = {
    CANCEL_EDIT_EVENT_DATA_ENTRY: 'CancelEditEventDataEntryForViewSingleEvent',
    REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY: 'RequestSaveEditEventDataEntryForViewSingleEvent',
    START_SAVE_EDIT_EVENT_DATA_ENTRY: 'StartSaveEditEventDataEntryForViewSingleEvent',
    EDIT_EVENT_DATA_ENTRY_SAVED: 'EditEventDataEntrySavedForViewSingleEvent',
    SAVE_EDIT_EVENT_DATA_ENTRY_FAILED: 'SaveEditEventDataEntryFailedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingEditEventDataEntryForViewSingleEvent',
    REQUEST_DELETE_EVENT_DATA_ENTRY: 'RequestDeleteEventDataEntry',
    START_DELETE_EVENT_DATA_ENTRY: 'StartDeleteEventDataEntry',
    DELETE_EVENT_DATA_ENTRY_FAILED: 'DeleteEventDataEntryFailed',
    DELETE_EVENT_DATA_ENTRY_SUCCEEDED: 'DeleteEventDataEntrySucceeded',
    EVENT_SCHEDULE_SUCCESS: 'ScheduleEvent.UpdateScheduleEventSuccess',
    EVENT_SCHEDULE_ERROR: 'ScheduleEvent.UpdateScheduleEventError',
    START_CREATE_NEW_AFTER_COMPLETING: 'WidgetEventEdit.StartCreateNewAfterCompleting',
    EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST: 'WidgetEventEdit.EventSaveAndEnrollmentCompleteRequest',
};

export const cancelEditEventDataEntry = () =>
    actionCreator(actionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY)();

export const requestSaveEditEventDataEntry = (itemId: string, dataEntryId: string, formFoundation: Object, orgUnit: OrgUnit) =>
    actionCreator(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY)({ itemId, dataEntryId, formFoundation, orgUnit }, { skipLogging: ['formFoundation'] });

    
const isDateString = (value) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value);
};

const convertIfDateString = (value) => {
    if (isDateString(value)) {
        const convertedDate = moment(bsToAd(value)).format('YYYY-MM-DDTHH:mm:ss');
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

export const startSaveEditEventDataEntry = (
    eventId: string,
    serverData: Object,
    triggerActionCommit?: ?string,
    triggerActionRollback?: ?string,
) => {
    serverData.events = convertDatesToGregorian(serverData.events);
    return actionCreator(actionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false&importStrategy=UPDATE',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: {
                    type: actionTypes.EDIT_EVENT_DATA_ENTRY_SAVED,
                    meta: { eventId, triggerAction: triggerActionCommit },
                },
                rollback: {
                    type: actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED,
                    meta: { eventId, triggerAction: triggerActionRollback },
                },
            },
        },
    );
};

export const prerequisitesErrorLoadingEditEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY)(message);

export const requestDeleteEventDataEntry = ({ eventId, enrollmentId }: { eventId: string, enrollmentId: string}) =>
    actionCreator(actionTypes.REQUEST_DELETE_EVENT_DATA_ENTRY)({ eventId, enrollmentId });
   
 export const startDeleteEventDataEntry = (serverData: Object, eventId: string, params: Object) =>
    actionCreator(actionTypes.START_DELETE_EVENT_DATA_ENTRY)({ eventId }, {
        offline: {
            effect: {
                url: 'tracker?async=false&importStrategy=DELETE',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: {
                type: actionTypes.DELETE_EVENT_DATA_ENTRY_SUCCEEDED,
                meta: { eventId, params },
            },
            rollback: {
                type: actionTypes.DELETE_EVENT_DATA_ENTRY_FAILED,
                meta: { eventId, params },
            },
        },
    });
    

export const startCreateNewAfterCompleting = ({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages }: Object) =>
    actionCreator(actionTypes.START_CREATE_NEW_AFTER_COMPLETING)({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages });

export const requestSaveAndCompleteEnrollment = ({
    itemId,
    dataEntryId,
    formFoundation,
    onSaveAndCompleteEnrollmentExternal,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    enrollment,
}: {
    itemId: string,
    dataEntryId: string,
    formFoundation: Object,
    onSaveAndCompleteEnrollmentExternal?: (enrollmnet: ApiEnrollment) => void,
    onSaveAndCompleteEnrollmentSuccessActionType?: string,
    onSaveAndCompleteEnrollmentErrorActionType?: string,
    enrollment: Object,
}) =>
    actionCreator(actionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST)(
        {
            itemId,
            dataEntryId,
            formFoundation,
            onSaveAndCompleteEnrollmentExternal,
            onSaveAndCompleteEnrollmentSuccessActionType,
            onSaveAndCompleteEnrollmentErrorActionType,
            enrollment,
        },
        { skipLogging: ['formFoundation'] },
    );

