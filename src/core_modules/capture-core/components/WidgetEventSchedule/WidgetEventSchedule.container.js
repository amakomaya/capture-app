// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { useOrganisationUnit } from '../../dataQueries';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import {
    useScheduleConfigFromProgramStage,
    useDetermineSuggestedScheduleDate,
    useEventsInOrgUnit,
    useScheduleConfigFromProgram,
} from './hooks';
import { requestScheduleEvent, startEditingScheduleEvent } from './WidgetEventSchedule.actions';


export const WidgetEventSchedule = ({
    enrollmentId,
    teiId,
    stageId,
    programId,
    orgUnitId,
    ...passOnProps
}: ContainerProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const dispatch = useDispatch();
    const { orgUnit } = useOrganisationUnit(orgUnitId, 'displayName');
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, ...passOnProps,
    });
    const [scheduleDate, setScheduleDate] = useState(suggestedScheduleDate);
    const { events } = useEventsInOrgUnit(orgUnitId, scheduleDate);

    const eventCountInOrgUnit = events
        .filter(event => moment(event.dueDate).format('YYYY-MM-DD') === scheduleDate).length;

    useEffect(() => {
        dispatch(startEditingScheduleEvent());
    }, []); // eslint-disable-line

    useEffect(() => {
        if (!scheduleDate && suggestedScheduleDate) { setScheduleDate(suggestedScheduleDate); }
    }, [suggestedScheduleDate]); // eslint-disable-line

    const onHandleSchedule = useCallback(() => {
        dispatch(requestScheduleEvent({
            scheduleDate,
            programId,
            orgUnitId,
            stageId,
            teiId,
            enrollmentId,
        }));
    }, [
        dispatch,
        scheduleDate,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
    ]);

    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }


    return (
        <WidgetEventScheduleComponent
            stageId={stageId}
            stageName={stage.name}
            programId={programId}
            programName={program.name}
            scheduleDate={scheduleDate}
            suggestedScheduleDate={suggestedScheduleDate}
            setScheduleDate={setScheduleDate}
            onSchedule={onHandleSchedule}
            eventCountInOrgUnit={eventCountInOrgUnit}
            orgUnit={orgUnit}
            {...passOnProps}
        />

    );
};

