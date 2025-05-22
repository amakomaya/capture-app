// // @flow
// import { useSelector } from 'react-redux';
// const FALLBACK_TRACKED_ENTITY_TYPE_ID = 'CWkDesHkKCs';

// export const useCurrentTrackedEntityTypeId = () => useSelector(({ currentSelections }) => currentSelections.trackedEntityTypeId);
// export const useCurrentTrackedEntityTypeId = () => 
//     useSelector(({ currentSelections }) => 
//         currentSelections?.trackedEntityTypeId || FALLBACK_TRACKED_ENTITY_TYPE_ID ||''
//     );


import { useSelector } from 'react-redux';

const FALLBACK_TRACKED_ENTITY_TYPE_ID = 'CWkDesHkKCs';

export const useCurrentTrackedEntityTypeId = () => 
    useSelector(({ currentSelections }) => 
        currentSelections?.trackedEntityTypeId || '' || FALLBACK_TRACKED_ENTITY_TYPE_ID
    );