// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useEffect } from 'react';
// $FlowFixMe
import { useSelector, useDispatch } from 'react-redux';
import { setCommonEnrollmentSiteData } from './enrollment.actions';

export const useCommonEnrollmentDomainData = (teiId: string, enrollmentId: string, programId: string) => {
    const dispatch = useDispatch();

    const {
        enrollmentId: storedEnrollmentId,
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
    } = useSelector(({ enrollmentDomain }) => enrollmentDomain);

    const { data, error, refetch } = useDataQuery({
        trackedEntityInstance: {
            resource: 'trackedEntityInstances',
            id: ({ variables: { teiId: updatedTeiId } }) => updatedTeiId,
            params: ({ variables: { programId: updatedProgramId } }) => ({
                program: updatedProgramId,
                fields: ['enrollments[*],attributes'],
            }),
        },
    }, {
        lazy: true,
    });

    const fetchedEnrollmentData = {
        reference: data,
        enrollment: data?.trackedEntityInstance?.enrollments
            ?.find(enrollment => enrollment.enrollment === enrollmentId),
        attributeValues: data?.trackedEntityInstance?.attributes,
    };

    useEffect(() => {
        if (fetchedEnrollmentData.reference) {
            dispatch(setCommonEnrollmentSiteData(
                fetchedEnrollmentData.enrollment,
                fetchedEnrollmentData.attributeValues
                    .map(({ attribute, value }) => ({ id: attribute, value })),
            ));
        }
    }, [
        dispatch,
        fetchedEnrollmentData.reference,
        fetchedEnrollmentData.enrollment,
        fetchedEnrollmentData.attributeValues,
    ]);

    useEffect(() => {
        if (storedEnrollmentId !== enrollmentId) {
            refetch({ variables: { teiId, programId } });
        }
    }, [refetch, storedEnrollmentId, enrollmentId, teiId, programId]);

    const inEffectData = enrollmentId === storedEnrollmentId ? {
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
    } : { enrollment: undefined, attributeValues: undefined };

    return {
        error,
        ...inEffectData,
    };
};
