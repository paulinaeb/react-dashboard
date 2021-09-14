import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CForm, 
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
} from '@coreui/react'; 
import CIcon from '@coreui/icons-react';
import 'ag-grid-enterprise';
import Plot from "react-plotly.js";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import PaginationBox from 'src/reusable/PaginationBox';
import * as Actions from 'src/actions/instagramActions';
import service from 'src/services/instagram';

const MicroinfluencerFinder = () => {

  const [searchUser, setSearchUser] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0); 

  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [modalColor, setModalColor] = useState('primary');
  const [modalMessage, setModalMessage] = useState({ title: '', body: '' });

  const dispatch = useDispatch();
  const history = useHistory();
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

  const navigateToScrape = (e) => { 
    console.log(e.data.id, ' ', e.data.scraped_date['$date']);
    dispatch(Actions.selectScrape(e.data));
    history.push('/micro-influencer-finder/search-detail');
  };

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

  const startFinding = async (e) => {
    let res = null;
    e.preventDefault();
    e.target.reset();
    try {
      // res = await service.startScraper(
      //   username,
      //   email,
      //   scrapingUser,
      //   scrapingPass
      // );

      // console.log("response", res); 
    } catch (e) {
      console.log('error en startScrape', e);
      toggleModal('danger', 'Ha ocurrido un error al inciar el buscador...');
    }
    if (res!= null){
      if (res.status === 202) {
        toggleModal(
          'success',
          'Su solicitud está siendo procesada. Si los datos suministrados son correctos, le llegará un correo al email indicado cuando los resultados del análisis estén listos.'
        );
      }
      else {
        toggleModal('danger', 'Ha ocurrido un error al inciar el buscador.');
      } 
    }
    else {
      toggleModal('danger', 'Ha ocurrido un error al inciar el buscador.');
    } 
  };

  return (
    <>
       {/* Tabla de micro-influenciadores */}
       <CRow>
        <CCol xs="12">
        <section className="buscador">
        <h2 className="card-title primary-title">Búsqueda de Micro-influenciadores en cuentas de Instagram</h2>
        <CForm id="search-form" onSubmit={startFinding}>
            <CInput 
              type="text" 
              placeholder="usuario_ejemplo..." 
              name="userSearch" 
              method="post" 
              class="search-bar"
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <CButton type="submit" class="search-button" disabled={!searchUser} >Ir</CButton>
        </CForm>
       </section>
      {/* tabla de perfiles buscados */}
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
                  onRowClicked={navigateToScrape}
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
                  headerName="Fecha"
                  field="scraped_date"
                  checkboxSelection={false}
                  valueGetter={(params) => {
                    const unixTime = params.data.scraped_date['$date'];
                    return new Date(unixTime).toLocaleString('es-VE');
                  }}
                  flex={1}
                  />
                  <AgGridColumn
                    field="username"
                    headerName="Usuario"
                    cellRenderer="userComponent"
                    flex={1}
                  />
                  <AgGridColumn
                    field="follower_count"
                    headerName="# de Seguidores" 
                    flex={1}
                  />  
                  <AgGridColumn
                    field="post_count"
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
                color="danger">
                <CModalHeader closeButton>
                  <CModalTitle>Hubo un error...</CModalTitle>
                </CModalHeader>
                <CModalBody>Ha ocurrido un error obteniendo la data</CModalBody>
                <CModalFooter>
                  <CButton color="danger" onClick={() => setErrorModal(!errorModal)} >
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
 