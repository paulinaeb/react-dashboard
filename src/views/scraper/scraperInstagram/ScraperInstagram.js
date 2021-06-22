import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormGroup,
  CLabel,
  CInput,
  CForm,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import PaginationBox from 'src/reusable/PaginationBox';
import * as Actions from 'src/actions/instagramActions';
import service from 'src/services/instagram';

const ScraperInstagram = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [scrapingUser, setScrapingUser] = useState('');
  const [scrapingPass, setScrapingPass] = useState('');

  const [modal, setModal] = useState(false);
  const [modalColor, setModalColor] = useState('primary');
  const [modalMessage, setModalMessage] = useState({ title: '', body: '' });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

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
    console.log('row clicked', e);
    console.log(e.data.id, ' ', e.data.scraped_date['$date']);
    dispatch(Actions.selectScrape(e.data));
    history.push('/instagramscraper/scrape-summary');
  };

  const startScrape = async (e) => {
    let res = null;
    e.preventDefault();
    e.target.reset();
    try {
      res = await service.startScraper(
        username,
        email,
        scrapingUser,
        scrapingPass
      );
      // console.log("response", res);
      setScrapingUser('');
      setScrapingPass('');
      setUsername('');
      setEmail('');
    } catch (e) {
      console.log('error en startScrape', e);
      toggleModal('danger', 'Ha ocurrido un error al inciar el scrape');
    }
    if (res.status === 202) {
      toggleModal(
        'success',
        'Se ha iniciado el proceso de análisis de la cuenta indicada. Al finalizar le llegará un correo al email indicado'
      );
    } else {
      toggleModal('danger', 'Ha ocurrido un error al inciar el scrape');
    }
  };

  const exportGrid = async () => {
    setLoading(true);
    try {
      let response = await service.exportScrapesToCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scrapes.csv');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.log('error en export\n', e);
      toggleModal('danger', 'Ha ocurrido un error al exportar la data');
    } finally {
      setLoading(false);
    }
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

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <h5 className="card-title">Realizar un nuevo scrape</h5>
          </CCardHeader>
          <CCardBody>
            <CForm id="scrape-form" onSubmit={startScrape}>
              <CRow>
                {/* Username y E-mail */}
                <CCol md="4">
                  <CFormGroup>
                    <CLabel htmlFor="username">
                      Nombre de usuario a analizar
                    </CLabel>
                    <CInputGroup className="input-prepend">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="username"
                        placeholder="somosopentech"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">
                      Email que recibirá la notificación
                    </CLabel>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-envelope-closed" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="email"
                        name="nf-email"
                        placeholder="correito@ejemplo.com"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                  </CFormGroup>
                  <CButton
                    type="submit"
                    size="sm"
                    color="success"
                    disabled={!username || !email}
                  >
                    <CIcon name="cil-check" /> Iniciar Scrape
                  </CButton>
                </CCol>
                {/* Scraping user y scraping password */}
                <CCol md="4">
                  <CFormGroup>
                    <CLabel htmlFor="scrapingUser">
                      Usuario fake para realizar scrape
                    </CLabel>
                    <CInputGroup className="input-prepend">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="scrapingUser"
                        placeholder="Dejar en blanco para predeterminado"
                        onChange={(e) => setScrapingUser(e.target.value)}
                      />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="scrapingPass">
                      Contraseña de la cuenta fake
                    </CLabel>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="scrapingPass"
                        placeholder="Dejar en blanco para predeterminado"
                        onChange={(e) => setScrapingPass(e.target.value)}
                      />
                    </CInputGroup>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <h5 className="card-title">Perfiles analizados recientemente</h5>
          </CCardHeader>
          <CCardBody>
            <div
              className="ag-theme-alpine instagram-grid"
              style={{ height: 550, width: '100%' }}
            >
              <AgGridReact
                rowData={rowData}
                pagination={false}
                paginationPageSize={20}
                onGridReady={onGridReady}
                onRowClicked={navigateToScrape}
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
                  field="post_count"
                  headerName="# de Posts"
                  flex={1}
                />
                <AgGridColumn
                  field="follower_count"
                  headerName="Followers"
                  flex={1}
                />
                <AgGridColumn
                  field="following_count"
                  headerName="Following"
                  flex={1}
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
  );
};

export default ScraperInstagram;
