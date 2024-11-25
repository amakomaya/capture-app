// // @flow
// import React from 'react';
// import { withFocusSaver } from '../../HOC/withFocusSaver';
// import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
// import { TextInput } from '../TextInput/TextInput.component';
// import { withShrinkLabel } from '../../HOC/withShrinkLabel';

// type Props = {
//     onBlur: (value: any) => void,
//     onChange?: ?(value: any) => void,
// }

// class DateTimeTimePlain extends React.Component<Props> {
//     handleBlur = (event) => {
//         this.props.onBlur(event.currentTarget.value);
//     }

//     handleChange = (event) => {
//         this.props.onChange && this.props.onChange(event.currentTarget.value);
//     }

//     render() {
//         // $FlowFixMe[prop-missing] automated comment
//         const { onBlur, onChange, value, ...passOnProps } = this.props;
//         return (
//             // $FlowFixMe[cannot-spread-inexact] automated comment
//             <TextInput
//                 value={value || ''}
//                 onBlur={this.handleBlur}
//                 onChange={this.handleChange}
//                 {...passOnProps}
//             />
//         );
//     }
// }

// export const DateTimeTime =
//     withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(DateTimeTimePlain)));

// @flow
import React from 'react';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';

type Props = {
    onBlur: (value: any) => void,
    onChange?: ?(value: any) => void,
    value?: ?string, // Make sure this type matches the expected value type for the time input
}

class DateTimeTimePlain extends React.Component<Props> {
    handleBlur = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.props.onBlur(event.currentTarget.value);
    };

    handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    };

    render() {
        const { onBlur, onChange, value, ...passOnProps } = this.props;
        return (
            <input
                type="time"
                value={value || ''}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                {...passOnProps}

                style={{
                    boxSizing: 'border-box', 
                    padding: '7px 11px 10px',
                    fontSize: '14px',
                    width: '100%',
                    color: '#212934',
                    border: '1px solid #a0adba',
                    borderRadius: '3px',
                    boxShadow: 'inset 0 0 1px 0 rgba(48, 54, 60, 0.1)',
                    textOverflow: 'ellipsis',
                }}
            />
        );
    }
}

export const DateTimeTime =
    withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(DateTimeTimePlain)));

