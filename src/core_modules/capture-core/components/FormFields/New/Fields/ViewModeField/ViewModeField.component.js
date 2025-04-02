
// @flow
import { colors } from '@dhis2/ui';
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

type Props = {
    value?: ?any,
    valueConverter?: ?(value: any) => any,
    classes: {
        container: string,
    },
}

const getStyles = () => ({
    container: {
        width: '100%',
        fontWeight: 500,
        fontSize: 14,
        color: colors.grey900,
    },
});

class ViewModeFieldPlain extends React.Component<Props> {
    render() {
        const { value, valueConverter, classes } = this.props;
        // console.log(value,'value')
        const displayValue = valueConverter ? valueConverter(value) : value;
        // console.log(displayValue,'displayValue')
        return (
            <div className={classes.container}>
                {displayValue}
            </div>
        );
    }
}

export const ViewModeField = withStyles(getStyles)(ViewModeFieldPlain);
