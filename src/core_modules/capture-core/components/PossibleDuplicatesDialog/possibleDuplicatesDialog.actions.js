// @flow
import { actionCreator } from '../../actions/actions.utils';
import type { ChangePageActionCreator, ReviewDuplicatesActionCreator } from './PossibleDuplicatesDialog.types';
import { adToBs} from '@sbmdkl/nepali-date-converter';

export const actionTypes = {
    DUPLICATES_REVIEW: 'PossibleDuplicatesReview',
    DUPLICATES_REVIEW_RETRIEVAL_SUCCESS: 'PossibleDuplicatesReviewRetrievalSuccess',
    DUPLICATES_REVIEW_RETRIEVAL_FAILED: 'PossibleDuplicatesReviewRetrievalFailed',
    DUPLICATES_REVIEW_SKIPPED: 'PossibleDuplicatesReview.Skipped',
    DUPLICATES_REVIEW_CHANGE_PAGE: 'PossibleDuplicatesChangePage',
    DUPLICATES_RESET: 'PossibleDuplicatesReset',
};


export const reviewDuplicates = ({
    pageSize,
    orgUnitId,
    selectedScopeId,
    scopeType,
    dataEntryId,
}: ReviewDuplicatesActionCreator) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW)({
        pageSize,
        page: 1,
        orgUnitId,
        selectedScopeId,
        scopeType,
        dataEntryId,
    });

    function convertDatesToNepali(teis) {
        const newTeis = { ...teis }; 
        Object.keys(newTeis).forEach(key => {
            const teiObj = newTeis[key];
    
            if (teiObj && teiObj.tei && teiObj.values) {
                    for (const valKey in teiObj.values) {
                    const value = teiObj.values[valKey];
                    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        teiObj.values[valKey] = adToBs(value);
                    }
                }
            } else {
                console.error(`teiObj.tei or teiObj.values is undefined for key ${key}`, teiObj);
            }
        });
    
        return newTeis;
    }
    
  
export const duplicatesForReviewRetrievalSuccess = (teis: Array<Object>, currentPage: number) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS)({ teis, currentPage });

export const duplicatesReviewSkipped = () =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_SKIPPED)();

export const duplicatesForReviewRetrievalFailed = () =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED)();

export const changePage = ({
    pageSize,
    page,
    orgUnitId,
    selectedScopeId,
    scopeType,
    dataEntryId,
}: ChangePageActionCreator) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE)({
        page,
        pageSize,
        orgUnitId,
        selectedScopeId,
        scopeType,
        dataEntryId,
    });

export const duplicatesReset = () => actionCreator(actionTypes.DUPLICATES_RESET)();
