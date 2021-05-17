// @flow
import i18n from '@dhis2/d2-i18n';

export const statusTypes = {
    ACTIVE: 'ACTIVE',
    SCHEDULE: 'SCHEDULE',
    COMPLETED: 'COMPLETED',
    OVERDUE: 'OVERDUE',
    SKIPPED: 'SKIPPED',
    VISITED: 'VISITED',
};


export const translatedStatusTypes = (options?: string) => ({
    [statusTypes.ACTIVE]: i18n.t('Active'),
    [statusTypes.SCHEDULE]: i18n.t('Scheduled: due {{ time }}', { time: options }),
    [statusTypes.COMPLETED]: i18n.t('Completed'),
    [statusTypes.OVERDUE]: i18n.t('Overdue'),
    [statusTypes.SKIPPED]: i18n.t('Skipped'),
    [statusTypes.VISITED]: i18n.t('Visited'),
});

