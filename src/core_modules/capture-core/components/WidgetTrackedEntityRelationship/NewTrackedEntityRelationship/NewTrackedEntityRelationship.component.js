import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconSearch16, IconAdd16, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { NewTEIRelationshipStatuses } from '../WidgetTrackedEntityRelationship.const';
import { RelationshipTypeSelector } from './RelationshipTypeSelector/RelationshipTypeSelector';

const styles = {
    container: {
        padding: spacers.dp16,
        paddingTop: 0,
    },
    creationselector: {
        display: 'flex',
        gap: spacers.dp4,
    },
    cancelButton: {
        marginTop: spacers.dp8,
    },
};

const NewTrackedEntityRelationshipComponentPlain = ({ pageStatus, classes, ...PassOnProps }) => {
    if (pageStatus === NewTEIRelationshipStatuses.MISSING_RELATIONSHIP_TYPE) {
        return (
            <RelationshipTypeSelector
                {...PassOnProps}
            />
        );
    }

    if (pageStatus === NewTEIRelationshipStatuses.MISSING_CREATION_MODE) {
        return (
            <div className={classes.container}>
                <div className={classes.creationselector}>
                    <Button className={classes.creationselector}>
                        <IconSearch16 />
                        <p>{i18n.t('Link to an existing person')}</p>
                    </Button>
                    <Button className={classes.creationselector}>
                        <IconAdd16 />
                        <p>{i18n.t('Create new')}</p>
                    </Button>
                </div>
            </div>
        );
    }

    return <p>{i18n.t('An error occurred')}</p>;
};

export const NewTrackedEntityRelationshipComponent = withStyles(styles)(NewTrackedEntityRelationshipComponentPlain);
