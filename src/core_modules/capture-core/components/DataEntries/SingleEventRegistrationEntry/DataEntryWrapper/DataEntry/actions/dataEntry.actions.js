// @flow
import { actionCreator, actionPayloadAppender } from '../../../../../../actions/actions.utils';
import { effectMethods } from '../../../../../../trackerOffline';
import typeof { newEventSaveTypes } from '../newEventSaveTypes';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import moment from 'moment';


export const batchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForNewSingleEventActionsBatch',
    UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForNewSingleEventActionsBatch',
    OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenNewEventInDataEntryActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForNewSingleEventActionsBatch',
    SAVE_NEW_EVENT_ADD_ANOTHER_BATCH: 'SaveNewEventAddAnotherBatch',
    SAVE_NEW_EVENT_IN_STAGE_BATCH: 'SaveNewEventInStageBatch',
};

export const actionTypes = {
    OPEN_NEW_EVENT_IN_DATA_ENTRY: 'OpenNewEventInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewSingleEvent',
    REQUEST_SAVE_RETURN_TO_MAIN_PAGE: 'RequestSaveReturnToMainPageForNewSingleEvent',
    START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE: 'StartSaveAfterReturnedToMainPage',
    START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE: 'StartCancelSaveReturnToMainPageForNewSingleEvent',
    CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED: 'CancelSaveNoWorkingListUpdateNeededForSingleEvent',
    CANCEL_SAVE_UPDATE_WORKING_LIST: 'CancelSaveUpdateWorkingListForSingleNewEvent',
    NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE: 'SingleNewEventSavedAfterReturnedToMainPage',
    SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE: 'SaveFailedForNewSingleEventAfterReturnedToMainPage',
    NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL: 'NewEventInDataEntryOpeningCancel',
    START_ASYNC_UPDATE_FIELD_FOR_NEW_EVENT: 'StartAsyncUpdateFieldForNewEvent',
    REQUEST_SAVE_NEW_EVENT_ADD_ANOTHER: 'RequestSaveNewEventAddAnother',
    START_SAVE_NEW_EVENT_ADD_ANOTHER: 'startSaveNewEventAddAnother',
    NEW_EVENT_SAVED_ADD_ANOTHER: 'NewEventSavedAddAnother',
    SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER: 'SaveFailedForNewEventAddAnother',
    SET_NEW_EVENT_SAVE_TYPES: 'SetNewEventSaveTypes',
    ADD_NEW_EVENT_NOTE: 'AddNewEventNote',
    NEW_EVENT_OPEN_NEW_RELATIONSHIP: 'NewEventOpenNewRelationship',
    SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS: 'SaveNewEventRelationshipsIfExists',
    START_SAVE_NEW_EVENT_RELATIONSHIPS: 'StartSaveNewEventRelationships',
    NEW_EVENT_RELATIONSHIPS_SAVED: 'NewEventRelationshipsSaved',
    SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS: 'SaveFailedForNewEventRelationships',
    CANCEL_SAVE_INITIALIZE_WORKING_LISTS: 'CancelSaveInitializeWorkingListsForSingleNewEvent',
    START_SAVE_TEI_FOR_NEW_EVENT_RELATIONSHIPS: 'StartSaveTeiForNewEventRelationships',
    TEI_FOR_NEW_EVENT_RELATIONSHIPS_SAVED: 'TeiForNewEventRelationshipSaved',
    SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS_TEI: 'SaveFailedForNewEventRelationshipTei',
    SCROLLED_TO_RELATIONSHIPS: 'NewEventScrolledToRelationships',
    REQUEST_SAVE_NEW_EVENT_IN_STAGE: 'RequestSaveNewEventInStage',
    START_SAVE_NEW_EVENT_AND_RETURN_TO_LIST: 'StartSaveNewEventAndReturnToList',
    SAVE_FAILED_FOR_NEW_EVENT_IN_STAGE: 'SaveFailedForNewEventInStage',
    NEW_EVENT_SAVED_AFTER_RETURN_TO_LIST: 'NewEventSavedAfterReturnToList',
};

const isDateString = (value) => {
    if (typeof value !== 'string') {
        return false; 
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value.split('T')[0]);
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

export const startRunRulesOnUpdateForNewSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const requestSaveNewEventAndReturnToMainPage = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)(
        { eventId, dataEntryId, formFoundation }, { skipLogging: ['formFoundation'] },
    );

export const newEventSavedAfterReturnedToMainPage = (selections: Object) =>
    actionCreator(actionTypes.NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE)(null, { selections });

export const startSaveNewEventAfterReturnedToMainPage = (serverData: Object, relationshipData: ?Object, selections: Object) => {
    const actionType = actionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE;
    if (serverData.events) {
        serverData.events = convertDatesToGregorian(serverData.events);
    }
    return actionCreator(actionType)({ selections }, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS, meta: { selections, relationshipData, triggerAction: actionType } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE, meta: { selections } },
        },
    });
};


export const startSaveNewEventRelationships = (serverData: Object, selections: Object, triggerAction: string) =>
    actionCreator(actionTypes.START_SAVE_NEW_EVENT_RELATIONSHIPS)({ selections }, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.NEW_EVENT_RELATIONSHIPS_SAVED, meta: { selections, triggerAction } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS, meta: { selections, triggerAction } },
        },
    });

export const startSaveTeiForNewEventRelationship = (teiPayload: Object, selections: Object, triggerAction: string, relationshipData: Array<any>, relationshipClientId: string) =>
    actionCreator(actionTypes.START_SAVE_TEI_FOR_NEW_EVENT_RELATIONSHIPS)({ selections }, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: teiPayload,
            },
            commit: { type: actionTypes.TEI_FOR_NEW_EVENT_RELATIONSHIPS_SAVED, meta: { selections, triggerAction, relationshipData, relationshipClientId } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS_TEI, meta: { selections, triggerAction } },
        },
    });

export const openNewEventInDataEntry = () =>
    actionCreator(actionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY)();

export const cancelNewEventAndReturnToMainPage = () =>
    actionCreator(actionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)();

export const cancelNewEventNoWorkingListUpdateNeeded = () =>
    actionCreator(actionTypes.CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED)();

export const cancelNewEventUpdateWorkingList = () =>
    actionCreator(actionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST)();

export const cancelNewEventInitializeWorkingLists = () =>
    actionCreator(actionTypes.CANCEL_SAVE_INITIALIZE_WORKING_LISTS)();

export const cancelOpenNewEventInDataEntry = () =>
    actionCreator(actionTypes.NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL)();

export const setNewEventSaveTypes = (newSaveTypes: ?Array<$Values<newEventSaveTypes>>) =>
    actionCreator(actionTypes.SET_NEW_EVENT_SAVE_TYPES)({ saveTypes: newSaveTypes });

export const addNewEventNote = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(actionTypes.ADD_NEW_EVENT_NOTE)({ itemId, dataEntryId, note });

export const requestSaveNewEventAddAnother = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_NEW_EVENT_ADD_ANOTHER)({
        eventId,
        dataEntryId,
        formFoundation,
    }, { skipLogging: ['formFoundation'] });

export const requestSaveNewEventInStage = (eventId: string, dataEntryId: string, formFoundation: Object, completed?: boolean) =>
    actionCreator(actionTypes.REQUEST_SAVE_NEW_EVENT_IN_STAGE)({
        eventId,
        dataEntryId,
        formFoundation,
        completed,
    }, { skipLogging: ['formFoundation'] });

export const startSaveNewEventAddAnother =
(
    serverData: Object,
    relationshipData: ?Object,
    selections: Object,
    clientId: string,
) => {
    const actionType = actionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER;
    return actionCreator(actionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER)({ selections }, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
                clientId,
            },
            commit: { type: actionTypes.SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS, meta: { selections, relationshipData, triggerAction: actionType } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER, meta: { selections, clientId } },
        },
    });
};

export const startSaveNewEventAndReturnToList =
(
    serverData: Object,
    relationshipData: ?Object,
    selections: Object,
) => {
    const actionType = actionTypes.START_SAVE_NEW_EVENT_AND_RETURN_TO_LIST;

    return actionCreator(actionTypes.START_SAVE_NEW_EVENT_AND_RETURN_TO_LIST)({ selections }, {
        offline: {
            effect: {
                url: 'events',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS, meta: { selections, relationshipData, triggerAction: actionType } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_IN_STAGE, meta: { selections } },
        },
    });
};
export const newEventSavedAddAnother = (selections: Object) =>
    actionCreator(actionTypes.NEW_EVENT_SAVED_ADD_ANOTHER)(null, { selections });

export const newEventReturnToList = (selections: Object) =>
    actionCreator(actionTypes.NEW_EVENT_SAVED_AFTER_RETURN_TO_LIST)(null, { selections });

export const startAsyncUpdateFieldForNewEvent = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });

export const newEventOpenNewRelationship = (eventId: string, dataEntryId: string) =>
    actionCreator(actionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP)({ eventId, dataEntryId });

export const scrolledToRelationships = () =>
    actionCreator(actionTypes.SCROLLED_TO_RELATIONSHIPS)();
