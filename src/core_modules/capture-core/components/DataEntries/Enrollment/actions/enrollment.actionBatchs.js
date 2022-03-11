// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import type {
    Enrollment,
    TEIValues,
} from 'capture-core-utils/rulesEngine';
import { getApplicableRuleEffectsForTrackerProgram, updateRulesEffects } from '../../../../rules';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import type { TrackerProgram, RenderFoundation } from '../../../../metaData';
import { startRunRulesPostUpdateField } from '../../../DataEntry';
import { startRunRulesOnUpdateForNewEnrollment } from './enrollment.actions';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT: 'RulesExecutedPostUpdateFieldForEnrollment',
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
    UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateDataEntryFieldNewEnrollmentActionBatch',
};

export const runRulesOnUpdateFieldBatch = (
    program: TrackerProgram,
    foundation: RenderFoundation,
    formId: string,
    dataEntryId: string,
    itemId: string,
    orgUnit: Object,
    enrollmentData?: Enrollment,
    attributeValues?: TEIValues,
    extraActions: Array<ReduxAction<any, any>> = [],
    uid: string,
) => {
    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        orgUnit,
        enrollmentData,
        attributeValues,
    });

    return batchActions([
        updateRulesEffects(effects, formId),
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
        ...extraActions,
    ], batchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT);
};

export const updateDataEntryFieldBatch = (
    innerAction: ReduxAction<any, any>,
    programId: string,
    orgUnit: Object,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, uid, programId, orgUnit),
    ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    programId: string,
    orgUnit: Object,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, uid, programId, orgUnit),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    dataEntryId: string,
    itemId: string,
    programId: string,
    orgUnit: Object,
) => {
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment({ ...innerAction.payload, dataEntryId, itemId }, uid, programId, orgUnit),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};