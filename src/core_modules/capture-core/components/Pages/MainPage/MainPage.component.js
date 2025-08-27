// @flow
import React, { useMemo,useEffect,useState } from 'react';
import { compose } from 'redux';
import { colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { ComponentType } from 'react';
import { bulkDataEntryBreadcrumbsKeys } from '../../Breadcrumbs/BulkDataEntryBreadcrumb';
import type { Props, ContainerProps } from './mainPage.types';
import { WorkingListsType } from './WorkingListsType';
import { MainPageStatuses } from './MainPage.constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import { BulkDataEntry } from '../../BulkDataEntry';
import { WidgetBulkDataEntry } from '../../WidgetBulkDataEntry';
import {
    InvalidCategoryCombinationForOrgUnitMessage,
} from './InvalidCategoryCombinationForOrgUnitMessage/InvalidCategoryCombinationForOrgUnitMessage';
import { NoSelectionsInfoBox } from './NoSelectionsInfoBox';
import { useConfig } from '@dhis2/app-runtime';

const getStyles = () => ({
    listContainer: {
        padding: 24,
        display: 'flex',
        gap: spacers.dp16,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
        padding: spacers.dp16,
    },
    left: {
        flex: 1,
    },
    right: {
        width: '260px',
    },
    searchBoxWrapper: {
        height: 'fit-content',
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
});

const MainPagePlain = ({
    programId,
    orgUnitId,
    trackedEntityTypeId,
    displayFrontPageList,
    selectedTemplateId,
    MainPageStatus,
    setShowAccessible,
    classes,
    onChangeTemplate,
    onCloseBulkDataEntryPlugin,
    onOpenBulkDataEntryPlugin,
    bulkDataEntryTrackedEntityIds,
}: Props) => {
    const showMainPage = useMemo(() => {
        const noProgramSelected = !programId;
        const noOrgUnitSelected = !orgUnitId;
        const isEventProgram = !trackedEntityTypeId;
        return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
    }, [programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId]);
    const { baseUrl } = useConfig();
    const [programs, setPrograms] = useState([]);


    if (MainPageStatus === MainPageStatuses.SHOW_BULK_DATA_ENTRY_PLUGIN) {
        return (
            <BulkDataEntry
                programId={programId}
                onCloseBulkDataEntryPlugin={onCloseBulkDataEntryPlugin}
                displayFrontPageList={displayFrontPageList}
                page={bulkDataEntryBreadcrumbsKeys.MAIN_PAGE}
                trackedEntityIds={bulkDataEntryTrackedEntityIds}
            />
        );
    }

    useEffect(() => {
        fetch(`${baseUrl}/api/programs`)
          .then(res => res.json())
          .then(data => {
            if (data?.programs) {
              setPrograms(data.programs);
            }
          })
          .catch(err => console.error("Error fetching programs:", err));
      }, []);

    return (
        <>
            {showMainPage ? (
                <>
                    {MainPageStatus === MainPageStatuses.DEFAULT && (
                        // <NoSelectionsInfoBox />
                        <div>
                        <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '30px',marginBottom:'30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' ,marginBottom:'30px'}}>
                            {/* <button onClick={startQRScan} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width:'100%',border: '2px solid #ccc', borderRadius: '8px' }}>
                            <img src="/assets/icons/icon.jpg" alt="Scan icon" style={{ width: '60px', height: '30px' , alignItems: 'center'}} /> Scan Bar/QR Code
                            </button> */}
                            <div id="qr-reader" style={{ width: '300px', marginTop: '20px' }}></div>
                            </div>
                            <div style={{ display: 'flex', gap: '5%', flexWrap: 'wrap' }}>
                                <div style={{ width: '50%' }}>
                                    <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '8px' }}>
                                        <h3>Search</h3>
                                            <SearchBox />
                                    </div>
                                </div>

                                <div style={{ width: '40%', padding: '16px', overflowY: 'auto'}}>
                                <h3>Programs</h3>
                                <ul style={{ padding: 0, listStyleType: 'none' }}>
                                    {programs.map(program => (
                                    <li key={program.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                        <a style={{color: 'inherit',textDecoration:'underline'}} href={`/api/apps/e-record/index.html#/?programId=${program.id}&selectedTemplateId=${program.id}-default&all`}>{program.displayName}</a>
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            </div>

                            
                             
                        </div>

                    </div>
                    )}
                    {MainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                        <WithoutOrgUnitSelectedMessage programId={programId} setShowAccessible={setShowAccessible} />
                    )}
                    {MainPageStatus === MainPageStatuses.CATEGORY_OPTION_INVALID_FOR_ORG_UNIT && (
                        <InvalidCategoryCombinationForOrgUnitMessage />
                    )}
                    {MainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                        <WithoutCategorySelectedMessage programId={programId} />
                    )}
                    {MainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                        <div className={classes.listContainer} data-test={'main-page-working-list'}>
                            <WorkingListsType
                                programId={programId}
                                orgUnitId={orgUnitId}
                                selectedTemplateId={selectedTemplateId}
                                onChangeTemplate={onChangeTemplate}
                                onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                            />
                            <WidgetBulkDataEntry
                                programId={programId}
                                onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className={classes.container}>
                    <div className={`${classes.left} ${classes.searchBoxWrapper}`}>
                        <SearchBox programId={programId} />
                    </div>
                    <div className={classes.right}>
                        <TemplateSelector />
                        <br />
                        <WidgetBulkDataEntry
                            programId={programId}
                            onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                        />
                    </div>
                </div>
            )}
        </>
    );
};


export const MainPageComponent: ComponentType<ContainerProps> =
    compose(
        withLoadingIndicator(),
        withErrorMessageHandler(),
        withStyles(getStyles),
    )(MainPagePlain);
