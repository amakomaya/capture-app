// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { adToBs } from '@sbmdkl/nepali-date-converter';
// import NepaliDate from 'nepali-date-converter';



export const enrollmentPageActionTypes = {
    PAGE_OPEN: 'EnrollmentPage.Open',
    PAGE_CLOSE: 'EnrollmentPage.Close',

    PROCESS_ENROLLMENT_ID: 'EnrollmentPage.EnrollmentUrlIdUpdated',
    RESET_ENROLLMENT_ID: 'EnrollmentPage.ResetEnrollmentId',
    FETCH_ENROLLMENT_ID: 'EnrollmentPage.FetchEnrollmentId',
    VERIFY_ENROLLMENT_ID_SUCCESS: 'EnrollmentPage.VerifyEnrollmentIdSuccess',
    FETCH_ENROLLMENT_ID_SUCCESS: 'EnrollmentPage.FetchEnrollmentIdSuccess',
    FETCH_ENROLLMENT_ID_ERROR: 'EnrollmentPage.FetchEnrollmentIdError',

    PROCESS_TEI_ID: 'EnrollmentPage.TeiUrlIdUpdated',
    RESET_TEI_ID: 'EnrollmentPage.ResetTeiId',
    FETCH_TEI: 'EnrollmentPage.FetchTei',
    VERIFY_FETCH_TEI_SUCCESS: 'EnrollmentPage.VerifyFetchTeiSuccess',
    FETCH_TEI_SUCCESS: 'EnrollmentPage.FetchTeiSuccess',
    FETCH_TEI_ERROR: 'EnrollmentPage.FetchTeiError',

    PROCESS_PROGRAM_ID: 'EnrollmentPage.ProgramUrlIdUpdated',
    COMMIT_TRACKER_PROGRAM_ID: 'EnrollmentPage.CommitTrackerProgramId',
    COMMIT_NON_TRACKER_PROGRAM_ID: 'EnrollmentPage.CommitNonTrackerProgramId',
    PROGRAM_ID_ERROR: 'EnrollmentPage.ProgramIdError',

    FETCH_ENROLLMENTS: 'EnrollmentPage.FetchEnrollments',
    VERIFY_FETCHED_ENROLLMENTS: 'EnrollmentPage.VerifyFetchedEnrollments',
    FETCH_ENROLLMENTS_ERROR: 'EnrollmentPage.FetchEnrollmentsError',
    FETCH_ENROLLMENTS_SUCCESS: 'EnrollmentPage.FetchEnrollmentsSuccess',

    DEFAULT_VIEW: 'EnrollmentPage.DefaultView',
    LOADING_VIEW: 'EnrollmentPage.LoadingView',
    MISSING_MESSAGE_VIEW: 'EnrollmentPage.MissingMessageView',
    ERROR_VIEW: 'EnrollmentPage.ErrorView',
    CLEAR_ERROR_VIEW: 'EnrollmentPage.ClearErrorView',

    DELETE_ENROLLMENT: 'EnrollmentPage.DeleteEnrollment',
    UPDATE_TEI_DISPLAY_NAME: 'EnrollmentPage.UpdateTeiDisplayName',
    UPDATE_ENROLLMENT_DATE: 'EnrollmentPage.UpdateEnrollmentDate',
};


type IdSuite = {
    teiId?: ?string,
    programId?: ?string,
};

const convertDateToBS = (dateString) => {
    const dateOnlyString = dateString.split('T')[0];
    const nepaliDate = adToBs(dateOnlyString);
    return nepaliDate;
};



const isDateString = (value) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value.split('T')[0]);
};

const convertIfDateString = (value) => {
    if (isDateString(value)) {
        const convertedDate = convertDateToBS(value);
        return convertedDate;
    }
    return value;
};


export const openEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.PAGE_OPEN)();

export const closeEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.PAGE_CLOSE)();

// enrollmentId
export const changedEnrollmentId = (enrollmentId: ?string) =>
    actionCreator(enrollmentPageActionTypes.PROCESS_ENROLLMENT_ID)(enrollmentId);

export const resetEnrollmentId = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.RESET_ENROLLMENT_ID)(payload);

export const fetchEnrollmentId = (enrollmentId: string) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID)({ enrollmentId });

export const verifyEnrollmentIdSuccess = ({ enrollmentId, trackedEntity, program }: Object) =>
    actionCreator(enrollmentPageActionTypes.VERIFY_ENROLLMENT_ID_SUCCESS)({ enrollmentId, teiId: trackedEntity, programId: program });

export const fetchEnrollmentIdSuccess = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS)(payload);

export const fetchEnrollmentIdError = (enrollmentId: string) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_ERROR)({ enrollmentId });

// teiId
export const changedTeiId = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.PROCESS_TEI_ID)(payload);

export const resetTeiId = () =>
    actionCreator(enrollmentPageActionTypes.RESET_TEI_ID)();

export const fetchTei = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.FETCH_TEI)(payload);

export const verifyFetchTeiSuccess = (payload: { ...IdSuite, teiDisplayName: string, tetId: string }) =>
    actionCreator(enrollmentPageActionTypes.VERIFY_FETCH_TEI_SUCCESS)(payload);

export const fetchTeiSuccess = (payload: { ...IdSuite, teiDisplayName: string, tetId: string }) =>
    actionCreator(enrollmentPageActionTypes.FETCH_TEI_SUCCESS)(payload);

export const fetchTeiError = (teiId: string) =>
    actionCreator(enrollmentPageActionTypes.FETCH_TEI_ERROR)({ teiId });

// programId
export const changedProgramId = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.PROCESS_PROGRAM_ID)(payload);

export const commitTrackerProgramId = (programId: string) =>
    actionCreator(enrollmentPageActionTypes.COMMIT_TRACKER_PROGRAM_ID)({ programId });

export const commitNonTrackerProgramId = (programId: string) =>
    actionCreator(enrollmentPageActionTypes.COMMIT_NON_TRACKER_PROGRAM_ID)({ programId });

export const programIdError = (programId: string) =>
    actionCreator(enrollmentPageActionTypes.PROGRAM_ID_ERROR)({ programId });

// enrollments
export const fetchEnrollments = () =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENTS)();

// export const verifyFetchedEnrollments = ({ teiId, programId, action }: Object) =>
//     actionCreator(enrollmentPageActionTypes.VERIFY_FETCHED_ENROLLMENTS)({ teiId, programId, action });
export const verifyFetchedEnrollments = ({ teiId, programId, action }) => {
    // Assuming action.payload contains enrollments array similar to the provided example
    const convertEnrollmentDates = (enrollment) => {
        if (enrollment.enrolledAt) {
            enrollment.enrolledAt = convertIfDateString(enrollment.enrolledAt);
        }

        if (enrollment.occurredAt) {
            enrollment.occurredAt = convertIfDateString(enrollment.occurredAt);
        }

        if (enrollment.createdAt) {
            enrollment.createdAt = convertIfDateString(enrollment.createdAt);
        }

        if (enrollment.updatedAt) {
            enrollment.updatedAt = convertIfDateString(enrollment.updatedAt);
        }
        
    
        if (enrollment.events && enrollment.events.length > 0) {
            enrollment.events.forEach(event => {
                if (event.scheduledAt) {
                    event.scheduledAt = convertIfDateString(event.scheduledAt);
                } 
                if (event.occurredAt) {
                    event.occurredAt = convertIfDateString(event.occurredAt);
                }                
                if (event.createdAt) {
                    event.createdAt = convertIfDateString(event.createdAt);
                }
                if (event.updatedAt) {
                    event.updatedAt = convertIfDateString(event.updatedAt);
                }
                if (event.completedAt) {
                    event.completedAt = convertIfDateString(event.completedAt);
                }
                if (event.dataValues && event.dataValues.length > 0) {
                    event.dataValues.forEach(dataValue => {
                        if (dataValue.createdAt) {
                            dataValue.createdAt = convertIfDateString(dataValue.createdAt);
                        }
                        if (dataValue.updatedAt) {
                            dataValue.updatedAt = convertIfDateString(dataValue.updatedAt);
                        }
                    });
                }
                return event;
            });
        }
        
        if (enrollment.attributes && enrollment.attributes.length > 0) {
            enrollment.attributes = enrollment.attributes.forEach(attributes => {
                if (isDateString(attributes.value)) {
                    attributes.value = convertDateToBS(attributes.value);
                }
                if (isDateString(attributes.createdAt)) {
                    attributes.createdAt = convertDateToBS(attributes.createdAt);
                }
                if (isDateString(attributes.updatedAt)) {
                    attributes.updatedAt = convertDateToBS(attributes.updatedAt);
                }
                return attributes;
            });
        }

        return enrollment;
    };

    // Convert dates in the action.payload if necessary
    // This part depends on the actual structure of your action.payload
    // You might need to adjust this based on how your data is structured

    return actionCreator(enrollmentPageActionTypes.VERIFY_FETCHED_ENROLLMENTS)({
        teiId,
        programId,
        action: {
            type: 'EnrollmentPage.FetchEnrollmentsSuccess',
            payload: {
                enrollments: action.payload.enrollments.map(convertEnrollmentDates),
            },
        },
    });
};


export const fetchEnrollmentsError = ({ accessLevel }: { accessLevel: string }) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENTS_ERROR)({ accessLevel });

export const saveEnrollments = ({ enrollments }: any) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENTS_SUCCESS)({ enrollments });

// Page status
export const showDefaultViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.DEFAULT_VIEW)();

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.LOADING_VIEW)();

export const showMissingMessageViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.MISSING_MESSAGE_VIEW)();

export const showErrorViewOnEnrollmentPage = ({ error }: { error: string }) =>
    actionCreator(enrollmentPageActionTypes.ERROR_VIEW)({ error });

export const clearErrorView = () =>
    actionCreator(enrollmentPageActionTypes.CLEAR_ERROR_VIEW)();

// Mutations
export const deleteEnrollment = ({ enrollmentId }: { enrollmentId: string }) =>
    actionCreator(enrollmentPageActionTypes.DELETE_ENROLLMENT)({
        enrollmentId,
    });

export const updateTeiDisplayName = (teiDisplayName: string) =>
    actionCreator(enrollmentPageActionTypes.UPDATE_TEI_DISPLAY_NAME)({
        teiDisplayName,
    });

export const updateEnrollmentDate = ({ enrollmentId, enrollmentDate }: { enrollmentId: string, enrollmentDate: string }) =>
    actionCreator(enrollmentPageActionTypes.UPDATE_ENROLLMENT_DATE)({ enrollmentId, enrollmentDate });
