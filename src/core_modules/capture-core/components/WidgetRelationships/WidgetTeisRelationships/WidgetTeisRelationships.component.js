// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useLinkedEntityGroups } from '../hooks/useLinkedEntityGroups';
import { RelationshipsWidget } from '../RelationshipsComponent';
import type { InputRelationship, RelationshipType } from '../types';

type Props = {|
    relationships: Array<InputRelationship>,
    relationshipTypes: Array<RelationshipType>,
    onAddRelationship: () => void,
    teiId: string,
    ...CssClasses,
|};

export const WidgetTeisRelationships = ({ relationships, relationshipTypes, teiId, onAddRelationship }: Props) => {
    const { relationships: teiRelationships } = useLinkedEntityGroups(teiId, relationshipTypes, relationships);

    return (
        <RelationshipsWidget
            title={i18n.t("TEI's Relationships")}
            relationships={teiRelationships}
            onAddRelationship={onAddRelationship}
        />
    );
};
