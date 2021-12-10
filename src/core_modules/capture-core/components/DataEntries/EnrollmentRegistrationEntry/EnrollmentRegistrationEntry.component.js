// @flow
import React, { type ComponentType } from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { compose } from 'redux';
import { useHistory } from 'react-router-dom';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { EnrollmentDataEntry } from '../Enrollment';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { Props, PlainProps } from './EnrollmentRegistrationEntry.types';
import { withSaveHandler } from '../../DataEntry';
import { withLoadingIndicator } from '../../../HOC';
import { InfoIconText } from '../../InfoIconText';
import { withErrorMessagePostProcessor } from '../withErrorMessagePostProcessor/withErrorMessagePostProcessor';
import { buildUrlQueryString } from '../../../utils/routing';
import { withDuplicateCheckOnSave } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import { pathnames } from '../../../utils/url';

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
    marginLeft: {
        marginLeft: typography.pxToRem(16),
    },
});

const translatedTextWithStylesForProgram = (trackedEntityName: string, programName: string, orgUnitName: string) => (<span>
    {i18n.t('Saving a {{trackedEntityName}} in {{programName}} in {{orgUnitName}}.', { trackedEntityName, programName, orgUnitName, interpolation: { escapeValue: false } })}
</span>);


const EnrollmentRegistrationEntryPlain =
  ({
      id,
      selectedScopeId,
      enrollmentMetadata,
      saveButtonText,
      classes,
      onSave,
      onPostProcessErrorMessage,
      ...rest
  }: PlainProps) => {
      const { push } = useHistory();

      const { scopeType, trackedEntityName, programName } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
      const orgUnit = useCurrentOrgUnitInfo();

      const navigateToWorkingListsPage = () => {
          const url =
            scopeType === scopeTypes.TRACKER_PROGRAM
                ?
                buildUrlQueryString(pathnames.MAIN_PAGE, { programId: selectedScopeId, orgUnitId: orgUnit.id })
                :
                buildUrlQueryString(pathnames.MAIN_PAGE, { orgUnitId: orgUnit.id });
          return push(url);
      };

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKER_PROGRAM && formId &&
                  <>
                      <EnrollmentDataEntry
                          orgUnit={orgUnit}
                          programId={selectedScopeId}
                          formFoundation={formFoundation}
                          enrollmentMetadata={enrollmentMetadata}
                          id={id}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future')}
                          onUpdateField={() => console.log('onUpdateField will be here in the future')}
                          onStartAsyncUpdateField={() => console.log('onStartAsyncUpdateField will be here in the future')}
                          {...rest}
                      />
                      <div className={classes.marginTop}>

                          {
                              onSave &&
                              <Button
                                  dataTest="create-and-link-button"
                                  primary
                                  onClick={onSave}
                              >
                                  {saveButtonText}
                              </Button>
                          }

                          <Button
                              dataTest="cancel-button"
                              secondary
                              onClick={navigateToWorkingListsPage}
                              className={classes.marginLeft}
                          >
                              {i18n.t('Cancel')}
                          </Button>
                      </div>

                      <InfoIconText>
                          {translatedTextWithStylesForProgram(trackedEntityName.toLowerCase(), programName, orgUnit.name)}
                      </InfoIconText>
                  </>
              }
          </>
      );
  };

export const EnrollmentRegistrationEntryComponent: ComponentType<Props> =
  compose(
      withErrorMessagePostProcessor(),
      withLoadingIndicator(() => ({ height: '350px' })),
      withDuplicateCheckOnSave(),
      withSaveHandler({ onGetFormFoundation: ({ enrollmentMetadata }) => enrollmentMetadata && enrollmentMetadata.enrollmentForm, onIsCompleting: () => true }),
      withStyles(styles),
  )(EnrollmentRegistrationEntryPlain);
