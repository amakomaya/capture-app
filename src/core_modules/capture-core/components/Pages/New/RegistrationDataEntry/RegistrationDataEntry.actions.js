// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import { effectMethods } from '../../../../trackerOffline';
import type {
    EnrollmentPayload,
} from '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type {
    TeiPayload,
} from '../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';
import { bsToAd } from '@sbmdkl/nepali-date-converter';


export const registrationFormActionTypes = {
    NEW_TRACKED_ENTITY_INSTANCE_SAVE_START: 'StartSavingNewTrackedEntityInstance',
    NEW_TRACKED_ENTITY_INSTANCE_SAVE: 'SaveNewTrackedEntityInstance',
    NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED: 'CompleteSavingNewTrackedEntityInstance',
    NEW_TRACKED_ENTITY_INSTANCE_SAVE_FAILED: 'FailSavingNewTrackedEntityInstance',

    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START: 'StartSavingNewTrackedEntityInstanceWithEnrollment',
    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE: 'SaveNewTrackedEntityInstanceWithEnrollment',
    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED: 'CompleteSavingNewTrackedEntityInstanceWithEnrollment',
    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED: 'FailSavingNewTrackedEntityInstanceWithEnrollment',
};

// without enrollment
export const startSavingNewTrackedEntityInstance = (teiPayload: TeiPayload) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START)({ teiPayload });

export const saveNewTrackedEntityInstance = (candidateForRegistration: any) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE)(
        { ...candidateForRegistration },
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: candidateForRegistration,
                },
                commit: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED,
                },
                rollback: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_FAILED,
                },
            },
        },
    );

// with enrollment
export const startSavingNewTrackedEntityInstanceWithEnrollment = (enrollmentPayload: EnrollmentPayload, uid: string) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START)({
        enrollmentPayload,
        uid,
    });

export const saveNewTrackedEntityInstanceWithEnrollment = ({
    candidateForRegistration,
    redirectTo,
    uid,
    stageId,
    eventIndex,
}: {
    candidateForRegistration: any,
    redirectTo: string,
    uid: string,
    stageId?: string,
    eventIndex: number,
}) => {
    const convertDateToAD = (dateString) => {
        const englishDate = bsToAd(dateString);
        return englishDate;
    };

    const isDateString = (value) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        return datePattern.test(value);
    };

    const modifyDatesInAttributes = (attributes) => {
        return attributes.map(attr => {
            if (isDateString(attr.value)) {
                return {
                    ...attr,
                    value: convertDateToAD(attr.value)
                };
            }
            return attr;
        });
    };

    const modifyDatesInEnrollments = (enrollments) => {
        return enrollments.map(enrollment => {
            if (isDateString(enrollment.enrolledAt)) {
                enrollment.enrolledAt = convertDateToAD(enrollment.enrolledAt);
            }
            if (isDateString(enrollment.occurredAt)) {
                enrollment.occurredAt = convertDateToAD(enrollment.occurredAt);
            }
            enrollment.attributes = modifyDatesInAttributes(enrollment.attributes);
            enrollment.events = enrollment.events.map(event => {
                if (isDateString(event.scheduledAt)) {
                    event.scheduledAt = convertDateToAD(event.scheduledAt);
                }
                if (isDateString(event.occurredAt)) {
                    event.occurredAt = convertDateToAD(event.occurredAt);
                }
                return event;
            });
            return enrollment;
        });
    };

    const modifyCandidateForRegistrationData = (data) => {
        return data.map(entity => {
            entity.attributes = modifyDatesInAttributes(entity.attributes);
            entity.enrollments = modifyDatesInEnrollments(entity.enrollments);
            return entity;
        });
    };

    candidateForRegistration.trackedEntities = modifyCandidateForRegistrationData(candidateForRegistration.trackedEntities);

    return actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE)(
        { ...candidateForRegistration },
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: candidateForRegistration,
                },
                commit: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED,
                    meta: { redirectTo, stageId, uid, eventIndex },
                },
                rollback: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED,
                },
            },
        }
    );
};
