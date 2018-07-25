// @flow

import * as React from 'react';

type Props = {
    infoWidgets: Array<React.Component<any>>
};

const getInfoWidget = (InnerComponent: React.ComponentType<any>, Widget: React.ComponentType<any>) =>
    class InfoWidgetBuilder extends React.Component<Props> {
        innerInstance: ?any;
        getInfoWidgets = () => {
            const infoWidgets = this.props.infoWidgets;
            const widget = this.getWidget(infoWidgets ? infoWidgets.length : 0);
            return infoWidgets ? [...infoWidgets, widget] : [widget];
        };
        getWidget = (key: any) =>
            (
                <Widget
                    key={key}
                    {...this.props}
                />)
        render = () => {
            const { infoWidgets, ...passOnProps } = this.props;

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        infoWidgets={this.getInfoWidgets()}
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export default () =>
    (InnerComponent: React.ComponentType<any>, Widget: React.ComponentType<any>) =>
        getInfoWidget(InnerComponent, Widget);
