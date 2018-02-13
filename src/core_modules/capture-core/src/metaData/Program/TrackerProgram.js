// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Program from './Program';
import RenderFoundation from '../RenderFoundation/RenderFoundation';
import errorCreator from '../../utils/errorCreator';

export default class TrackerProgram extends Program {
    _stages: Map<string, RenderFoundation>;

    static errorMessages = {
        STAGE_NOT_FOUND: 'Stage was not found',
        STAGE_INDEX_NOT_FOUND: 'No stage found on index',
    };

    constructor(initFn: ?(_this: Program) => void) {
        super();
        this._stages = new Map();
        initFn && isFunction(initFn) && initFn(this);
    }

    // $FlowSuppress
    * [Symbol.iterator](): Iterator<RenderFoundation> {
        for (const stage of this._stages.values()) {
            yield stage;
        }
    }

    get stages(): Map<string, RenderFoundation> {
        return this._stages;
    }

    addStage(stage: RenderFoundation) {
        this.stages.set(stage.id, stage);
    }

    getStage(id: string): ?RenderFoundation {
        return this.stages.get(id);
    }

    getStageThrowIfNotFound(id: string): RenderFoundation {
        const stage = this.stages.get(id);
        if (!stage) {
            throw new Error(
                errorCreator(TrackerProgram.errorMessages.STAGE_NOT_FOUND)({ program: this, stageId: id }),
            );
        }
        return stage;
    }

    getStageFromIndex(index: number): RenderFoundation {
        const stage = this.stages.entries()[index];
        if (!stage) {
            throw new Error(
                errorCreator(TrackerProgram.errorMessages.STAGE_INDEX_NOT_FOUND)({ program: this, stageIndex: index }),
            );
        }
        return stage;
    }
}
