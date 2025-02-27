// // @flow
// /* eslint-disable import/first */
// import './app.css';
// import React from 'react';
// import { Provider } from 'react-redux';
// import D2UIApp from '@dhis2/d2-ui-app';
// import { AppContents } from './AppContents.component';
// import {
//     RulesEngineVerboseInitializer,
// } from '../../core_modules/capture-core/components/RulesEngineVerboseInitializer';
// import {
//     MetadataAutoSelectInitializer,
// } from '../../core_modules/capture-core/components/MetadataAutoSelectInitializer';


// type Props = {
//     store: ReduxStore,
// };

// export const App = ({ store }: Props) => (
//     <React.Fragment>
//         <Provider
//             store={store}
//         >
//             <D2UIApp>
//                 <MetadataAutoSelectInitializer>
//                     <RulesEngineVerboseInitializer>
//                         <AppContents />
//                     </RulesEngineVerboseInitializer>
//                 </MetadataAutoSelectInitializer>
//             </D2UIApp>
//         </Provider>
//     </React.Fragment>
// );
// @flow
/* eslint-disable import/first */
import './app.css';
import React from 'react';
import { Provider } from 'react-redux';
import D2UIApp from '@dhis2/d2-ui-app';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import { AppContents } from './AppContents.component';
import {
    RulesEngineVerboseInitializer,
} from '../../core_modules/capture-core/components/RulesEngineVerboseInitializer';
import {
    MetadataAutoSelectInitializer,
} from '../../core_modules/capture-core/components/MetadataAutoSelectInitializer';

type Props = {
    store: ReduxStore,
};

// Create a QueryClient instance
const queryClient = new QueryClient();

export const App = ({ store }: Props) => (
    <React.Fragment>
        <Provider store={store}>
            {/* Wrap the entire application with QueryClientProvider */}
            <QueryClientProvider client={queryClient}>
                <D2UIApp>
                    <MetadataAutoSelectInitializer>
                        <RulesEngineVerboseInitializer>
                            <AppContents />
                        </RulesEngineVerboseInitializer>
                    </MetadataAutoSelectInitializer>
                </D2UIApp>
            </QueryClientProvider>
        </Provider>
    </React.Fragment>
);