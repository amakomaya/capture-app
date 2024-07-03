// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import moment from 'moment';
import { Calendar } from '@dhis2/ui';
// import InfiniteCalendar from '@joakim_sm/react-infinite-calendar';
import '@joakim_sm/react-infinite-calendar/styles.css';
import './customStyles.css';
import { adToBs } from '@sbmdkl/nepali-date-converter';

type Props = {
    onDateSelected: (value: any) => void,
    value?: ?string,
    minMoment?: Object,
    maxMoment?: Object,
    currentWidth: number,
    height?: ?number,
    classes: Object,
    displayOptions?: ?Object,
    calendarTheme: Object,
    onConvertValueIn: (inputValue: ?string) => Date,
    onConvertValueOut: (date: Date) => string,
};

type State = {
    selectedDate: ?string,
};

export class DateCalendar extends Component<Props, State> {
    handleChange: (e: any, dates: ?Array<Date>) => void;
    displayOptions: Object;

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedDate: this.getValue(props.value),
        };
        this.handleChange = this.handleChange.bind(this);

        this.displayOptions = {
            ...DateCalendar.displayOptions,
            ...this.props.displayOptions,
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.value !== prevState.selectedDate) {
            return {
                selectedDate: nextProps.value,
            };
        }
        return null;
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return nextState.selectedDate !== this.state.selectedDate;
    }

    static displayOptions = {
        showHeader: true,
        showMonthsForYears: false,
    };

    handleChange(changeDate: Date) {
        const changeDateInLocalFormat = this.props.onConvertValueOut(changeDate.calendarDateString);
        this.setState({ selectedDate: changeDateInLocalFormat });
        this.props.onDateSelected(changeDateInLocalFormat);
    }


    getValue(inputValue: ?string) {
                return this.props.onConvertValueIn(inputValue);
            }

    getMinMaxProps() {
        const { minMoment = moment('1900-01-01'), maxMoment = moment('2099-12-31') } = this.props;

        const minDate = minMoment.toDate();
        const maxDate = maxMoment.toDate();

        return {
            min: minDate,
            minDate,
            max: maxDate,
            maxDate,
        };
    }

    render() {
        const {
            value,
            classes,
            currentWidth,
            height,
            minMoment,
            maxMoment,
            onDateSelected,
            displayOptions,
            ...passOnProps
        } = this.props;

        const { selectedDate } = this.state;

        return (
            <div>
                { /* $FlowFixMe */}
                {/* <InfiniteCalendar
                    {...this.getMinMaxProps()}
                    selected={this.getValue((value))}
                    onSelect={this.handleChange}
                    width={currentWidth}
                    height={height}
                    autoFocus={false}
                    displayOptions={this.displayOptions}
                    {...passOnProps}
                /> */}

                <Calendar
                    date={selectedDate}
                    onDateSelect={this.handleChange}
                    width={currentWidth}
                    height={height}
                    {...passOnProps}
                    calendar="nepali"
                    locale="ne-NP"
                    timeZone="Asia/Kathmandu"
                />
            </div>
        );
    }
}
