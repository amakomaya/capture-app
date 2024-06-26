// @flow

type RelationshipType ={
    id: string,
    name: string,
};

export type Entity = {
    id: string,
    name: string,
    type: string,
}

export type Relationship = {
    clientId: string,
    id?: ?string,
    referral?: boolean,
    from: Entity,
    to: Entity,
    relationshipType: RelationshipType,
};
