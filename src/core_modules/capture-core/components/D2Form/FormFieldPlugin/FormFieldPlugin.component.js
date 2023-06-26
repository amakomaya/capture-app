// @flow
import React from 'react';
// $FlowFixMe - app-runtime has not yet published the Plugin component
import { Plugin } from '@dhis2/app-runtime';
import type { ComponentProps } from './FormFieldPlugin.types';

export const FormFieldPluginComponent = (props: ComponentProps) => {
    const {
        pluginSource,
        ...passOnProps
    } = props;

    return (
        <Plugin
            pluginSource={pluginSource}
            {...passOnProps}
        />
    );
};