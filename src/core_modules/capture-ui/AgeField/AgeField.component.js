// @flow
import React, { Component } from 'react';
import { isValidPositiveInteger } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { IconButton } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import { AgeNumberInput } from '../internal/AgeInput/AgeNumberInput.component';
import { AgeDateInput } from '../internal/AgeInput/AgeDateInput.component';
import defaultClasses from './ageField.module.css';
import { orientations } from '../constants/orientations.const';
import { withInternalChangeHandler } from '../HOC/withInternalChangeHandler';
import { adToBs, calculateAge } from '@sbmdkl/nepali-date-converter';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

type AgeValues = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

type InputMessageClasses = {
    error?: ?string,
    warning?: ?string,
    info?: ?string,
    validating?: ?string,
}

type DateParser = (value: string) => { isValid: boolean, momentDate: any };

type DateStringFromMomentFormatter = (momentValue: Object) => string;

type ValidationOptions = {
    error?: ?string,
    errorCode?: ?string,
};

type Props = {
    value: ?AgeValues,
    onBlur: (value: ?AgeValues, options: ?ValidationOptions) => void,
    onChange: (value: ?AgeValues) => void,
    onRemoveFocus: () => void,
    orientation: $Values<typeof orientations>,
    innerMessage?: ?any,
    classes: Object,
    inputMessageClasses: ?InputMessageClasses,
    inFocus?: ?boolean,
    shrinkDisabled?: ?boolean,
    onParseDate: DateParser,
    onGetFormattedDateStringFromMoment: DateStringFromMomentFormatter,
    moment: any,
    dateCalendarTheme: Object,
    dateCalendarWidth?: ?any,
    datePopupAnchorPosition?: ?string,
    dateCalendarLocale: Object,
    dateCalendarOnConvertValueIn: (inputValue: ?string) => Date,
    dateCalendarOnConvertValueOut: (value: string) => string,
    datePlaceholder?: ?string,
    disabled?: ?boolean,
};

function checkDisabled(key){
    if (key=="years"){
        return false;
    }
    return true;
}

function getCalculatedValues(
    dateValue: ?string,
    onParseDate: DateParser,
    onGetFormattedDateStringFromMoment: DateStringFromMomentFormatter,
    moment: any,
): AgeValues {
    const adDate = bsToAd(dateValue);

    if (moment(adDate).isAfter(moment(), 'day')) {
        return {
            date: dateValue,
            years: '',
            months: '',
            days: '-1',
        };
    }   
        const { day, month, year } = calculateAge(dateValue);
        return {
            date: dateValue,
            years: year,
            months: month,
            days: day,
        };
    
    
}

const messageTypeClass = {
    error: 'innerInputError',
    info: 'innerInputInfo',
    warning: 'innerInputWarning',
    validating: 'innerInputValidating',
};

class D2AgeFieldPlain extends Component<Props> {
    static isEmptyNumbers(values: AgeValues) {
        return !values.years && !values.months && !values.days;
    }
    static isPositiveOrZeroNumber(value: any) {
        return isValidPositiveInteger(value) || Number(value) === 0;
    }

    static isValidMonth(value: any){
        return Number(value)<12;
    }

    static isValidDay(value: any){
        return Number(value)<3;
    }
    // eslint-disable-next-line complexity
    static isValidNumbers(values: AgeValues) {
        return D2AgeFieldPlain.isPositiveOrZeroNumber(values.years || '0') &&
            D2AgeFieldPlain.isPositiveOrZeroNumber(values.months || '0') &&
            D2AgeFieldPlain.isPositiveOrZeroNumber(values.days || '0');
    }

    static getNumberOrZero(value: ?string) {
        return value || 0;
    }

    onClear = () => {
        this.props.onBlur(null);
    }

    handleNumberBlur = (values: AgeValues) => {
        const { onParseDate, onGetFormattedDateStringFromMoment, onRemoveFocus, moment } = this.props;

        onRemoveFocus && onRemoveFocus();
        if (D2AgeFieldPlain.isEmptyNumbers(values)) {
            this.props.onBlur(values.date ? { date: values.date } : null);
            return;
        }

        if (!D2AgeFieldPlain.isValidNumbers(values)) {
            this.props.onBlur({ ...values, date: '' });
            return;
        }

        const today = new Date();
        const englishDate = moment(today).format('YYYY-MM-DD');
        const nepaliDate = adToBs(englishDate);

        let nepYear = nepaliDate.substring(0, 4);
        let nepMonth = nepaliDate.substring(5, 7); 
        let nepDay = nepaliDate.substring(8, 10);

        let year = D2AgeFieldPlain.getNumberOrZero(values.years);
        let month =D2AgeFieldPlain.isValidMonth(D2AgeFieldPlain.getNumberOrZero(values.months));

        let day= D2AgeFieldPlain.isValidDay(D2AgeFieldPlain.getNumberOrZero(values.days));

        let dayDifference = nepDay - day;
      

        if(dayDifference<0){
     
            dayDifference = Number(nepDay) + 30 * Math.floor(day / 30) - Number(day);
            nepMonth = Number(nepMonth) - Math.floor(day / 30);
        }

        let yearDifference = nepYear - year;
        let monthDifference = nepMonth - month;

        if(monthDifference<0){

            monthDifference = Number(nepMonth) + 12 * Math.floor(month / 12) - Number(month);
            nepYear = Number(nepYear) - Math.floor(month / 12);
        }
    
        let formattedMonthDifference = monthDifference.toString().padStart(2, '0');
        let formattedDayDifference = dayDifference.toString().padStart(2, '0');

        const calculatAgeDateBS = `${yearDifference}-${formattedMonthDifference}-${formattedDayDifference}`;

      

        const calculatedValues = getCalculatedValues(
            calculatAgeDateBS,
            onParseDate,
            onGetFormattedDateStringFromMoment,
            moment,
        );
    
        this.props.onBlur(calculatedValues);
    }

    handleDateBlur = (date: ?string, options: ?ValidationOptions) => {
        const { onParseDate, onGetFormattedDateStringFromMoment, onRemoveFocus, moment } = this.props;
        onRemoveFocus && onRemoveFocus();
        const calculatedValues = date ? getCalculatedValues(
            date,
            onParseDate,
            onGetFormattedDateStringFromMoment,
            moment) : null;
        
        this.props.onBlur(calculatedValues);
    }

    renderMessage = (key: string) => {
        const { classes, innerMessage: messageContainer } = this.props;
        if (messageContainer) {
            const message = messageContainer.message && messageContainer.message[key];
            const className = (classes && classes[messageTypeClass[messageContainer.messageType]]) || '';
            return message && (<div className={className}>{message}</div>);
        }
        return null;
    }

    renderNumberInput = (currentValues: AgeValues, key: string, label: string) => {
        let {
            innerMessage,
            onChange,
            inFocus,
            value,
            onBlur,
            dateCalendarOnConvertValueIn,
            dateCalendarOnConvertValueOut,
            dateCalendarWidth,
            datePopupAnchorPosition,
            dateCalendarTheme,
            dateCalendarLocale,
            moment,
            onParseDate,
            disabled,
            ...passOnProps } = this.props;
       
        
        return (
            <div className={defaultClasses.ageNumberInputContainer}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <AgeNumberInput
                    disabled = {checkDisabled(key)}
                    label={i18n.t(label)}
                    value={currentValues[key]}
                    onBlur={numberValue => this.handleNumberBlur({ ...currentValues, [key]: numberValue })}
                    onChange={numberValue => onChange({ ...currentValues, [key]: numberValue })}
                    {...passOnProps}
                />
                {innerMessage && this.renderMessage(key)}
            </div>
        );

    }

    renderDateInput = (currentValues: AgeValues, isVertical: boolean) => {
        const {
            onChange,
            innerMessage,
            inFocus,
            value,
            onBlur,
            shrinkDisabled,
            dateCalendarWidth,
            datePlaceholder,
            moment,
            onParseDate,
            ...passOnProps
        } = this.props;

        const dateInputContainerClass = classNames(
            { [defaultClasses.ageDateInputContainerHorizontal]: !isVertical },
        );
        return (
            <div className={dateInputContainerClass}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <AgeDateInput
                    onBlur={this.handleDateBlur}
                    value={currentValues.date}
                    onChange={date => onChange({ ...currentValues, date })}
                    calendarWidth={dateCalendarWidth}
                    placeholder={datePlaceholder}
                    {...passOnProps}
                />
                {innerMessage && this.renderMessage('date')}
            </div>

        );
    }

    render() {
        const { value, orientation, disabled } = this.props;
        const currentValues = value || {};
        const isVertical = orientation === orientations.VERTICAL;
        const containerClass = isVertical ? defaultClasses.containerVertical : defaultClasses.containerHorizontal;
        const ageClearClass = !isVertical ? defaultClasses.ageClearHorizontal : null;
        return (
            <div className={containerClass}>
                {this.renderDateInput(currentValues, isVertical)}
                {this.renderNumberInput(currentValues, 'years', 'Years')}
                {this.renderNumberInput(currentValues, 'months', 'Months')}
                {this.renderNumberInput(currentValues, 'days', 'Days')}
                <div className={ageClearClass}>
                    <IconButton disabled={!!disabled} onClick={this.onClear}>
                        <IconCross24 />
                    </IconButton>

                </div>
            </div>
        );
    }
}

export const AgeField = withInternalChangeHandler()(D2AgeFieldPlain);
