// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import cx from 'classnames';

import { withStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { StageOverview } from './StageOverview';
import type { Props } from './stage.types';
import { Widget } from '../../../Widget';
import { StageDetail } from './StageDetail/StageDetail.component';

const styles = {
    overview: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
    },
};


export const StagePlain = ({ stage, events, classes, className }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const { name, icon, description, dataElements } = stage;
    return (
        <div
            data-test="stage-content"
            className={cx(classes.overview, className)}
        >
            <Widget
                header={<StageOverview
                    title={name}
                    icon={icon}
                    description={description}
                    events={events}
                />}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {events.length > 0 && <StageDetail
                    eventName={name}
                    events={events}
                    data={dataElements}
                />}
            </Widget>
        </div>
    );
};

export const Stage: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagePlain);
