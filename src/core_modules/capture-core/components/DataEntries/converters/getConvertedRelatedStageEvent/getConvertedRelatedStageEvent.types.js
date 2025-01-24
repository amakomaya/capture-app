// @flow
import type { RelatedStageDataValueStates, RelatedStageRelationshipType } from '../../../WidgetRelatedStages';
import { relatedStageActions } from '../../../WidgetRelatedStages';

type CommonEventDetails = {
    event: string,
    program: string,
    programStage: string,
    orgUnit: string,
    trackedEntity?: ?string,
    enrollment?: string,
    scheduledAt: string,
    dataValues: Array<{ dataElement: string, value: any }>,
    status?: string,
}

export type RequestEvent = {
    ...CommonEventDetails,
    occurredAt: string,
    notes?: Array<{ value: string }>,
    completedAt?: string,
}

export type LinkedRequestEvent = {
    ...CommonEventDetails,
    occurredAt?: string,
    completedAt?: string,
}

export type ConvertedRelatedStageEventProps = {|
    linkMode: $Keys<typeof relatedStageActions>,
    relatedStageDataValues: RelatedStageDataValueStates,
    programId: string,
    teiId?: ?string,
    currentProgramStageId: string,
    enrollmentId?: string,
    relatedStageType: RelatedStageRelationshipType,
    serverRequestEvent: RequestEvent,
|}

