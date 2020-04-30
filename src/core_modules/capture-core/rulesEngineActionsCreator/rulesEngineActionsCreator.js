// @flow
/**
 * @module rulesEngineActionsCreator
 */
import { RulesEngine, processTypes } from '../../capture-core-utils/RulesEngine';
import { RenderFoundation, Program, TrackerProgram } from '../metaData';
import { prepareEventData } from './runRulesForSingleEvent';
import runRulesForTEI from './runRulesForTEI';
import postProcessRulesEffects from './postProcessRulesEffects';
import { updateRulesEffects } from './rulesEngine.actions';
import type {
    OutputEffect,
    EventData,
    Enrollment,
    TEIValues,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';

const rulesEngine = new RulesEngine();

function getRulesActions(
    rulesEffects: ?Array<OutputEffect>,
    foundation: ?RenderFoundation,
    formId: string,
) {
    const effectsHierarchy = postProcessRulesEffects(rulesEffects, foundation);
    return [updateRulesEffects(effectsHierarchy, formId)];
}

export function getRulesActionsForEvent(
    program: ?Program,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: Object,
    currentEventData: ?EventData | {} = {},
    allEventsData: ?Array<EventData>,
) {
    const data = prepareEventData(program, foundation);
    if (data) {
        const { optionSets, dataElementsInProgram, programRulesVariables, programRules, constants } = data;
        // returns an array of effects that need to take place in the UI.
        const rulesEffects = rulesEngine.executeRules(
            { programRulesVariables, programRules, constants },
            currentEventData,
            allEventsData,
            dataElementsInProgram,
            null,
            null,
            null,
            orgUnit,
            optionSets,
            processTypes.EVENT,
        );

        return getRulesActions(rulesEffects, foundation, formId);
    }
    return null;
}

export function getRulesActionsForTEI(
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: Object,
    enrollmentData: ?Enrollment,
    teiValues: ?TEIValues,
) {
    const rulesEffects = runRulesForTEI(
        rulesEngine,
        program,
        foundation,
        formId,
        orgUnit,
        enrollmentData,
        teiValues,
    );
    return getRulesActions(rulesEffects, foundation, formId);
}
