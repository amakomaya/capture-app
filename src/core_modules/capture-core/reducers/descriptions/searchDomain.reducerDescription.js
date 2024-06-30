// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchBoxActionTypes } from '../../components/SearchBox';
import { adToBs } from '@sbmdkl/nepali-date-converter';

export const searchBoxStatus = {
    INITIAL: 'INITIAL',
    LOADING: 'LOADING',
    NO_RESULTS: 'NO_RESULTS',
    SHOW_RESULTS: 'SHOW_RESULTS',
    ERROR: 'ERROR',
    TOO_MANY_RESULTS: 'TOO_MANY_RESULTS',
    NOT_ENOUGH_ATTRIBUTES: 'NOT_ENOUGH_ATTRIBUTES',
    UNIQUE_SEARCH_VALUE_EMPTY: 'UNIQUE_SEARCH_VALUE_EMPTY',
};
const initialReducerValue = {
    searchStatus: searchBoxStatus.INITIAL,
    searchResults: [],
    currentPage: 0,
    currentSearchInfo: {},
    keptFallbackSearchFormValues: {},
    otherCurrentPage: 0,
};
const convertDateToBS = (dateString) => {
    const dateOnlyString = dateString.split('T')[0];
    const nepaliDate = adToBs(dateOnlyString);
    return nepaliDate;
};
const convertEnrollmentDates = (enrollment) => {
    if (enrollment.enrolledAt) {
        enrollment.enrolledAt = convertDateToBS(enrollment.enrolledAt);
    }
    
    if (enrollment.occurredAt) {
        enrollment.occurredAt = convertDateToBS(enrollment.occurredAt);
    }

    if (enrollment.createdAt) {
        enrollment.createdAt = convertDateToBS(enrollment.createdAt);
    }

    if (enrollment.updatedAt) {
        enrollment.updatedAt = convertDateToBS(enrollment.updatedAt);
    }
};

// const convertAllDatesToBS = (data) => {
//     console.log('data',data);
//     if (Array.isArray(data)) {
//         return data.map(item => convertAllDatesToBS(item));
//     } else if (typeof data === 'object' && data !== null) {
//         const newData = {};
//         for (const key in data) {
//             if (typeof data[key] === 'string' && data[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
//                 newData[key] = convertDateToBS(data[key]);
//             } else if (key === 'enrollments') {
//                 newData[key] = data[key].map(enrollment => {
//                     convertEnrollmentDates(enrollment);
//                     return enrollment;
//                 });
//             } 
            
//             else {
//                 newData[key] = convertAllDatesToBS(data[key]);
//             }
//         }
//         return newData;
//     }
//     return data;
// };

const convertAllDatesToBS = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => convertAllDatesToBS(item));
    } else if (typeof data === 'object' && data !== null) {
        const newData = {};
        for (const key in data) {
            if (typeof data[key] === 'string' && data[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                newData[key] = convertDateToBS(data[key]);
            } else if (key === 'enrollments') {
                newData[key] = data[key].map(enrollment => {
                    convertEnrollmentDates(enrollment);
                    return enrollment;
                });
            } else if (key === 'attributes') {
                newData[key] = data[key].map(attribute => {
                    if (typeof attribute.value === 'string' && attribute.value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        attribute.value = convertDateToBS(attribute.value);
                    }
                    return attribute;
                });
            } else if (key === 'values') {
                newData[key] = {};
                for (const valKey in data[key]) {
                    if (typeof data[key][valKey] === 'string' && data[key][valKey].match(/^\d{4}-\d{2}-\d{2}$/)) {
                        newData[key][valKey] = convertDateToBS(data[key][valKey]);
                    } else {
                        newData[key][valKey] = data[key][valKey];
                    }
                }
            } else {
                newData[key] = convertAllDatesToBS(data[key]);
            }
        }
        return newData;
    }
    return data;
};

const searchResultsSuccessViewReducer = (state, { payload: { searchResults, currentPage } }) => {
    const convertedSearchResults = convertAllDatesToBS(searchResults);
    return {
        ...state,
        searchStatus: searchBoxStatus.SHOW_RESULTS,
        searchResults: convertedSearchResults,
        currentPage,
    };
};

export const searchDomainDesc = createReducerDescription({
    [searchBoxActionTypes.SEARCH_RESULTS_INITIAL_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.INITIAL,
    }),
    // [searchBoxActionTypes.SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { searchResults, currentPage } }) => ({
    //     ...state,
    //     searchStatus: searchBoxStatus.SHOW_RESULTS,
    //     searchResults,
    //     currentPage,
    // }),
    [searchBoxActionTypes.SEARCH_RESULTS_SUCCESS_VIEW]: searchResultsSuccessViewReducer,
    [searchBoxActionTypes.ADD_SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { otherResults, otherCurrentPage } }) => ({
        ...state,
        searchStatus: searchBoxStatus.SHOW_RESULTS,
        otherResults,
        otherCurrentPage,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_LOADING_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.LOADING,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_EMPTY_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.NO_RESULTS,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_ERROR_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.ERROR,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_TOO_MANY_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.TOO_MANY_RESULTS,
    }),
    [searchBoxActionTypes.FALLBACK_NOT_ENOUGH_ATTRIBUTES]: (state, { payload }) => ({
        ...state,
        searchStatus: searchBoxStatus.NOT_ENOUGH_ATTRIBUTES,
        searchableFields: payload.searchableFields,
        minAttributesRequiredToSearch: payload.minAttributesRequiredToSearch,
    }),
    [searchBoxActionTypes.CURRENT_SEARCH_INFO_SAVE]: (state, { payload: { searchScopeType, searchScopeId, formId, currentSearchTerms } }) => ({
        ...state,
        currentSearchInfo: { searchScopeType, searchScopeId, formId, currentSearchTerms },
        otherResults: undefined,
        otherCurrentPage: 0,
    }),
    [searchBoxActionTypes.FALLBACK_SEARCH]: (state, { payload: { fallbackFormValues, trackedEntityTypeId } }) => ({
        ...state,
        keptFallbackSearchFormValues: { ...fallbackFormValues, trackedEntityTypeId },
    }),

    [searchBoxActionTypes.ALL_SEARCH_RELATED_DATA_CLEAN]: () => (initialReducerValue),
    [searchBoxActionTypes.FALLBACK_SEARCH_RELATED_DATA_CLEAN]: state => ({
        ...state,
        keptFallbackSearchFormValues: {},
    }),
    [searchBoxActionTypes.SEARCH_UNIQUE_SEARCH_VALUE_EMPTY]: (state, { payload }) => ({
        ...state,
        searchStatus: searchBoxStatus.UNIQUE_SEARCH_VALUE_EMPTY,
        currentSearchInfo: { uniqueTEAName: payload.uniqueTEAName },
    }),

}, 'searchDomain', initialReducerValue);
