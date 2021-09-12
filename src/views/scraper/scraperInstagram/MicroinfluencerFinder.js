import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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
import { CChartPie } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import PaginationBox from 'src/reusable/PaginationBox';
import * as Actions from 'src/actions/instagramActions';
import service from 'src/services/instagram';

const MicroinfluencerFinder = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColum] = useState({ field: null, sort: null });

  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [modalColor, setModalColor] = useState('primary');
  const [modalMessage, setModalMessage] = useState({ title: '', body: '' });

  const dispatch = useDispatch();
  const scrapedProfile = useSelector((state) => state.instagram.selectedScrape);

  const formattedDate =
    scrapedProfile.scraped_date &&
    new Date(scrapedProfile.scraped_date['$date']).toLocaleString('es-VE');

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const toggleModal = (color, message) => {
    setModalColor(color);
    const title = color === 'success' ? 'Scrape iniciado!' : 'Hubo un error...';
    setModalMessage({ title, body: message });
    setModal(true);
  };

  useEffect(() => {
    const getProfiles = async () => {
      setLoading(true);
      try {
        let res = await service.getScrapedProfiles(page, pageSize);
        setRowData(res.data.rows);
        setTotalPages(Math.ceil(res.data.count / pageSize));
        // console.log('response', res.data);
        return res.data;
      } catch (e) {
        console.log('error en getProfiles', e);
        setRowData(null);
        toggleModal('danger', 'Ha ocurrido un error obteniendo la data');
      } finally {
        setLoading(false);
      }
    };
    getProfiles();
  }, [page, pageSize]);

  const selectUser = (userData) => {
    dispatch(Actions.selectUser(userData));
  };

  const selectInfluencer = (userInfo) => {
    dispatch(Actions.selectInfluencer(userInfo));
  }

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

  return (
    <>
       {/* Tabla de micro-influenciadores */}
       <CRow>
        <CCol xs="12">
        <section class="buscador">
        <h3 className="card-title primary-title">Búsqueda de Micro-influenciadores en cuentas de Instagram</h3>
        <form action="" >
            <input type="text" placeholder="    usuario_ejemplo..." name="search" method="post" class="search-bar"/>
            <button type="submit" className="search-button"><i class="fa fa-search"></i></button>
        </form>
       </section>
          <CCard>
            <CCardHeader>
              <h5 className="card-title">Perfiles analizados recientemente</h5>
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
                    userComponent: (params) => (
                      <Link
                        to="/instagramscraper/scrape-summary/influencer-detail"
                        onClick={() => selectUser(params.data)}
                        // cambiar a selectInfluencer
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
                    field="follower_count"
                    headerName="# de Seguidores"
                    sortable
                    sortingOrder={['asc', null]}
                    flex={1}
                  />  
                  <AgGridColumn
                    field="comment_percent"
                    headerName="% de Engagement"
                    sortable
                    sortingOrder={['asc', null]}
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

export default MicroinfluencerFinder;
 