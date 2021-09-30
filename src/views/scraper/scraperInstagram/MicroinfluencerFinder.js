import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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
        let res = await service.getSearchedProfiles(page, pageSize);
        const formattedData = res.data.rows.map((e) => ({
          ...e,
          total_engagement: e.total_engagement.toFixed(1), 
        }));
        setRowData(formattedData);
        setTotalPages(Math.ceil(res.data.count / pageSize));
        console.log('response: ', res.data);
        return res.data;
      } 
      catch (e) {
        console.log('error en getSearchedProfiles', e);
        setRowData(null);
        toggleModal('danger', 'Ha ocurrido un error obteniendo la data');
      } 
      finally {
        setLoading(false);
      }
    };
    getProfiles();
  }, [page, pageSize]);

  const navigateToScrape = (e) => {  
    dispatch(Actions.selectInfluencer(e.data));
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

  const startFinding = async (e) => {
    let res = null;
    e.preventDefault();
    e.target.reset(); 
    try {
      res = await service.startFinder(
        searchUser
      );
      console.log("response", res); 
    } catch (e) {
      console.log('error en startFinding', e);
      toggleModal('danger', 'Ha ocurrido un error al inciar el buscador...');
    }
    if (res!= null){
      if (res.status === 202) {
        toggleModal(
          'success',
          'Su busqueda está siendo procesada. Usted recibirá un correo indicando el status de su solicitud.'
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
              name="searchUser" 
              method="post" 
              class="search-bar"
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <CButton type="submit" class="search-button" >Ir</CButton>
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
                    flex={1}
                  />
                  <AgGridColumn
                    field="follower_count"
                    headerName="# de Seguidores" 
                    flex={1}
                  />  
                  <AgGridColumn
                    field="total_engagement"
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
               // exportGrid={exportGrid}
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
        <CModal show={modal} onClose={() => setModal(!modal)} color={modalColor}>
        <CModalHeader closeButton>
          <CModalTitle>{modalMessage.title}</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalMessage.body}</CModalBody>
        <CModalFooter>
          <CButton color={modalColor} onClick={() => setModal(!modal)}>
            Continuar
          </CButton>
        </CModalFooter>
      </CModal>
      </CRow> 
    </>
  );
};

export default MicroinfluencerFinder;
 