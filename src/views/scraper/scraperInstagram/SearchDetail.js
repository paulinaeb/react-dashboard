import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { Redirect } from 'react-router-dom';
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CWidgetProgressIcon,
  CWidgetBrand,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
} from '@coreui/react'; 
import CIcon from '@coreui/icons-react';
import Plot from "react-plotly.js";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import PaginationBox from 'src/reusable/PaginationBox'; 
import service from 'src/services/instagram';

const SearchDetail = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColum] = useState({ field: null, sort: null });

  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
 
  const scrapedProfile = useSelector((state) => state.instagram.selectedScrape);

  const formattedDate =
    scrapedProfile.scraped_date &&
    new Date(scrapedProfile.scraped_date['$date']).toLocaleString('es-VE');

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const gaussianRand = () => {
    var rand = 0;
    for (var i = 0; i < 20; i += 1) {
      rand += Math.random();
    }
    return rand;
  };

  const x = [];
  for (var i=0; i<1000; i++){
    x[i]= gaussianRand();
  };

  const trace = {
    x:x, 
    type: 'histogram',
    mode: 'markers',
    marker: { 
      line: {
        color: 'gray',
        width: 2
      }
    },
    hovertemplate: "En el rango (%{x})<br>de engagement se<br>encuentran %{y} usuarios <extra></extra>"
  };

  const data = [trace]

  const handleClick = event => {
    console.log("x vale: "+event.points[0].x+" usuarios: "+event.points[0].y); 
    console.log("rango: "+(event.points[0].x+-0.1).toFixed(1)+" - "+(event.points[0].x+0.1).toFixed(1))
}

  useEffect(() => {
    const updateGrid = async () => {
      const { id, scraped_date } = scrapedProfile;
      setLoading(true);
      try {
        let res = await service.getScrapeDetails2(
          id,
          scraped_date['$date'],
          page,
          pageSize,
          sortedColumn.field,
          sortedColumn.sort
        );
        // console.log('response', res.data);
        const formattedData = res.data.rows.map((e) => ({
          ...e,
          like_percent: e.like_percent.toFixed(1),
          comment_percent: e.comment_percent.toFixed(1),
        }));
        setRowData(formattedData);
        setTotalPages(Math.ceil(res.data.count / pageSize));
      } catch (e) {
        console.log('error en getUsersEngagement\n', e);
        setRowData(null);
        setErrorModal((showModal) => !showModal);
      } finally {
        setLoading(false);
      }
    };
    updateGrid();
  }, [page, pageSize, scrapedProfile, sortedColumn]);

  const onBtFirst = () => {
    setPage(1);
  };

  const onBtPrevious = () => {
    setPage(page - 1 > 0 ? page - 1 : 1);
  };

  const onBtNext = () => {
    setPage(page + 1 <= totalPages ? page + 1 : totalPages);
  };

  const onBtLast = () => {
    setPage(totalPages);
  };

  const onSortChanged = (event) => {
    if (!gridColumnApi) return;
    const toggledColumn = gridColumnApi
      .getColumnState()
      .find((c) => c.sort !== null);

    if (toggledColumn) {
      const sort = toggledColumn.sort === 'asc' ? 1 : -1;
      setSortedColum({ field: toggledColumn.colId, sort });
    } else {
      setSortedColum({ field: null, sort: null });
    }
  };

  const exportGrid = async () => {
    const { id, scraped_date } = scrapedProfile;
    setLoading(true);
    try {
      let response = await service.exportEngagementsToCsv(id, scraped_date['$date']);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_engagement_export.csv'); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.log('error en export\n', e);
      setErrorModal((showModal) => !showModal);
    } finally {
      setLoading(false);
    }
  };

  if (!scrapedProfile || !scrapedProfile.scraped_date) {
    return <Redirect to="/micro-influencer-finder" />;
  }

  return (
    <>
    <CCardHeader>
    <h5 className="card-title">
        {`Información sobre el perfil analizado y Micro-influenciadores potenciales identificados`}
    </h5>
    </CCardHeader>
    
      <CRow>  
          {/* Información del usuario scrapeado */}
          <CCol sm="6" xxl="5">
              <CCard> 
                <CCardHeader className="pb-0">
                  <CRow>
                    <CCol xs="7">
                      <h2>@{scrapedProfile.username}</h2>
                    </CCol>
                    <CCol xs="5" className="my-auto">
                      <h6 className="my-auto">{formattedDate}</h6>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol sm="6" className="ta-center">
                      <CWidgetProgressIcon
                        header={scrapedProfile.follower_count}
                        text="Seguidores"
                        color="gradient-info"
                        value={100}
                        className="insta-info-card"
                        inverse
                      >
                        <CIcon name="cil-people" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                    <CCol sm="6">
                      <CWidgetProgressIcon
                        header={scrapedProfile.following_count}
                        text="Siguiendo"
                        color="gradient-success"
                        value={100}
                        className="insta-info-card"
                        inverse
                      >
                        <CIcon name="cil-userFollow" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                  </CRow>
                  <CRow className="justify-content-center">
                    <CCol sm="10">
                      <CWidgetBrand
                        color="instagram"
                        rightHeader={`${scrapedProfile.total_engagement.toFixed(
                          3
                        )}%`}
                        rightFooter="ENGAGEMENT"
                        leftHeader={
                          scrapedProfile.total_likes_count +
                          scrapedProfile.total_comments_count
                        }
                        leftFooter="INTERACCIONES"
                      >
                        <CIcon name="cib-instagram" height="36" className="my-3" />
                      </CWidgetBrand>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
            {/* Distribucion normal del engagement de los seguidores */}
            <CCol sm="5" xxl="7">
              <CCard>
                <CCardHeader>
                  <h4 className="card-title">Distribución normal del Engagement de los seguidores</h4>
                </CCardHeader>
                <CCardBody className="chart-container">
                  <div className="chart-canvas" style={{ width: "100%", height: "100%" }}>
                  <Plot
                    data={data}
                    layout={{height:398}}
                    onClick={handleClick}
                  />  
                  </div>
                </CCardBody>
              </CCard>
            </CCol> 
      </CRow>
      {/* Tabla de micro - influenciadores potenciales */}
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h5 className="card-title">Micro-influenciadores potenciales identificados en los seguidores de @{scrapedProfile.username}</h5>
            </CCardHeader>
            <CCardBody>
              <div
                className="ag-theme-alpine"
                style={{ height: 520, width: '100%' }}
              >
                <AgGridReact
                  rowData={rowData}
                  pagination={false}
                  paginationPageSize={20}
                  onGridReady={onGridReady}
                  onSortChanged={onSortChanged}
                  sortingOrder={['desc', 'asc', null]}
                  frameworkComponents={{
                    iconComponent: (params) => (
                      <a
                        href={`https://www.instagram.com/${params.value}/`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <CIcon name="cib-instagram" height="24" />
                      </a>
                    ), 
                  }}
                >
                  <AgGridColumn
                    field="username"
                    headerName="Usuario"
                    cellRenderer="userComponent"
                    flex={1}
                  />
                  <AgGridColumn
                    field="like_count"
                    headerName="# de Seguidores"
                    sortable
                    sortingOrder={['asc', null]} 
                    flex={1}
                  />
                  <AgGridColumn
                    field="like_percent"
                    headerName="% de Engagement"
                    flex={1}
                  /> 
                  <AgGridColumn
                    field="username"
                    headerName="Ver Perfil"
                    cellRenderer="iconComponent"
                    flex={1}
                    maxWidth={150}
                  />
                </AgGridReact>
              </div>
              <PaginationBox
                loading={loading}
                rowData={rowData !== null}
                page={page}
                totalPages={totalPages}
                exportGrid={exportGrid}
                onBtFirst={onBtFirst}
                onBtPrevious={onBtPrevious}
                onBtNext={onBtNext}
                onBtLast={onBtLast}
              />
              <CModal
                show={errorModal}
                onClose={() => setErrorModal(!errorModal)}
                color="danger"
              >
                <CModalHeader closeButton>
                  <CModalTitle>Hubo un error...</CModalTitle>
                </CModalHeader>
                <CModalBody>Ha ocurrido un error obteniendo la data</CModalBody>
                <CModalFooter>
                  <CButton
                    color="danger"
                    onClick={() => setErrorModal(!errorModal)}
                  >
                    Cerrar
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> 
    </>
  );
};

export default SearchDetail;
 