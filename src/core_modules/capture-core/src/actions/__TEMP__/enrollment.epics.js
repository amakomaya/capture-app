// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';

import getEnrollmentEvents from '../../events/getEnrollmentEvents';
import { loadDataEntryEvent } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes, enrollmentLoaded } from './enrollment.actions';


export const loadEnrollmentData = action$ =>
    action$.ofType(actionTypes.START_ENROLLMENT_LOAD)
        .concatMap(action =>
            getEnrollmentEvents()
                .then(events => enrollmentLoaded(events)));

export const loadDataEntryData = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.ENROLLMENT_LOADED)
        .map((action) => {
            if (action.payload && action.payload.length > 0) {
                return loadDataEntryEvent('WtUDEw3resf', store.getState(), [{ id: 'eventDate', type: 'DATE' }, { id: 'dueDate', type: 'DATE' }], 'main');
            }
            return loadDataEntryEvent('WtUDEw3resf', store.getState(), [{ id: 'eventDate', type: 'DATE' }, { id: 'dueDate', type: 'DATE' }], 'main');
        });

