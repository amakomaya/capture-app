// @flow
import { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getProgramAndStageFromEvent, getTrackedEntityTypeThrowIfNotFound }
    from '../../../metaData';
import type {
    InputRelationship,
    RelationshipType,
    RelationshipData,
    TEIAttribute,
    DataValue,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { getBaseConfigHeaders, relationshipEntities } from '../../Pages/Enrollment/EnrollmentPageDefault/hooks/constants';
import { convertServerToClient, convertClientToServer } from '../../../converters';

const convertAttributes = (
    attributes: Array<TEIAttribute> | Array<DataValue>,
    displayFields: Array<Object>,
    options: Object,
): Array<{id: string, value: any}> => displayFields.map((field) => {
    if (field.convertValue) {
        return {
            id: field.id,
            value: field.convertValue(options),
        };
    }

    const attributeItem = attributes.find((att) => {
        if (att.attribute) { return att.attribute === field.id; }
        if (att.dataElement) { return att.dataElement === field.id; }
        return undefined;
    })?.value;

    return {
        id: field.id,
        value: convertClientToServer(convertServerToClient(attributeItem, field.valueType), field.valueType),
    };
});

const getDisplayFields = (linkedEntity) => {
    let displayFields;
    if (linkedEntity.relationshipEntity === relationshipEntities.TRACKED_ENTITY_INSTANCE) {
        displayFields = linkedEntity.trackerDataView.attributes;
    } else if (linkedEntity.relationshipEntity === relationshipEntities.PROGRAM_STAGE_INSTANCE) {
        displayFields = linkedEntity.trackerDataView.dataElements;
    }
    if (!displayFields?.length) {
        displayFields = getBaseConfigHeaders[linkedEntity.relationshipEntity];
    }

    return displayFields;
};

const determineLinkedEntity = (
    relationshipType: RelationshipType,
    targetId: string,
    from: RelationshipData,
    to: RelationshipData,
) => {
    const { id, fromToName, toFromName, toConstraint, fromConstraint } = relationshipType;

    if ((to.trackedEntity && to.trackedEntity.trackedEntity === targetId) || (to.event && to.event.event === targetId)) {
        return { side: from, constraint: fromConstraint, relationshipName: toFromName, groupId: `${id}-from` };
    }

    if ((from.trackedEntity && from.trackedEntity.trackedEntity === targetId) || (from.event && from.event.event === targetId)) {
        return { side: to, constraint: toConstraint, relationshipName: fromToName, groupId: `${id}-to` };
    }

    log.error(errorCreator('Relationship type is not handled')({ relationshipType }));
    return undefined;
};


const getAttributeConstraintsForTEI = (linkedEntity: RelationshipData, createdAt: string) => {
    if (linkedEntity.event) {
        const { event: eventId, program: programId, programStage, orgUnitName, status } = linkedEntity.event;
        /*
         * Needs refactoring when moving to Widget Library.
         * We will need to either add the program name and program stage name to the relationshipTypes
         * or do some kind of callback to get the appropriate information.
         */
        // $FlowFixMe
        const { stage, program } = getProgramAndStageFromEvent({
            eventId,
            programId,
            programStageId: programStage,
        });

        return {
            id: eventId,
            values: linkedEntity.event.dataValues,
            options: {
                orgUnitName,
                status,
                programName: program?.name,
                programStageName: stage?.stageForm?.name,
                created: createdAt,
            },
        };
    } else if (linkedEntity.trackedEntity) {
        const { trackedEntityType, trackedEntity, attributes } = linkedEntity.trackedEntity;
        const tet = getTrackedEntityTypeThrowIfNotFound(trackedEntityType);
        return {
            id: trackedEntity,
            values: attributes,
            options: { trackedEntityTypeName: tet.name, created: createdAt },
        };
    }
    log.error(errorCreator('Relationship type is not handled')({ linkedEntity }));
    return undefined;
};

const getLinkedEntityInfo = (
    relationshipType: Object,
    targetId: string,
    from: RelationshipData,
    to: RelationshipData,
    createdAt: string,
) => {
    const linkedEntityData = determineLinkedEntity(relationshipType, targetId, from, to);
    if (!linkedEntityData) { return undefined; }
    const metadata = getAttributeConstraintsForTEI(linkedEntityData.side, createdAt);
    if (!metadata) { return undefined; }
    const { id, values, options } = metadata;
    const displayFields = getDisplayFields(linkedEntityData.constraint);
    return {
        id,
        displayFields,
        groupId: linkedEntityData.groupId,
        relationshipName: linkedEntityData?.relationshipName,
        values: convertAttributes(values, displayFields, options),
    };
};


export const useLinkedEntityGroups = (
    targetId: string,
    relationshipTypes: Array<Object>,
    relationships?: Array<InputRelationship>,
) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        if (relationships?.length && relationshipTypes?.length) {
            const linkedEntityGroups = relationships.reduce((acc, rel) => {
                const { relationshipType: typeId, from, to, createdAt } = rel;
                const relationshipType = relationshipTypes.find(item => item.id === typeId);
                const metadata = getLinkedEntityInfo(relationshipType, targetId, from, to, createdAt);
                if (!metadata) { return acc; }
                const { relationshipName, displayFields, id, values, groupId } = metadata;
                const typeExist = acc.find(item => item.id === groupId);
                if (typeExist) {
                    typeExist.linkedEntityData.push({ id, values });
                } else {
                    acc.push({
                        id: groupId,
                        relationshipName,
                        linkedEntityData: [{ id, values }],
                        headers: displayFields,
                    });
                }

                return acc;
            }, []);

            setRelationshipByType(linkedEntityGroups);
        }
    }, [relationships, relationshipTypes, targetId]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    return {
        relationships: relationshipsByType,
    };
};
