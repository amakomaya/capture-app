// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import type { EventReducerProps } from '../../../WidgetEnrollment/enrollment.types';
import { adToBs ,bsToAd} from '@sbmdkl/nepali-date-converter';
import { getTimeZone } from '../../../../../capture-core-utils/date/date.utils';

export const enrollmentSiteActionTypes = {
    COMMON_ENROLLMENT_SITE_DATA_SET: 'EnrollmentSite.SetCommonData',
    UPDATE_ENROLLMENT_DATE: 'Enrollment.UpdateEnrollmentDate',
    UPDATE_INCIDENT_DATE: 'Enrollment.UpdateIncidentDate',
    UPDATE_ENROLLMENT_EVENT: 'Enrollment.UpdateEnrollmentEvent',
    UPDATE_OR_ADD_ENROLLMENT_EVENTS: 'Enrollment.UpdateOrAddEnrollmentEvents',
    UPDATE_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.UpdateEnrollmentEventWithoutId',
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES: 'Enrollment.UpdateEnrollmentAttributeValues',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    ROLLBACK_ENROLLMENT_EVENTS: 'Enrollment.RollbackEnrollmentEvents',
    DELETE_ENROLLMENT_EVENT: 'Enrollment.DeleteEnrollmentEvent',
    DELETE_ENROLLMENT_EVENT_RELATIONSHIP: 'Enrollment.DeleteEnrollmentEventRelationship',
    UPDATE_ENROLLMENT_EVENT_STATUS: 'Enrollment.UpdateEnrollmentEventStatus',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENTS: 'Enrollment.CommitEnrollmentEvents',
    SAVE_FAILED: 'Enrollment.SaveFailed',
    ERROR_ENROLLMENT: 'Enrollment.ErrorEnrollment',
    ADD_PERSISTED_ENROLLMENT_EVENTS: 'Enrollment.AddPersistedEnrollmentEvents',
    UPDATE_ENROLLMENT_AND_EVENTS: 'Enrollment.UpdateEnrollmentAndEvents',
    ROLLBACK_ENROLLMENT_AND_EVENTS: 'Enrollment.RollbackEnrollmentAndEvents',
    COMMIT_ENROLLMENT_AND_EVENTS: 'Enrollment.CommitEnrollmentAndEvents',
    SET_EXTERNAL_ENROLLMENT_STATUS: 'Enrollment.SetExternalEnrollmentStatus',
};

const convertDateToBS = (dateString) => {
  try{
    //   const dateOnlyString = dateString.split('T')[0];
    //   console.log(dateString,'dateString')
    //   const timezone = getTimeZone(dateString);
    //   const nepaliDate = `${adToBs(dateOnlyString)}T${timezone}`;
    //   console.log(nepaliDate,'nepaliDate')
    //   return nepaliDate;
    if (dateString.includes('T')) {
        const [bsDate, timePart] = dateString.split('T'); 
        if (bsDate) {
            const adDate = adToBs(bsDate);
            const convertedDate = `${adDate}T${timePart}`;
            return convertedDate;
        }
    } else {
        const adDate = adToBs(dateString);
        const convertedDate = `${adDate}T00:00:00`;
        return convertedDate;
    }
  }

  catch(e){
      return dateString;
  }
  
};

const convertDateToAD = (dateString) => {
  try{
      const dateOnlyString = dateString.split('T')[0]; 
      const englishDate = bsToAd(dateOnlyString);
      return englishDate;
  }
  catch(e){
      return dateString;
  }  
  
};



const isDateString = (value) => {
  if (typeof value !== 'string') {
      return false; 
  }
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

const convertIfDateengString = (value) => {
  if (isDateString(value)) {
      const convertedDate = convertDateToAD(value);
      return convertedDate;
  }
  return value;
};

export const setCommonEnrollmentSiteData = (enrollment, attributeValues) => {4
  const convertEnrollmentDates = (enrollment) => {
      if (enrollment.enrolledAt) {
          enrollment.enrolledAt = convertIfDateString(enrollment.enrolledAt);
      }
      
      if (enrollment.occurredAt) {
          enrollment.occurredAt = convertIfDateString(enrollment.occurredAt);
      }

    //   if (enrollment.createdAt) {
    //       enrollment.createdAt = convertIfDateString(enrollment.createdAt);
    //   }
    //   if (enrollment.updatedAt) {
    //       enrollment.updatedAt = convertIfDateString(enrollment.updatedAt);
    //   }

      if (enrollment.events && enrollment.events.length > 0) {
          enrollment.events.forEach(event => {
              if (event.scheduledAt) {
                  event.scheduledAt = convertIfDateString(event.scheduledAt);
              } 
              if (event.occurredAt) {
                  event.occurredAt = convertIfDateString(event.occurredAt);
              }                
            //   if (event.createdAt) {
            //       event.createdAt = convertIfDateString(event.createdAt);
            //   }
            //   if (event.updatedAt) {
            //       event.updatedAt = convertIfDateString(event.updatedAt);
            //   }
            //   if (event.completedAt) {
            //       event.completedAt = convertIfDateString(event.completedAt);
            //   }
              if (event.dataValues && event.dataValues.length > 0) {
                  event.dataValues.forEach(dataValue => {
                    //   if (dataValue.createdAt) {
                    //       dataValue.createdAt = convertIfDateString(dataValue.createdAt);
                    //   }
                    //   if (dataValue.updatedAt) {
                    //       dataValue.updatedAt = convertIfDateString(dataValue.updatedAt);
                    //   }
                    if (dataValue.value){
                        dataValue.value = convertIfDateString(dataValue.value);

                    }
                  });
              }
          });
      }

      return enrollment;
  };

  enrollment = convertEnrollmentDates(enrollment);

  const convertAttributeValuesDates = (attributeValues) => {
      return attributeValues.map(attr => {
          if (isDateString(attr.value)) {
              attr.value = convertDateToBS(attr.value);
          }
          return attr;
      });
  };

  attributeValues = convertAttributeValuesDates(attributeValues);

  return actionCreator(enrollmentSiteActionTypes.COMMON_ENROLLMENT_SITE_DATA_SET)({ enrollment, attributeValues });
};
// export const setCommonEnrollmentSiteData = (enrollment: ApiEnrollment, attributeValues: ApiAttributeValues) =>{
//     console.log(enrollment,'enrollment')
//     return actionCreator(enrollmentSiteActionTypes.COMMON_ENROLLMENT_SITE_DATA_SET)({ enrollment, attributeValues });

// }

export const updateEnrollmentDate = (enrollmentDate: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_DATE)({
        enrollmentDate,
    });

export const updateIncidentDate = (incidentDate: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_INCIDENT_DATE)({
        incidentDate,
    });

export const updateEnrollmentEvent = (eventId: string, eventData: Object) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT)({
        eventId,
        eventData,
    });

export const rollbackEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT)({
        eventId,
    });

export const commitEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT)({
        eventId,
    });

    const convertDatesToGregorian = (events) => {
      return events.map(event => {
          if (event.occurredAt) {
              event.occurredAt = convertIfDateengString (event.occurredAt);
          }
          if (event.scheduledAt) {
              event.scheduledAt = convertIfDateengString (event.scheduledAt);
          }
          if (event.completedAt) {
              event.completedAt = convertIfDateengString (event.completedAt);
          }
          if (event.updatedAt) {
              event.updatedAt = convertIfDateengString (event.updatedAt);
          }
          return event;
      });
  };
  export const updateOrAddEnrollmentEvents = ({ events }: EventReducerProps) => {
    const convertedEvents = convertDatesToGregorian(events);
    return actionCreator(enrollmentSiteActionTypes.UPDATE_OR_ADD_ENROLLMENT_EVENTS)({ events: convertedEvents });
  };

export const deleteEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.DELETE_ENROLLMENT_EVENT)({ eventId });

export const deleteEnrollmentEventRelationship = (relationshipId: string) =>
    actionCreator(enrollmentSiteActionTypes.DELETE_ENROLLMENT_EVENT_RELATIONSHIP)({ relationshipId });

export const updateEnrollmentEventStatus = (eventId: string, status: string, updatedAt: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT_STATUS)({
        eventId,
        status,
        updatedAt,
    });

export const rollbackEnrollmentEvents = ({ events }: EventReducerProps) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENTS)({ events });

export const commitEnrollmentEvents = ({ events }: EventReducerProps) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENTS)({ events });

export const updateEnrollmentEventWithoutId = (uid: string, eventData: Object) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT_WITHOUT_ID)({
        eventData,
        uid,
    });

export const saveFailed = () => actionCreator(enrollmentSiteActionTypes.SAVE_FAILED)();


const isDateValue = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
// export const updateEnrollmentAttributeValues = (attributeValues) => {
//     const updatedAttributeValues = attributeValues.map(attr => {
//         if (isDateValue(attr.value)) {
//             console.log(attr.value,'attr.value')
//             return {
//                 ...attr,
//                 value: bsToAd(attr.value),
//             };
//         }
//         return attr;
//     });
//     return actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_ATTRIBUTE_VALUES)({
//         attributeValues:updatedAttributeValues,
//     });
// };
export const updateEnrollmentAttributeValues = (attributeValues: Array<{ [key: string]: string }>) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_ATTRIBUTE_VALUES)({
        attributeValues,
    });
export const showEnrollmentError = ({ message }: { message: string }) =>
    actionCreator(enrollmentSiteActionTypes.ERROR_ENROLLMENT)({
        message,
    });

export const updateEnrollmentAndEvents = (enrollment: ApiEnrollment) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_AND_EVENTS)({
        enrollment,
    });

export const rollbackEnrollmentAndEvents = (uid?: string) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_AND_EVENTS)({
        uid,
    });

export const commitEnrollmentAndEvents = (uid?: string, eventId?: string) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_AND_EVENTS)({
        uid,
        eventId,
    });

export const setExternalEnrollmentStatus = (status: string) =>
    actionCreator(enrollmentSiteActionTypes.SET_EXTERNAL_ENROLLMENT_STATUS)({
        status,
    });

export const addPersistedEnrollmentEvents = ({ events }: EventReducerProps) =>
    actionCreator(enrollmentSiteActionTypes.ADD_PERSISTED_ENROLLMENT_EVENTS)({ events });