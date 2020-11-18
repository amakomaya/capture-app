// @flow
import React, { useMemo } from 'react';
import {
    ListViewBuilderContext,
} from '../../workingLists.context';
import type { Props } from './workingListsListViewBuilderContextProvider.types';

export const WorkingListsListViewBuilderContextProvider = ({
    updating,
    updatingWithDialog,
    dataSource,
    onSelectListRow,
    onSortList,
    onSetListColumnOrder,
    customRowMenuContents,
    onUpdateFilter,
    onClearFilter,
    onSelectRestMenuItem,
    onChangePage,
    onChangeRowsPerPage,
    stickyFilters,
    rowsCount,
    children,
}: Props) => {
    const listViewBuilderContextData = useMemo(() => ({
        updating,
        updatingWithDialog,
        dataSource,
        onSelectListRow,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onUpdateFilter,
        onClearFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsCount,
    }), [
        updating,
        updatingWithDialog,
        dataSource,
        onSelectListRow,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onUpdateFilter,
        onClearFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsCount,
    ]);

    return (
        <ListViewBuilderContext.Provider
            value={listViewBuilderContextData}
        >
            {children}
        </ListViewBuilderContext.Provider>
    );
};
