import { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { processErrorReports } from '../processErrorReports';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import moment from 'moment';
// import NepaliDate from 'nepali-date-converter';

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
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value.split('T')[0]);
};
const convertIfDateString = (value) => {
    if (isDateString(value)) {
        const convertedDate = bsToAd(value.split('T')[0]); // converting only the date part
        return convertedDate;

    }
    return value;
};

const convertNepaliToEnglishDate = (nepaliDateString) => {
    try {
        if (!isDateString(nepaliDateString)) {
            // console.error("Invalid Nepali date provided:", nepaliDateString);
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



export const useUpdateEnrollment = ({
    enrollment,
    setEnrollment,
    propertyName,
    updateHandler,
    onError,
}: {
    enrollment: any,
    setEnrollment: (enrollment: any) => void,
    propertyName: string,
    updateHandler?: (value: any) => void,
    onError?: (error: any) => void,
}) => {
    const [updateEnrollmentMutation] = useDataMutation(enrollmentUpdate, {
        onError: (e) => {
            setEnrollment(enrollment);
            updateHandler && updateHandler(enrollment[propertyName]);
            onError && onError(processErrorReports(e));
        },
    });

    // return useCallback((value: string) => {
        
    //     const updatedEnrollment = { ...enrollment };
    
    //     console.log(propertyName);
    //     if (propertyName === 'enrolledAt' || propertyName === 'occurredAt') {
    //         const englishDate = convertNepaliToEnglishDate(value);
    //         if (!englishDate) {
    //             console.error("Invalid Nepali date provided:", value);
    //             return;
    //         }
    //         updatedEnrollment[propertyName] = englishDate;
    //     } else {
    //         updatedEnrollment[propertyName] = value;
    //     }
    
    //     setEnrollment(updatedEnrollment);
    //     updateEnrollmentMutation(updatedEnrollment);
    //     updateHandler && updateHandler(value);
    // }, [enrollment, setEnrollment, propertyName, updateHandler, updateEnrollmentMutation]);
    return useCallback((value: string) => {
        const updatedEnrollment = { ...enrollment };
        updatedEnrollment[propertyName] = value;
        setEnrollment(updatedEnrollment);
        updateEnrollmentMutation(updatedEnrollment);
        updateHandler && updateHandler(value);
    }, [enrollment, setEnrollment, propertyName, updateHandler, updateEnrollmentMutation]);
    
};
