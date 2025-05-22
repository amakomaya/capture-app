// @flow
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { ComponentType } from 'react';
import type { Props, ContainerProps } from './mainPage.types';
import { WorkingListsType } from './WorkingListsType';
import { MainPageStatuses } from './MainPage.constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import {
    InvalidCategoryCombinationForOrgUnitMessage,
} from './InvalidCategoryCombinationForOrgUnitMessage/InvalidCategoryCombinationForOrgUnitMessage';
import { NoSelectionsInfoBox } from './NoSelectionsInfoBox';
import { Html5QrcodeScanner,Html5QrcodeScanType } from 'html5-qrcode';
import { useConfig } from '@dhis2/app-runtime';
import { buildAppUrl } from '../../../utils/routing';

const getStyles = () => ({
    listContainer: {
        padding: 24,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
        padding: spacers.dp16,
    },
    half: {
        flex: 1,
    },
    quarter: {
        flex: 0.4,
    },
    searchBoxWrapper: {
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
}: Props) => {
    const showMainPage = useMemo(() => {
        const noProgramSelected = !programId;
        const noOrgUnitSelected = !orgUnitId;
        const isEventProgram = !trackedEntityTypeId;
        return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
    }, [programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId]);
    const [programs, setPrograms] = useState([]);
    const [scanning, setScanning] = useState(false); 
    const scannerRef = useRef(null);
    const { baseUrl } = useConfig();
    const startQRScan = () => {
        if (scanning) return;
        setScanning(true);
        
        // Clear any previous scanner instance
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear QR scanner:", error);
          });
          scannerRef.current = null;
        }
      
        scannerRef.current = new Html5QrcodeScanner('qr-reader', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        });
       
      
        scannerRef.current.render(
          decodedText => handleScanSuccess(decodedText),
          error => console.warn("QR Scan Error:", error)
        );
      };
  
    // const handleScanSuccess = (decodedText) => {
    //     const personId = decodedText.trim();
        
    //     if (scannerRef.current) {
    //       scannerRef.current.clear().catch(error => {
    //         console.error("Failed to clear QR scanner:", error);
    //       });
    //     }
        
    //     fetch(`${baseUrl}/api/tracker/enrollments/${enrollmentId}`)
    //       .then(res => res.json())
    //       .then(data => {
    //         const { enrollment, program, orgUnit, trackedEntity } = data;
    //         if (enrollment && program && orgUnit && trackedEntity) {
    //           setScanning(false);
    //           window.location.href = `/#/enrollment?enrollmentId=${enrollment}&orgUnitId=${orgUnit}&programId=${program}&teiId=${trackedEntity}`;
    //         // window.location.href = buildAppUrl('/enrollment', {
    //         //     enrollmentId: enrollment,
    //         //     orgUnitId: orgUnit,
    //         //     programId: program,
    //         //     teiId: trackedEntity
    //         //   });
              
    //         } else {
    //           alert("Incomplete enrollment data");
    //           setScanning(false);
    //         }
    //       })
    //       .catch((err) => {
    //         console.error("Error", err)
    //         setScanning(false);
    //       });
    //   };

    const handleScanSuccess = async (decodedText) => {
        const personId = decodedText.trim();
        
        try {
            // Clear scanner
            if (scannerRef.current) {
                await scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear QR scanner:", error);
                });
            }
    
            const meResponse = await fetch(`${baseUrl}/api/me.json`);
            const meData = await meResponse.json();
            const orgUnit = meData.organisationUnits?.[0]?.id;
            
            if (!orgUnit) {
                throw new Error("No organisation unit found for user");
            }
            const teiSearchUrl = `${baseUrl}/api/tracker/trackedEntities?trackedEntityType=CWkDesHkKCs&orgUnit=fZRjKrjcXzV&filter=q3NpuWzGvso:EQ:${personId}`;

            const teiSearchResponse = await fetch(teiSearchUrl);
            const teiSearchData = await teiSearchResponse.json();
            const trackedEntity = teiSearchData.trackedEntities?.[0]?.trackedEntity;
            if (!trackedEntity) {
                throw new Error("No tracked entity found with this ID");
            }
    
            const eventsUrl = `${baseUrl}/api/tracker/events?trackedEntity=${trackedEntity}&order=occurredAt:desc&pageSize=1`;
            const eventsResponse = await fetch(eventsUrl);
            const eventsData = await eventsResponse.json();
            
            const event = eventsData.events?.[0];
            if (!event) {
                throw new Error("No events found for this tracked entity");
            }
    
            const enrollment = event.enrollment;
            const program = event.program;
            window.location.href = `/#/enrollment?enrollmentId=${enrollment}&orgUnitId=${orgUnit}&programId=${program}&teiId=${trackedEntity}`;
    
        } catch (err) {
            console.error("Error in QR scan process:", err);
            alert("Error processing QR code: " + err.message);
            setScanning(false);
        }
    };

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
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className={classes.container}>
                    <div className={`${classes.half} ${classes.searchBoxWrapper}`}>
                        <SearchBox programId={programId} />
                    </div>
                    <div className={classes.quarter}>
                        <TemplateSelector />
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
