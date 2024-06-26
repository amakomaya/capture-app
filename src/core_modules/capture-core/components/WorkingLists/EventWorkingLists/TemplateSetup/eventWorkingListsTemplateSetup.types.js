// @flow
import type { Program } from '../../../../metaData';
import type {
    FiltersData,
    AddTemplate,
    UpdateTemplate,
    DeleteTemplate,
    WorkingListTemplates,
} from '../../WorkingListsBase';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsTemplates } from '../types';
import type { EventWorkingListsDataSourceSetupOutputProps } from '../DataSourceSetup';

type ExtractedProps = $ReadOnly<{|
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: Program,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
    templates?: EventWorkingListsTemplates,
|}>;

type RestProps = $Rest<EventWorkingListsDataSourceSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsTemplateSetupOutputProps = {|
    ...RestProps,
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: Program,
    onAddTemplate: AddTemplate,
    onUpdateTemplate: UpdateTemplate,
    onDeleteTemplate: DeleteTemplate,
    templates?: WorkingListTemplates,
    templateSharingType: string,
|};
