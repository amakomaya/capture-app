// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { UserFormField } from '../../../FormFields/UserField';
import { adToBs } from '@sbmdkl/nepali-date-converter';

export const actionTypes = {
    VIEW_EVENT_FROM_URL: 'ViewEventFromUrl',
    EVENT_FROM_URL_RETRIEVED: 'EventFromUrlRetrievedForViewEvent',
    EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED: 'EventFromUrlCouldNotBeRetrievedForViewEvent',
    ORG_UNIT_RETRIEVED_ON_URL_UPDATE: 'OrgUnitRetrievedForViewEventOnUrlUpdate',
    ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE: 'OrgUnitRetrievalFailedForViewEventOnUrlUpdate',
    START_OPEN_EVENT_FOR_VIEW: 'StartOpenEventForView',
    ADD_EVENT_NOTE: 'AddEventNoteForViewEvent',
    REMOVE_EVENT_NOTE: 'RemoveEventNoteForViewEvent',
    UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE: 'UpdateWorkingListOnBackToMainPageForViewEvent',
    NO_WORKING_LIST_UPDATE_NEEDED_ON_BACK_TO_MAIN_PAGE: 'NoWorkingListUpdateNeededOnBackToMainPageForViewEvent',
    START_GO_BACK_TO_MAIN_PAGE: 'StartGoBackToMainPageForViewEvent',
    VIEW_EVENT_OPEN_NEW_RELATIONSHIP: 'ViewEventOpenAddRelationship',
    UPDATE_WORKING_LIST_PENDING_ON_BACK_TO_MAIN_PAGE: 'UpdateWorkingListPendingOnBackToMainPageForViewEvent',
    OPEN_VIEW_EVENT_PAGE_FAILED: 'OpenViewEventPageFailed',
    INITIALIZE_WORKING_LISTS_ON_BACK_TO_MAIN_PAGE: 'InitializeWorkingListsOnBackToMainPage',
    ASSIGNEE_SET: 'SingleEvent.AssigneeSet',
    ASSIGNEE_SAVE_FAILED: 'SingleEvent.AssigneeSaveFailed',
};

export const viewEventFromUrl = (data: Object) =>
    actionCreator(actionTypes.VIEW_EVENT_FROM_URL)({
        eventId: data.nextProps.viewEventId || data.nextProps.eventId,
        page: data.nextPage,
    });

export const changeEventFromUrl = (eventId: string, page: string) =>
    actionCreator(actionTypes.VIEW_EVENT_FROM_URL)({ eventId, page });

export const eventFromUrlCouldNotBeRetrieved = (message: string) =>
    actionCreator(actionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED)({ error: message });

export const eventFromUrlRetrieved = (eventContainer: Object, prevProgramId: ?string, categoriesData: ?Array<Object>) =>
    actionCreator(actionTypes.EVENT_FROM_URL_RETRIEVED)({ eventContainer, prevProgramId, categoriesData });


    const isDateString = (value) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        return datePattern.test(value.split('T')[0]);
    };
    
    const convertIfDateString = (value) => {
        if (isDateString(value)) {
            const convertedDate = adToBs(value.split('T')[0]); 
            return convertedDate;
        }
        return value;
    };

    // const convertIfDateString = (value) => {
    //     if (isDateString(value)) {
    //         const [year, month, day] = value.split('T')[0].split('-').map(Number);
    //         const nepaliDate = NepaliDate.fromAD(new Date(year, month - 1, day)).format('YYYY-MM-DD');
    //         return nepaliDate;
    //     }
    //     return value;
    // };
    
    const convertDatesToNepali = (eventContainer) => {
        if (eventContainer && eventContainer.event) {
            if (eventContainer.event.occurredAt) {
                eventContainer.event.occurredAt = convertIfDateString(eventContainer.event.occurredAt);
            }
            if (eventContainer.event.scheduledAt) {
                eventContainer.event.scheduledAt = convertIfDateString(eventContainer.event.scheduledAt);
            }
        }
        return eventContainer;
    };

export const orgUnitRetrievedOnUrlUpdate = (orgUnit: Object, eventContainer: Object) => {
    // const convertedEventContainer = convertDatesToNepali(eventContainer);
    return actionCreator(actionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE)({ orgUnit, eventContainer});
};
export const orgUnitCouldNotBeRetrievedOnUrlUpdate = (eventContainer: Object) =>
actionCreator(actionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE)({ eventContainer });

const convertDatesInObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertDatesInObject);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        acc[key] = typeof value === 'string' ? convertIfDateString(value) : convertDatesInObject(value);
        return acc;
    }, {});
};

export const startOpenEventForView = (eventContainer: Object, orgUnit: Object) => {
    const convertedEventContainer = convertDatesInObject(eventContainer);
    const convertedOrgUnit = convertDatesInObject(orgUnit);

    return actionCreator(actionTypes.START_OPEN_EVENT_FOR_VIEW)({ eventContainer: convertedEventContainer, orgUnit: convertedOrgUnit });
};

// export const startOpenEventForView = (eventContainer: Object, orgUnit: Object) =>
//     actionCreator(actionTypes.START_OPEN_EVENT_FOR_VIEW)({ eventContainer, orgUnit });

export const addEventNote = (eventId: string, note: Object) =>
    actionCreator(actionTypes.ADD_EVENT_NOTE)({ eventId, note });

export const removeEventNote = (eventId: string, noteClientId: string) =>
    actionCreator(actionTypes.REMOVE_EVENT_NOTE)({ eventId, noteClientId });

export const startGoBackToMainPage = () =>
    actionCreator(actionTypes.START_GO_BACK_TO_MAIN_PAGE)();

export const noWorkingListUpdateNeededOnBackToMainPage = () =>
    actionCreator(actionTypes.NO_WORKING_LIST_UPDATE_NEEDED_ON_BACK_TO_MAIN_PAGE)();

export const initializeWorkingListsOnBackToMainPage = () =>
    actionCreator(actionTypes.INITIALIZE_WORKING_LISTS_ON_BACK_TO_MAIN_PAGE)();

export const updateWorkingListOnBackToMainPage = () =>
    actionCreator(actionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE)();

export const updateWorkingListPendingOnBackToMainPage = () =>
    actionCreator(actionTypes.UPDATE_WORKING_LIST_PENDING_ON_BACK_TO_MAIN_PAGE)();

export const openAddRelationship = () =>
    actionCreator(actionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP)();

export const openViewEventPageFailed = (error: string) =>
    actionCreator(actionTypes.OPEN_VIEW_EVENT_PAGE_FAILED)({ error });

export const setAssignee = (assignee: UserFormField, eventId: string) =>
    actionCreator(actionTypes.ASSIGNEE_SET)({ assignee, eventId });

export const rollbackAssignee = (assignee: UserFormField, eventId: string) =>
    actionCreator(actionTypes.ASSIGNEE_SAVE_FAILED)({ assignee, eventId });
