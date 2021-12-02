// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetEnrollmentId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };

    return { resetEnrollmentId };
};