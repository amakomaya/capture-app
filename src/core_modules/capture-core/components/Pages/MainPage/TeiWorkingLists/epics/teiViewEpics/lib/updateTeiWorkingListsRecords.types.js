// @flow
import type { FiltersData } from '../../../../WorkingLists';
import type { TeiColumnsMetaForDataFetching } from '../../../types';
import type { SingleResourceQuery } from '../../../../../../../utils/api';

export type Input = {
    page: number,
    pageSize: number,
    programId: string,
    orgUnitId: string,
    filters: FiltersData,
    sortById: string,
    sortByDirection: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
};
