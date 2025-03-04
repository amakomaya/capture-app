// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import moment from 'moment';
import {
    IconClock16,
    IconDimensionOrgUnit16,
    colors,
    Tag,
    spacersNum,
    Tooltip,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { withStyles } from '@material-ui/core';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { Widget } from '../Widget';
import type { PlainProps } from './enrollment.types';
import { Status } from './Status';
import { dataElementTypes } from '../../metaData';
import { convertValue } from '../../converters/clientToView';
import { useOrgUnitNameWithAncestors } from '../../metadataRetrieval/orgUnitName';
import { Date } from './Date';
import { Actions } from './Actions';
import { MiniMap } from './MiniMap';

const styles = {
    enrollment: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        margin: `${spacersNum.dp8}px 0`,
        fontSize: '14px',
        color: colors.grey900,
        gap: `${spacersNum.dp4}px`,
    },
    statuses: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
    },
};

const getGeometryType = geometryType =>
    (geometryType === 'Point' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON);
const getEnrollmentDateLabel = program => program.displayEnrollmentDateLabel || i18n.t('Enrollment date');
const getIncidentDateLabel = program => program.displayIncidentDateLabel || i18n.t('Incident date');

export const WidgetEnrollmentPlain = ({
    classes,
    events,
    enrollment = {},
    program = {},
    ownerOrgUnit = {},
    locale,
    refetchEnrollment,
    refetchTEI,
    initError,
    loading,
    canAddNew,
    editDateEnabled,
    displayAutoGeneratedEventWarning,
    onDelete,
    onAddNew,
    updateEnrollmentDate,
    updateIncidentDate,
    onError,
    onSuccess,
    onUpdateEnrollmentStatus,
    onUpdateEnrollmentStatusError,
    onUpdateEnrollmentStatusSuccess,
    onAccessLostFromTransfer,
    type = dataElementTypes.ORGANISATION_UNIT,
}: PlainProps) => {
    const [open, setOpenStatus] = useState(true);
    const { fromServerDate } = useTimeZoneConversion();
    const geometryType = getGeometryType(enrollment?.geometry?.type);
    const { displayName: orgUnitName, ancestors } = useOrgUnitNameWithAncestors(enrollment?.orgUnit);
    const { displayName: ownerOrgUnitName, ancestors: ownerAncestors } = useOrgUnitNameWithAncestors(ownerOrgUnit?.id);

    const orgUnitClientValue = { id: enrollment?.orgUnit, name: orgUnitName, ancestors };
    const ownerOrgUnitClientValue = { id: ownerOrgUnit?.id, name: ownerOrgUnitName, ancestors: ownerAncestors };

    return (
        <div data-test="widget-enrollment">
            <Widget
                header={i18n.t('Enrollment')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {initError && (
                    <div className={classes.enrollment}>
                        {i18n.t('Enrollment widget could not be loaded. Please try again later')}
                    </div>
                )}
                {loading && <LoadingMaskElementCenter />}
                {!initError && !loading && (
                    <div className={classes.enrollment} data-test="widget-enrollment-contents">
                        <div className={classes.statuses} data-test="widget-enrollment-status">
                            {enrollment.followUp && (
                                <Tag className={classes.followup} negative>
                                    {i18n.t('Follow-up')}
                                </Tag>
                            )}
                            <Status status={enrollment.status} />
                        </div>

                        <span data-test="widget-enrollment-enrollment-date">
                            <Date
                                date={enrollment.enrolledAt}
                                dateLabel={getEnrollmentDateLabel(program)}
                                locale="ne-NP"
                                editEnabled={editDateEnabled}
                                displayAutoGeneratedEventWarning={displayAutoGeneratedEventWarning}
                                onSave={updateEnrollmentDate}
                                classes={classes}
                            />
                        </span>

                        {program.displayIncidentDate && (
                            <span data-test="widget-enrollment-incident-date">
                                <Date
                                    date={enrollment.occurredAt}
                                    dateLabel={getIncidentDateLabel(program)}
                                    locale="ne-NP"
                                    editEnabled={editDateEnabled}
                                    displayAutoGeneratedEventWarning={displayAutoGeneratedEventWarning}
                                    onSave={updateIncidentDate}
                                    classes={classes}
                                />
                            </span>
                        )}

                        <div className={classes.row} data-test="widget-enrollment-orgunit">
                            <span className={classes.icon} data-test="widget-enrollment-icon-orgunit">
                                <IconDimensionOrgUnit16 color={colors.grey600} />
                            </span>
                            {i18n.t('Started at{{escape}}', {
                                escape: ':',
                            })}
                            {convertValue(orgUnitClientValue, type)}
                        </div>

                        <div className={classes.row} data-test="widget-enrollment-owner-orgunit">
                            <span className={classes.icon} data-test="widget-enrollment-icon-owner-orgunit">
                                <IconDimensionOrgUnit16 color={colors.grey600} />
                            </span>
                            {i18n.t('Owned by{{escape}}', {
                                escape: ':',
                            })}
                            {convertValue(ownerOrgUnitClientValue, type)}
                        </div>

                        <div className={classes.row} data-test="widget-enrollment-last-update">
                            <span className={classes.icon} data-test="widget-enrollment-icon-clock">
                                <IconClock16 color={colors.grey600} />
                            </span>
                            {i18n.t('Last updated')}
                            <Tooltip content={(fromServerDate(enrollment.updatedAt).toLocaleString())}>
                                {moment(fromServerDate(enrollment.updatedAt)).fromNow()}
                            </Tooltip>
                        </div>

                        {enrollment.geometry && (
                            <div className={classes.row}>
                                <MiniMap
                                    coordinates={enrollment.geometry.coordinates}
                                    geometryType={geometryType}
                                    enrollment={enrollment}
                                    refetchEnrollment={refetchEnrollment}
                                    refetchTEI={refetchTEI}
                                    onError={onError}
                                />
                            </div>
                        )}
                        <Actions
                            tetName={program.trackedEntityType.displayName}
                            onlyEnrollOnce={program.onlyEnrollOnce}
                            programStages={program.programStages}
                            enrollment={enrollment}
                            events={events}
                            ownerOrgUnitId={ownerOrgUnit.id}
                            refetchEnrollment={refetchEnrollment}
                            refetchTEI={refetchTEI}
                            onDelete={onDelete}
                            onAddNew={onAddNew}
                            canAddNew={canAddNew}
                            onError={onError}
                            onSuccess={onSuccess}
                            onUpdateEnrollmentStatus={onUpdateEnrollmentStatus}
                            onUpdateEnrollmentStatusSuccess={onUpdateEnrollmentStatusSuccess}
                            onUpdateEnrollmentStatusError={onUpdateEnrollmentStatusError}
                            onAccessLostFromTransfer={onAccessLostFromTransfer}
                        />
                    </div>
                )}
            </Widget>
        </div>
    );
};

export const WidgetEnrollment: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(WidgetEnrollmentPlain);
