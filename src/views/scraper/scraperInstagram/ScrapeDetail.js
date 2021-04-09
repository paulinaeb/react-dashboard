import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
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
  CButton
} from '@coreui/react';
import { CChartPie } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import * as Actions from 'src/actions/instagramActions';
import service from 'src/services/instagram';

const ScrapeDetail = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [errorModal, setErrorModal] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const scrapedProfile = useSelector((state) => state.instagram.selectedScrape);

  if (!scrapedProfile || !scrapedProfile.scraped_date) {
    history.push('/instagramscraper');
    return null;
  }

  const formattedDate = new Date(
    scrapedProfile.scraped_date['$date']
  ).toLocaleString('es-VE');

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    getUsersEngagement();
  };

  const getUsersEngagement = async () => {
    const { id, scraped_date } = scrapedProfile;
    try {
      let res = await service.getScrapeDetails(id, scraped_date['$date']);
      // console.log('response', res.data);
      const formattedData = res.data.map((e) => ({
        ...e,
        like_percent: e.like_percent.toFixed(3),
        comment_percent: e.comment_percent.toFixed(3),
      }));
      setRowData(formattedData);
    } catch (e) {
      console.log('error en getUsersEngagement\n', e);
      setRowData(null);
      setErrorModal(!errorModal);
    }
  };

  const selectUser = (userData) => {
    dispatch(Actions.selectUser(userData));
  };

  return (
    <>
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
                    text="Followers"
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
                    text="Following"
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
        {/* Pie chart */}
        <CCol sm="6" xxl="7">
          <CCard>
            <CCardHeader>
              <h5 className="card-title">Distribución de interacciones</h5>
            </CCardHeader>
            <CCardBody className="chart-container">
              <div className="chart-canvas">
                <CChartPie
                  datasets={[
                    {
                      backgroundColor: [
                        // "#41B883",
                        // "#E46651",
                        '#00D8FF',
                        '#DD1B16',
                      ],
                      data: [
                        scrapedProfile.total_likes_count,
                        scrapedProfile.total_comments_count,
                      ],
                    },
                  ]}
                  labels={['Likes', 'Comentarios']}
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Tabla de user engagements */}
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h5 className="card-title">Engagements de los usuarios</h5>
            </CCardHeader>
            <CCardBody>
              <div
                className="ag-theme-alpine"
                style={{ height: 520, width: '100%' }}
              >
                <AgGridReact
                  rowData={rowData}
                  pagination={true}
                  paginationPageSize={10}
                  onGridReady={onGridReady}
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
                    userComponent: (params) => (
                      <Link
                        to="/instagramscraper/scrape-summary/user-detail"
                        onClick={() => selectUser(params.data)}
                      >
                        {params.value}
                      </Link>
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
                    headerName="# de Likes"
                    sortable
                    flex={1}
                  />
                  <AgGridColumn
                    field="like_percent"
                    headerName="% de Likes"
                    flex={1}
                  />
                  <AgGridColumn
                    field="comment_count"
                    headerName="# de Comentarios"
                    sortable
                    flex={1}
                  />
                  <AgGridColumn
                    field="comment_percent"
                    headerName="% de Comentarios"
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
                  <CButton color="danger" onClick={() => setErrorModal(!errorModal)}>
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

export default ScrapeDetail;
