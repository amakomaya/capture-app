// @flow
import { useState } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES, QUERY_KEYS_BY_ENTITY_TYPE } from '../Changelog/Changelog.constants';
import type { Change, ChangelogRecord, ItemDefinitions, SortDirection } from '../Changelog/Changelog.types';
import { convertServerToClient } from '../../../../converters';
import { convert } from '../../../../converters/clientToList';
import { adToBs } from '@sbmdkl/nepali-date-converter';


type Props = {
    entityId: string,
    programId?: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = 'default';

export const useChangelogData = ({
    entityId,
    entityType,
    programId,
}: Props) => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

    const handleChangePageSize = (newPageSize: number) => {
        setPage(1);
        setPageSize(newPageSize);
    };

    const { data, isLoading, isError } = useApiDataQuery(
        ['changelog', entityType, entityId, 'rawData', { sortDirection, page, pageSize, programId }],
        {
            resource: `tracker/${QUERY_KEYS_BY_ENTITY_TYPE[entityType]}/${entityId}/changeLogs`,
            params: {
                page,
                pageSize,
                program: programId,
                ...{
                    order: sortDirection === DEFAULT_SORT_DIRECTION ? undefined : `createdAt:${sortDirection}`,
                },
            },
        },
        {
            enabled: !!entityId,
        },
    );

    const records: ?Array<ChangelogRecord> = useMemo(() => {
        if (!data) return undefined;

        return data.changeLogs.map((changelog) => {
            const { change: apiChange, createdAt, createdBy } = changelog;
            const elementKey = Object.keys(apiChange)[0];
            const change = apiChange[elementKey];

            const { metadataElement, fieldId } = getMetadataItemDefinition(
                elementKey,
                change,
                dataItemDefinitions,
            );

            if (!metadataElement) {
                log.error(errorCreator('Could not find metadata for element')({
                    ...changelog,
                }));
                return null;
            }

            const { firstName, surname, username } = createdBy;
            const { options } = metadataElement;

            const previousValue = convert(
                convertServerToClient(change.previousValue, metadataElement.type),
                metadataElement.type,
                options,
            );

            const currentValue = convert(
                convertServerToClient(change.currentValue, metadataElement.type),
                metadataElement.type,
                options,
            );
        

            return {
                reactKey: uuid(),
                date: adToBs(moment(fromServerDate(createdAt)).format('YYYY-MM-DD')) +' '+ moment(fromServerDate(createdAt)).format('HH:mm:ss'),
                user: `${firstName} ${surname} (${username})`,
                dataItemId: fieldId,
                changeType: changelog.type,
                dataItemLabel: metadataElement.name,
                previousValue,
                currentValue,
            };
        }).filter(Boolean);
    }, [data, dataItemDefinitions, fromServerDate]);

    return {
        rawRecords: data,
        pager: data?.pager,
        setPage,
        setPageSize: handleChangePageSize,
        sortDirection,
        setSortDirection,
        page,
        pageSize,
        isLoading,
        isError,
    };
};
