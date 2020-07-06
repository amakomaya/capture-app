// @flow
import type { AvailableSearchOptions } from '../SearchPage.types';

export type OwnProps = {|
  +availableSearchOptions: AvailableSearchOptions,
  +selectedOptionId?: string,
  +classes: {|
    +searchDomainSelectorSection: string,
    +searchButtonContainer: string,
    +searchRow: string,
    +searchRowSelectElement: string,
    +textWarning: string,
  |},
|}

export type PropsFromRedux ={|
  +searchStatus: string,
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +formsValues: {
    [elementId: string]: any
  },
  +searchStatus: string,
|}

export type DispatchersFromRedux = {|
  searchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

