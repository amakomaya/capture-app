// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../../../Pagination/withDefaultNavigation';

const Pager = withNavigation()(Pagination);

const getStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(600),
    },
});

type Props = {
    paginationData: Object,
    onChangePage: Function,
    classes: Object,
};

const ReviewDialogContentsPager = (props: Props) => {
    const { onChangePage, paginationData, classes } = props;
    return (
        <div
            className={classes.container}
        >
            <Pager
                onChangePage={onChangePage}
                {...paginationData}
            />
        </div>
    );
};

export default withStyles(getStyles)(ReviewDialogContentsPager);
