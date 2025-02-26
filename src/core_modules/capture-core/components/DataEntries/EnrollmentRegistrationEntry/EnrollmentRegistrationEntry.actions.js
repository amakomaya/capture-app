// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { adToBs } from '@sbmdkl/nepali-date-converter';

export const enrollmentRegistrationEntryActionTypes = {
    TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForEnrollmentRegistrationForm',
};

const convertDateToBS = dateString => {
    if (typeof dateString === 'string') {
      const dateOnlyString = dateString.split('T')[0];
      const nepaliDate = adToBs(dateOnlyString);
      return nepaliDate;
    }
    return dateString;
  };
  function convertFormValuesDates(formValues) {
    const convertedValues = {
      ...formValues
    };
    Object.keys(convertedValues).forEach(key => {
      if (typeof convertedValues[key] === 'object' && convertedValues[key] !== null) {
        convertedValues[key] = convertFormValuesDates(convertedValues[key]);
      } else if (typeof convertedValues[key] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(convertedValues[key])) {
        convertedValues[key] = convertDateToBS(convertedValues[key]);
      }
    });
    return convertedValues;
  }
  export const startNewEnrollmentDataEntryInitialisation = _ref => {
    let {
      selectedOrgUnit,
      selectedScopeId,
      dataEntryId,
      formValues,
      clientValues,
      programCategory,
      firstStage,
      formFoundation
    } = _ref;
    const convertedFormValues = convertFormValuesDates(formValues);
    return actionCreator(enrollmentRegistrationEntryActionTypes.TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START)({
      selectedOrgUnit,
      selectedScopeId,
      dataEntryId,
      formValues: convertedFormValues,
      clientValues,
      programCategory,
      firstStage,
      formFoundation
    });
  };
