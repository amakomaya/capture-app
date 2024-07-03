// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { adToBs } from '@sbmdkl/nepali-date-converter';
// import NepaliDate from 'nepali-date-converter';

// const convertDateToBS = (dateString) => {
//     try {
//         const [year, month, day] = dateString.split('-').map(Number);
//         const nepaliDate = NepaliDate.fromAD(new Date(year, month - 1, day)).format('YYYY-MM-DD');
//         return nepaliDate;
//     } catch (error) {
//         console.error("Error converting date to BS:", error);
//         return null;
//     }
// };
const convertDateToBS = (dateString) => {
    const nepaliDate = adToBs(dateString);
    return nepaliDate;
};

const isDateString = (value) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value);
};

const convertDatesInEnrollments = (enrollments) => {
    return enrollments.map(enrollment => ({
        ...enrollment,
        enrolledAt: isDateString(enrollment.enrolledAt) ? convertDateToBS(enrollment.enrolledAt) : enrollment.enrolledAt,
        occurredAt: isDateString(enrollment.occurredAt) ? convertDateToBS(enrollment.occurredAt) : enrollment.occurredAt,
        events: enrollment.events.map(event => ({
            ...event,
            scheduledAt: isDateString(event.scheduledAt) ? convertDateToBS(event.scheduledAt) : event.scheduledAt
        })),
        attributes: convertDatesInAttributes(enrollment.attributes)
    }));
};


const convertDatesInAttributes = (enrollments) => {
    if (!enrollments) {
        return [];
    }

    return enrollments.map(enrollment => ({
        ...enrollment,
        attributes: enrollment.attributes && enrollment.attributes.map(attribute => ({
            ...attribute,
            value: attribute.valueType === 'AGE' && isDateString(attribute.value) ? convertDateToBS(attribute.value) : attribute.value
        }))
    }));
};



export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `tracker/trackedEntities/${teiId}`,
                    params: {
                        fields: ['programOwners[orgUnit],enrollments'],
                        program: [programId],
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    let processedData = [];
    if (data) {
        processedData = {
            ...data,
            trackedEntityInstances: {
                ...data.trackedEntityInstances,
                enrollments: convertDatesInEnrollments(data.trackedEntityInstances.enrollments),
            }
        };
    }

    return {
        error,
        refetch,
        ownerOrgUnit: !loading && processedData?.trackedEntityInstances?.programOwners[0]?.orgUnit,
        enrollments: !loading && processedData?.trackedEntityInstances ? processedData?.trackedEntityInstances?.enrollments : [],
    };
};
