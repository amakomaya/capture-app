// @flow
/* eslint-disable */
import type { Store } from 'redux';

declare type D2 = {
    models: Object,
    system: {
        settings: {
            all: () => Object,
        }
    },
    i18n: Object,
    Api: {
        getApi: () => Object
    }
};

// Redux
declare type ReduxAction = {
    type: string,
    payload?: any,
    meta?: any,
};

declare type ReduxState = Object;
declare type ReduxDispatch = (action: {
    type: string,
    [props: string]: any,
}) => void;

declare type ReduxStore = {
    getState: () => ReduxState,
    dispatch: ReduxDispatch
}

// Events
declare type Event = {
    eventId: string,
    programId: string,
    programStageId: string,
    orgUnitId: string,
    orgUnitName: string,
    trackedEntityInstanceId: string,
    enrollmentId: string,
    enrollmentStatus: string,
    status: string,
    eventDate: string,
    dueDate: string,
};

declare type UiEventData = {
    target: {
        value: any
    }
};

declare type Theme = {
    palette: Object,
    typography: {
        pxToRem: (size: number) => string,
    }
};

//ProgramRules
declare type ProgramRuleAction = {
    dataElement: {
        id?: ?string,
    },
    programRuleActionType: string,
    programStage: {
        id?: ?string,
    },
    programStageSection: {
        id?: ?string,
    },
    trackedEntityAttribute: {
        id?: ?string,
    }
};

declare type ProgramRule = {
    id: string,
    condition: string,
    description: string,
    displayName: string,
    program: {
        id: string,
    },
    programRuleActions: Array<ProgramRuleAction>,
};


declare type ProgramRuleVariable = {
    dataElement: {
        id?: ?string,
    },
    trackedEntityAttribute: {
        id?: ?string,
    },
    displayName: string,
    program: {
        id: string,
    },
    programStage: {
        id?: ?string,
    },
    programRuleVariableSourceType: string,
}; 