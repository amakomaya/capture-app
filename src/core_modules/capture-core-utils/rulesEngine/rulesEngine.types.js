// @flow
import { typeof effectActions } from './effectActions.const';

export type OutputEffect = {
    type: $Values<effectActions>,
    id: string,
    isDataElementId?: boolean, // false => TEAid, undefined => neither
};

export type OutputEffects = Array<OutputEffect>;

export type AssignOutputEffect = OutputEffect & {
    value: any,
};

export type HideOutputEffect = OutputEffect & {

};

export type MessageEffect = OutputEffect & {
    message: string,
};

export type GeneralErrorEffect = OutputEffect & {
    error: { id: string, message: string },
};

export type GeneralWarningEffect = OutputEffect & {
    warning: { id: string, message: string },
};

export type CompulsoryEffect = OutputEffect & {

};

export type ProgramRuleEffect = {
    id: string,
    location: ?string,
    action: string,
    dataElementId: ?string,
    trackedEntityAttributeId: ?string,
    programStageId: ?string,
    programStageSectionId: ?string,
    optionGroupId: ?string,
    optionId: ?string,
    content: string,
    data: ?string,
    style?: ?Object,
};

export type ProgramRuleAction = {
    id: string,
    content: string,
    data: ?string,
    location: ?string,
    programRuleActionType: string,
    dataElementId?: ?string,
    programStageId?: ?string,
    programStageSectionId?: ?string,
    trackedEntityAttributeId?: ?string,
    programRuleVariableId?: ?string,
    optionGroupId: ?string,
    optionId: ?string,
    style?: ?Object,
};

export type ProgramRule = {
    id: string,
    name: string,
    priority: number,
    condition: string,
    description?: ?string,
    displayName: string,
    programId: string,
    programStageId?: ?string,
    programRuleActions: Array<ProgramRuleAction>,
};

export type ProgramRuleVariable = {
    id: string,
    displayName: string,
    programRuleVariableSourceType: string,
    programId: string,
    dataElementId?: ?string,
    trackedEntityAttributeId?: ?string,
    programStageId?: ?string,
    useNameForOptionSet?: ?boolean,
};

type Option = {
    id: string,
    code: string,
    displayName: string,
};

export type OptionSet = {
    id: string,
    displayName: string,
    options: Array<Option>,
};

export type OptionSets = {
    [id: string]: OptionSet,
}

type Constant = {
    id: string,
    displayName: string,
    value: any,
};

export type Constants = Array<Constant>;

export type ProgramRulesContainer = {
    programRulesVariables: ?Array<ProgramRuleVariable>,
    programRules: ?Array<ProgramRule>,
    constants?: ?Constants,
};

type EventMain = {
    eventId?: string,
    programId?: string,
    programStageId?: string,
    orgUnitId?: string,
    orgUnitName?: string,
    trackedEntityInstanceId?: string,
    enrollmentId?: string,
    enrollmentStatus?: string,
    status?: string,
    eventDate?: string,
    dueDate?: string,
};

export type EventValues = {
    [elementId: string]: any,
};

export type EventData = EventValues & EventMain;

export type EventsData = Array<EventData>;

export type EventsDataContainer = {
    all: EventsData,
    byStage: { [stageId: string]: EventsData },
};

export type DataElement = {
    id: string,
    valueType: string,
    optionSetId?: ?string,
};

export type DataElements = { [elementId: string]: DataElement };

export type RuleVariable = {
    variableValue: any,
    useCodeForOptionSet: boolean,
    variableType: string,
    hasValue: boolean,
    variableEventDate: ?string,
    variablePrefix: string,
    allValues: ?Array<any>,
};

export type RuleVariables = { [string]: RuleVariable };

export type TrackedEntityAttribute = {
    id: string,
    valueType: string,
    optionSetId?: ?string,
};

export type TrackedEntityAttributes = {
    [id: string]: TrackedEntityAttribute
};

export type Enrollment = {
    enrollmentDate?: ?string,
    incidentDate?: ?string,
    enrollmentId?: ?string,
};

export type TEIValues = {
    [attributeId: string]: any,
};

export type OrgUnit = {
    id: string,
    name: string,
};

export type RulesEngineInput = {|
    programRulesContainer: ProgramRulesContainer,
    currentEvent: ?EventData,
    eventsContainer: ?EventsDataContainer,
    dataElements: ?DataElements,
    selectedEntity: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    selectedEnrollment: ?Enrollment,
    selectedOrgUnit: OrgUnit,
    optionSets: OptionSets,
|}

export type Translator = (value: string) => string;

export interface IDateUtils {
    getToday(): string;
    daysBetween(firstRulesDate: string, secondRulesDate: string): number;
    weeksBetween(firstRulesDate: string, secondRulesDate: string): number;
    monthsBetween(firstRulesDate: string, secondRulesDate: string): number;
    yearsBetween(firstRulesDate: string, secondRulesDate: string): number;
    compareDates(firstRulesDate: string, secondRulesDate: string): number;
    addDays(rulesDate: string, daysToAdd: string): string;
}

export interface IConvertInputRulesValue {
    convertText(value: any): string;
    convertLongText(value: any): string;
    convertLetter(value: any): string;
    convertPhoneNumber(value: any): string;
    convertEmail(value: any): string;
    convertBoolean(value: any): boolean | string;   // Yes/No
    convertTrueOnly(value: any): boolean | string;  // Yes Only
    convertDate(value: any): string;
    convertDateTime(value: any): string;
    convertTime(value: any): string;
    convertNumber(value: any): number | string;
    convertUnitInterval(value: any): number | string;
    convertPercentage(value: any): number | string;
    convertInteger(value: any): number | string;
    convertIntegerPositive(value: any): number | string;
    convertIntegerNegative(value: any): number | string;
    convertIntegerZeroOrPositive(value: any): number | string;
    convertTrackerAssociate(value: any): string;
    convertUserName(value: any): string;
    convertCoordinate(value: any): string;
    convertOrganisationUnit(value: any): string;
    convertAge(value: any): number | string;
    convertUrl(value: any): string;
    convertFile(value: any): string;
    convertImage(value: any): string;
}

export interface IConvertOutputRulesEffectsValue {
    convertText(value: string): any;
    convertLongText(value: string): any;
    convertLetter(value: string): any;
    convertPhoneNumber(value: string): any;
    convertEmail(value: string): any;
    convertBoolean(value: boolean): any;   // Yes/No
    convertTrueOnly(value: boolean): any;  // Yes Only
    convertDate(value: string): any;
    convertDateTime(value: string): any;
    convertTime(value: string): any;
    convertNumber(value: number): any;
    convertUnitInterval(value: number): any;
    convertPercentage(value: number): any;
    convertInteger(value: number): any;
    convertIntegerPositive(value: number): any;
    convertIntegerNegative(value: number): any;
    convertIntegerZeroOrPositive(value: number): any;
    convertTrackerAssociate(value: string): any;
    convertUserName(value: string): any;
    convertCoordinate(value: string): any;
    convertOrganisationUnit(value: string): any;
    convertUrl(value: string): any;
    convertAge(value: string): any;
    convertFile(value: string): any;
    convertImage(value: string): any;
}

export type D2FunctionParameters = {
    name: string,
    parameters?: number,
    dhisFunction: any
}
export type D2Functions = {
    'd2:ceil': D2FunctionParameters,
    'd2:floor': D2FunctionParameters,
    'd2:round': D2FunctionParameters,
    'd2:modulus': D2FunctionParameters,
    'd2:zing': D2FunctionParameters,
    'd2:oizp': D2FunctionParameters,
    'd2:concatenate': D2FunctionParameters,
    'd2:daysBetween': D2FunctionParameters,
    'd2:weeksBetween': D2FunctionParameters,
    'd2:monthsBetween': D2FunctionParameters,
    'd2:yearsBetween': D2FunctionParameters,
    'd2:addDays': D2FunctionParameters,
    'd2:count': D2FunctionParameters,
    'd2:countIfValue': D2FunctionParameters,
    'd2:countIfZeroPos': D2FunctionParameters,
    'd2:hasValue': D2FunctionParameters,
    // d2:zpvc(<object>, <object>, ...)
    'd2:validatePattern': D2FunctionParameters,
    'd2:left': D2FunctionParameters,
    'd2:right': D2FunctionParameters,
    'd2:substring': D2FunctionParameters,
    'd2:split': D2FunctionParameters,
    'd2:length': D2FunctionParameters,
    // d2:inOrgUnitGroup(<orgunit_group_code>)
    // d2:hasUserRole(<user_role>)
    'd2:zScoreWFA': D2FunctionParameters,
    // d2:zScoreHFA(<ageInMonth>, <height>, <gender>)
    // d2:zScoreWFH(<height>, <weight>, <gender>)

    // Functions that are not available in program rule expressions
    'd2:lastEventDate': D2FunctionParameters,
    'd2:addControlDigits': D2FunctionParameters,
    'd2:checkControlDigits': D2FunctionParameters,
}

export type Flag = {
    debug: boolean
}
