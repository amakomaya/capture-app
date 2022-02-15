// @flow
import { useCallback, useEffect, useState } from 'react';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { getProgramAndStageFromEvent, getTrackedEntityTypeThrowIfNotFound }
    from '../../../../../metaData';
import { userStores } from '../../../../../storageControllers/stores';
import type {
    InputRelationship, RelationshipData,
} from '../../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { getDisplayFieldsFromAPI, getBaseConfigHeaders, relationshipWidgetTypes } from './constants';

/* eslint-disable complexity */
const getRelationshipAttributes = (
    relationshipType: Object,
    teiId: string,
    from: RelationshipData,
    to: RelationshipData,
    relationship: Object,
) => {
    const { bidirectional, fromToName, toFromName, toConstraint, fromConstraint } = relationshipType;

    const getAttributes = (attributes, displayFields, options) => displayFields.map((item) => {
        if (item.convertValue) {
            return {
                id: item.id,
                value: item.convertValue(options),
            };
        }
        const attributeItem = Array.isArray(attributes)
            ? attributes.find(({ attribute }) => attribute === item.id)?.value : attributes[item.id];
        return {
            id: item.id,
            value: attributeItem,
        };
    });

    const getDisplayFields = (type) => {
        let displayFields = getDisplayFieldsFromAPI[type];
        if (!displayFields.length) {
            displayFields = getBaseConfigHeaders[type];
        }
        return displayFields;
    };

    if (to?.trackedEntityInstance && to?.trackedEntityInstance?.trackedEntityInstance !== teiId) {
        const displayFields = getDisplayFields(toConstraint.relationshipEntity);
        const tet = getTrackedEntityTypeThrowIfNotFound(toConstraint.trackedEntityType.id);
        const attributes = getAttributes(to.trackedEntityInstance.attributes, displayFields,
            { ...relationship, trackedEntityTypeName: tet.name });

        return {
            id: to.trackedEntityInstance.trackedEntityInstance,
            relationshipName: fromToName,
            relationshipProgram: toConstraint.program,
            attributes,
            displayFields,
            widgetType: relationshipWidgetTypes.TET_RELATIONSHIP,
        };
    } else if (bidirectional && from?.trackedEntityInstance &&
        from?.trackedEntityInstance?.trackedEntityInstance !== teiId) {
        const displayFields = getDisplayFields(fromConstraint.relationshipEntity);
        const tet = getTrackedEntityTypeThrowIfNotFound(toConstraint.trackedEntityType.id);
        const attributes = getAttributes(from.trackedEntityInstance.attributes, displayFields,
            { ...relationship, trackedEntityTypeName: tet.name });

        return {
            id: from.trackedEntityInstance.trackedEntityInstance,
            relationshipName: toFromName,
            relationshipProgram: fromConstraint.program,
            attributes,
            displayFields,
            widgetType: relationshipWidgetTypes.TET_RELATIONSHIP,
        };
    } else if (bidirectional && from?.event) {
        const displayFields = getDisplayFields(fromConstraint.relationshipEntity);
        // $FlowFixMe
        const { stage, program } = getProgramAndStageFromEvent({
            evenId: from.event.event,
            programId: from.event.program,
            programStageId: from.event.programStage,
        });
        const attributes = getAttributes(from.event, displayFields, {
            ...from.event,
            programName: program?.name,
            programStageName: stage?.stageForm?.name,
        });

        return {
            id: from.event.event,
            relationshipName: toFromName,
            relationshipProgram: fromConstraint.program,
            attributes,
            displayFields,
            widgetType: relationshipWidgetTypes.EVENT_RELATIONSHIP,
        };
    } else if (from.enrollment && from.enrollment.enrollment) {
        const displayFields = getDisplayFields(fromConstraint.relationshipEntity);
        const attributes = getAttributes(from.enrollment, displayFields,
            { ...from.enrollment });

        return {
            id: from.enrollment.enrollment,
            relationshipName: toFromName,
            attributes,
            displayFields,
            widgetType: relationshipWidgetTypes.ENROLLMENT_RELATIONSHIP,
        };
    }

    return {};
};


export const useRelationships = (teiId: string, relationships?: Array<InputRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        const groupped = [];

        if (!relationships) { return; }
        // $FlowFixMe
        for await (const relationship of relationships) {
            const { relationshipType: typeId, from, to } = relationship;
            const relationshipType = await getCachedSingleResourceFromKeyAsync(
                userStores.RELATIONSHIP_TYPES, typeId,
            ).then(result => result.response);

            const { relationshipName, displayFields, id, attributes, widgetType } = getRelationshipAttributes(
                relationshipType, teiId, from, to, { relationship },
            );
            const typeExist = groupped.find(item => item.id === typeId);

            if (typeExist) {
                typeExist.relationshipAttributes.push({ id, attributes });
            } else {
                groupped.push({
                    id: typeId,
                    relationshipName,
                    relationshipAttributes: [{ id, attributes }],
                    headers: displayFields,
                    widgetType,
                });
            }
        }

        setRelationshipByType(groupped);
    }, [relationships, teiId]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    const { teiRelationships, enrollmentRelationships, eventRelationships } = relationshipsByType
        .reduce((acc, { widgetType, ...currentRel }) => {
            switch (widgetType) {
            case relationshipWidgetTypes.TET_RELATIONSHIP:
                acc.teiRelationships.push(currentRel);
                break;
            case relationshipWidgetTypes.ENROLLMENT_RELATIONSHIP:
                acc.enrollmentRelationships.push(currentRel);
                break;
            case relationshipWidgetTypes.EVENT_RELATIONSHIP:
                acc.eventRelationships.push(currentRel);
                break;
            default:
                break;
            }
            return acc;
        }, { teiRelationships: [], enrollmentRelationships: [], eventRelationships: [] });

    return {
        teiRelationships,
        enrollmentRelationships,
        eventRelationships,
    };
};