// @flow
import { useDataMutation, type QueryRefetchFunction } from '@dhis2/app-runtime';
import { useRef } from 'react';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import moment from 'moment';

const enrollmentUpdate = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: enrollment => ({
        enrollments: [convertToNepali(enrollment)],   
     }),
};
const convertToNepali = (enrollment) => {
    return {
        ...enrollment,
        enrolledAt: convertNepaliToEnglishDate(enrollment.enrolledAt),
        occurredAt: convertNepaliToEnglishDate(enrollment.occurredAt)
    };
};
const isDateString = (value) => {
    if (typeof value !== 'string') {
        return false; // Return false if value is not a string
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value.split('T')[0]); 
};
const convertIfDateString = (value) => {
    if (isDateString(value)) {
        const convertedDate = bsToAd(value);
        return convertedDate;

    }
    return value;
};

const convertNepaliToEnglishDate = (nepaliDateString) => {
    try {
        if (!isDateString(nepaliDateString)) {
            return null;
        }
        const convertedDate = convertIfDateString(nepaliDateString);
        if (moment(convertedDate).isValid()) {
            return moment(convertedDate).format('YYYY-MM-DDTHH:mm:ss.SSS');
        } else {
            console.error("Invalid English date after conversion:", convertedDate);
            return null;
        }
    } catch (error) {
        console.error("Error converting Nepali date to English:", error);
        return null;
    }
};

const enrollmentDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: enrollment => ({
        enrollments: [enrollment],
    }),
};

const processErrorReports = (error) => {
    // $FlowFixMe[prop-missing]
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc, errorReport) => `${acc} ${errorReport.message}`, '')
        : error.message;
};


export const useUpdateEnrollment = (
    refetchEnrollment: QueryRefetchFunction,
    refetchTEI: QueryRefetchFunction,
    onError?: ?(message: string) => void,
    onSuccess?: ({redirect?: boolean}) => void,
) => {
    const redirect: {current: boolean} = useRef(false);
    const changeRedirect = (value: boolean) => (redirect.current = value);

    const [updateMutation, { loading: updateLoading }] = useDataMutation(
        enrollmentUpdate,
        {
            onComplete: () => {
                refetchEnrollment();
                refetchTEI();
                onSuccess && onSuccess({ redirect: redirect.current });
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    return {
        updateMutation, updateLoading, changeRedirect,
    };
};

export const useDeleteEnrollment = (
    onDelete: () => void,
    onError?: ?(message: string) => void,
    onSuccess?: () => void,
) => {
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(
        enrollmentDelete,
        {
            onComplete: () => {
                onDelete();
                onSuccess && onSuccess();
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    return { deleteMutation, deleteLoading };
};

