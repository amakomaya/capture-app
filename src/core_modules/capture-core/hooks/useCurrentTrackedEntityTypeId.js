// @flow
import { useSelector } from 'react-redux';

// export const useCurrentTrackedEntityTypeId = () => useSelector(({ currentSelections }) => currentSelections.trackedEntityTypeId);
const FALLBACK_TRACKED_ENTITY_TYPE_ID = 'CWkDesHkKCs';

export const useCurrentTrackedEntityTypeId = () => 
    useSelector(({ currentSelections }) => 
        currentSelections?.trackedEntityTypeId || FALLBACK_TRACKED_ENTITY_TYPE_ID
    );