// @flow
import { batchActions } from 'redux-batched-actions';
import type {
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
    EventsData,
    DataElements,
    Enrollment,
} from '@dhis2/rules-engine-javascript';
import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import type { RenderFoundation } from '../../../metaData';
import type { FieldData } from '../../../rules';
import { getCurrentClientValues } from '../../../rules';
import { loadNewDataEntry } from '../../DataEntry/actions/dataEntryLoadNew.actions';
import { rulesExecutedPostUpdateField } from '../../DataEntry/actions/dataEntry.actions';
import { getRulesActionsForTEIAsync } from './ProgramRules';
import { addFormData } from '../../D2Form/actions/form.actions';
import type { Geometry } from './helpers/types';
import { adToBs } from '@sbmdkl/nepali-date-converter'; 


export const TEI_MODAL_STATE = {
    OPEN: 'Open',
    OPEN_ERROR: 'OpenWithErrors',
    OPEN_DISABLE: 'OpenAndDisabled',
    CLOSE: 'Close',
};

export const dataEntryActionTypes = {
    UPDATE_FIELD_PROFILE_ACTION_BATCH: 'UpdateFieldProfileActionBatch',
    OPEN_DATA_ENTRY_PROFILE_ACTION_BATCH: 'OpenDataEntryProfileActionBatch',
    TEI_UPDATE: 'TeiUpdate',
    TEI_UPDATE_REQUEST: 'TeiSaveRequest',
    TEI_UPDATE_SUCCESS: 'TeiUpdateSucess',
    TEI_UPDATE_ERROR: 'TeiUpdateError',
    SET_TEI_MODAL_ERROR: 'SetTeiModalError',
    SET_TEI_VALUES: 'SetTeiValues',
    CLEAN_TEI_MODAL: 'CleanTeiModal',
};
const dataEntryPropsToInclude: Array<Object> = [
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        id: 'assignee',
    },
];

type Context = {
    orgUnit: OrgUnit,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
    formFoundation: RenderFoundation,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    enrollment?: ?Enrollment,
    userRoles: Array<string>,
    state: ReduxState,
};

export const getUpdateFieldActions = async ({
    context,
    querySingleResource,
    onGetValidationContext,
    innerAction,
    uid,
}: {
    context: Context,
    querySingleResource: QuerySingleResource,
    onGetValidationContext: () => Object,
    innerAction: ReduxAction<any, any>,
    uid: string
}) => {
    const {
        orgUnit,
        trackedEntityAttributes,
        optionSets,
        rulesContainer,
        formFoundation,
        state,
        otherEvents,
        dataElements,
        enrollment,
        userRoles,
    } = context;
    const { dataEntryId, itemId, elementId, value, uiState } = innerAction.payload || {};
    const fieldData: FieldData = {
        elementId,
        value,
        valid: uiState?.valid,
    };
    const formId = `${dataEntryId}-${itemId}`;
    const currentTEIValues = getCurrentClientValues(state, formFoundation, formId, fieldData);
    const rulesActions = await getRulesActionsForTEIAsync({
        foundation: formFoundation,
        formId,
        orgUnit,
        enrollmentData: enrollment,
        teiValues: currentTEIValues,
        trackedEntityAttributes,
        optionSets,
        rulesContainer,
        otherEvents,
        dataElements,
        userRoles,
        querySingleResource,
        onGetValidationContext,
    });

    return batchActions(
        [
            innerAction,
            rulesActions,
            rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
        ],
        dataEntryActionTypes.UPDATE_FIELD_PROFILE_ACTION_BATCH,
    );
};

export const setTeiModalError = (hasError: boolean) =>
    actionCreator(dataEntryActionTypes.SET_TEI_MODAL_ERROR)({ hasError });

export const setTeiValues = (
    attributeValues: Array<{ [key: string]: string }>,
    geometry: ?Geometry,
) => actionCreator(dataEntryActionTypes.SET_TEI_VALUES)({ attributeValues, geometry });

export const cleanTeiModal = () => actionCreator(dataEntryActionTypes.CLEAN_TEI_MODAL)();

export const updateTeiRequest = ({
    itemId,
    dataEntryId,
    orgUnitId,
    trackedEntityTypeId,
    trackedEntityInstanceId,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    formFoundation,
}: {
    itemId: string,
    dataEntryId: string,
    orgUnitId: string,
    trackedEntityTypeId: string,
    trackedEntityInstanceId: string,
    onSaveExternal?: (eventServerValues: any, uid: string) => void,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    formFoundation: RenderFoundation,
}) =>
    actionCreator(dataEntryActionTypes.TEI_UPDATE_REQUEST)({
        itemId,
        dataEntryId,
        orgUnitId,
        trackedEntityTypeId,
        trackedEntityInstanceId,
        formFoundation,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    });

export const updateTei = ({
    serverData,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    uid,
}: {
    serverData: Object,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    uid: string,
}) =>
    actionCreator(dataEntryActionTypes.TEI_UPDATE)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: { type: onSaveSuccessActionType, meta: { serverData, uid } },
                rollback: { type: onSaveErrorActionType, meta: { serverData, uid } },
            },
        },
    );

    const convertDateToBS = (dateString) => {
        if (typeof dateString === 'string') {
            const dateOnlyString = dateString.split('T')[0];
            const nepaliDate = adToBs(dateOnlyString);
            return nepaliDate;
        }
        return dateString; 
    };
    function convertFormValuesDates(formValues) {
        const convertedValues = { ...formValues };
    
        Object.keys(convertedValues).forEach(key => {
            if (typeof convertedValues[key] === 'object' && convertedValues[key] !== null) {
                convertedValues[key] = convertFormValuesDates(convertedValues[key]);
            } else if (typeof convertedValues[key] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(convertedValues[key])) {
                convertedValues[key] = convertDateToBS(convertedValues[key]);
            }
        });
    
        return convertedValues;
    }
    export const getOpenDataEntryActions = ({ dataEntryId, itemId, formValues }) => {
        const convertedFormValues = convertFormValuesDates(formValues);
    
        return batchActions(
            [
                ...loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude),
                addFormData(`${dataEntryId}-${itemId}`, convertedFormValues),
            ],
            dataEntryActionTypes.OPEN_DATA_ENTRY_PROFILE_ACTION_BATCH,
        );
    };



