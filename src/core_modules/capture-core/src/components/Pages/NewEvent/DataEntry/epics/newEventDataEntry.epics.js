// @flow
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import { rulesExecutedPostUpdateField } from '../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../../EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../../MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    batchActionTypes as newEventDataEntryBatchActionTypes,
    selectionsNotCompleteOpeningNewEvent,
    batchActionTypes,
} from '../actions/dataEntry.actions';
import {
    openNewEventInDataEntry,
    resetDataEntry,
} from '../actions/dataEntryLoad.actionBatchs';
import {
    getRulesActionsForEvent,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import {
    actionTypes as newEventSelectionTypes,
} from '../actions/dataEntryUrl.actions';
import getColumnsConfiguration from '../../../MainPage/EventsList/epics/getColumnsConfiguration';
import {
    actionTypes as newEventSelectorTypes,
} from '../../SelectorLevel/selectorLevel.actions';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorInputHelpers';
import getProgramAndStageFromProgramId from
    '../../../../../metaData/helpers/EventProgram/getProgramAndStageFromProgramId';
import errorCreator from '../../../../../utils/errorCreator';
import {
    resetList,
} from '../../../../List/list.actions';
import type {
    FieldData,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import {
    listId,
} from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

const errorMessages = {
    PROGRAM_OR_STAGE_NOT_FOUND: 'Program or stage not found',
};


export const resetDataEntryForNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        newEventSelectorTypes.OPEN_NEW_EVENT_FROM_NEW_EVENT_PAGE,
        newEventDataEntryBatchActionTypes.SAVE_NEW_EVENT_ADD_ANOTHER_BATCH,
    )
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageFromProgramId(programId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'resetDataEntryForNewEventEpic' }),
                );
            }

            return batchActions(
                // $FlowSuppress
                [...resetDataEntry(metadataContainer.program, metadataContainer.stage, orgUnit)],
                batchActionTypes.RESET_DATA_ENTRY_ACTIONS_BATCH,
            );
        });


export const openNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        editEventSelectorActionTypes.OPEN_NEW_EVENT,
        mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        newEventSelectionTypes.VALID_SELECTIONS_FROM_URL,
        newEventSelectorTypes.SET_PROGRAM_ID,
        newEventSelectorTypes.SET_ORG_UNIT,
        newEventSelectorTypes.SET_CATEGORY_OPTION,
    )
        .map(() => {
            const state = store.getState();
            const selectionsComplete = state.currentSelections.complete;
            if (!selectionsComplete) {
                return selectionsNotCompleteOpeningNewEvent();
            }
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageFromProgramId(programId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'openNewEventInDataEntryEpic' }),
                );
            }

            return batchActions(
                // $FlowSuppress
                [...openNewEventInDataEntry(metadataContainer.program, metadataContainer.stage, orgUnit)],
                batchActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH,
            );
        });

export const resetRecentlyAddedEventsWhenNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.ofType(
        editEventSelectorActionTypes.OPEN_NEW_EVENT,
        mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        newEventSelectionTypes.VALID_SELECTIONS_FROM_URL,
        newEventSelectorTypes.SET_CATEGORY_OPTION,
        newEventSelectorTypes.SET_ORG_UNIT,
        newEventSelectorTypes.SET_PROGRAM_ID)
        .filter(() => store.getState().currentSelections.complete)
        .switchMap(() => {
            const state = store.getState();
            // const newEventsListColumnsOrder = state.workingListsColumnsOrder.main || [];
            const newEventsMeta = { sortById: 'created', sortByDirection: 'desc' };
            return getColumnsConfiguration(state.currentSelections.programId).then(columnsConfig =>
                resetList(listId, columnsConfig, newEventsMeta, state.currentSelections));
        });


const runRulesForSingleEvent = (store: ReduxStore, dataEntryId: string, itemId: string, fieldData?: ?FieldData) => {
    const state = store.getState();
    const formId = getDataEntryKey(dataEntryId, itemId);
    const programId = state.currentSelections.programId;
    const metadataContainer = getProgramAndStageFromProgramId(programId);

    const orgUnitId = state.currentSelections.orgUnitId;
    const orgUnit = state.organisationUnits[orgUnitId];

    let rulesActions;
    if (metadataContainer.error) {
        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            metadataContainer.stage,
            formId,
            orgUnit,
        );
    } else {
        // $FlowSuppress
        const foundation: RenderFoundation = metadataContainer.stage;

        const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);
        const currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, {}, foundation);
        const currentEventData = { ...currentEventValues, ...currentEventMainData };

        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            metadataContainer.stage,
            formId,
            orgUnit,
            currentEventData,
            [currentEventData],
        );
    }

    return batchActions([
        ...rulesActions,
        rulesExecutedPostUpdateField(dataEntryId, itemId),
    ],
    batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};

export const runRulesUpdateDataEntryFieldForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const { dataEntryId, itemId } = action.payload;
            return runRulesForSingleEvent(store, dataEntryId, itemId);
        });

export const runRulesUpdateFieldForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const { dataEntryId, itemId, elementId, value, uiState } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForSingleEvent(store, dataEntryId, itemId, fieldData);
        });
