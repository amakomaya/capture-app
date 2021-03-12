// @flow
import { pageKeys } from '../components/App/withAppUrlSync';

type Url = {|
    programId?: string,
    orgUnitId?: string,
    trackedEntityTypeId?: string,
    teiId?: string,
    enrollmentId?: string,
    stageId?: string,
    eventId?: string,
|}

export const urlArguments = ({
    programId,
    orgUnitId,
    trackedEntityTypeId,
    teiId,
    enrollmentId,
    stageId,
    eventId,
}: Url): string => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    } else if (trackedEntityTypeId) {
        argArray.push(`trackedEntityTypeId=${trackedEntityTypeId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }
    if (teiId) {
        argArray.push(`teiId=${teiId}`);
    }
    if (enrollmentId) {
        argArray.push(`enrollmentId=${enrollmentId}`);
    }
    if (stageId) {
        argArray.push(`stageId=${stageId}`);
    }
    if (eventId) {
        argArray.push(`eventId=${eventId}`);
    }

    return argArray.join('&');
};

export const deriveUrlQueries = (state: Object): Url => {
    const {
        currentSelections: {
            programId: selectedProgramId,
            orgUnitId: selectedOrgUnitId,
            trackedEntityTypeId: selectedTet,
        },
        router: {
            location: {
                query: {
                    programId: routerProgramId,
                    orgUnitId: routerOrgUnitId,
                    trackedEntityTypeId: routerTet,
                    teiId,
                    enrollmentId,
                    stageId,
                    eventId,
                },
            } },
    } = state;
    const programId = routerProgramId || selectedProgramId;
    const orgUnitId = routerOrgUnitId || selectedOrgUnitId;
    const trackedEntityTypeId = routerTet || selectedTet;

    return {
        programId,
        orgUnitId,
        trackedEntityTypeId,
        teiId,
        enrollmentId,
        stageId,
        eventId,
    };
};

export const pageFetchesOrgUnitUsingTheOldWay = (page: string, pages: Object = pageKeys): boolean =>
    Object.values(pages).includes(page);
