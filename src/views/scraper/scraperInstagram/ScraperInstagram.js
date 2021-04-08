import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact, AgGridColumn } from "ag-grid-react";

import * as Actions from 'src/actions/instagramActions';
import service from "src/services/instagram";

const ScraperInstagram = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [modal, setModal] = useState(false);
  const [modalColor, setModalColor] = useState("primary");
  const [modalMessage, setModalMessage] = useState({ title: "", body: "" });

  const dispatch = useDispatch()

  const history = useHistory();

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const getProfiles = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      let res = await service.getScrapedProfiles(page, size);
      console.log("response", res.data);
      setRowData(res.data);
      return res.data;
    } catch (e) {
      console.log("error en getProfiles", e);
      // setRowData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfiles();
  }, []);

  const navigateToScrape = (e) => {
    console.log("row clicked", e);
    console.log(e.data.id, " ", e.data.scraped_date["$date"]);
    dispatch(Actions.selectScrape(e.data));
    history.push({
      pathname: `/instagramscraper/detail`,
      state: e.data,
    });
    // history.push(`/instagramscraper/detail?userId=44889068058&timestamp=${1617559651727}`);
  };

  const startScrape = async (e) => {
    let res = null;
    e.preventDefault();
    e.target.reset();
    try {
      res = await service.startScraper(username, email);
      console.log("response", res);
    } catch (e) {
      console.log("error en startScrape", e);
    }
    if (res.status === 202) {
      setModalColor("success");
      setModalMessage({
        title: "Scrape inciado!",
        body:
          "Se ha iniciado el proceso de análisis de la cuenta indicada. Al finalizar le llegará un correo al email indicado",
      });
    } else {
      setModalColor("danger");
      setModalMessage({
        title: "Hubo un error...",
        body: "Ha ocurrido un error al inciar el scrape",
      });
    }
    setModal(true);
  };

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <h5 className="card-title">Realizar un nuevo scrape</h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="4">
                <CForm id="scrape-form" onSubmit={startScrape}>
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
                  <CButton type="submit" size="sm" color="success">
                    <CIcon name="cil-check" /> Iniciar Scrape
                  </CButton>
                </CForm>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <h5 className="card-title">Perfiles analizados recientemente</h5>
          </CCardHeader>
          <CCardBody>
            <div
              className="ag-theme-alpine instagram-grid"
              style={{ height: 550, width: "100%" }}
            >
              <AgGridReact
                rowData={rowData}
                pagination={true}
                paginationPageSize={10}
                onGridReady={onGridReady}
                onRowClicked={navigateToScrape}
              >
                <AgGridColumn
                  sortable
                  headerName="Fecha"
                  field="scraped_date"
                  checkboxSelection={false}
                  valueGetter={(params) => {
                    const unixTime = params.data.scraped_date["$date"];
                    return new Date(unixTime).toLocaleString("es-VE");
                  }}
                />
                <AgGridColumn
                  field="username"
                  headerName="Usuario"
                  filter
                  sortable
                />
                <AgGridColumn field="post_count" headerName="# de Posts" />
                <AgGridColumn field="follower_count" headerName="Followers" />
                <AgGridColumn field="following_count" headerName="Following" />
              </AgGridReact>
            </div>
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

const defaultData = [
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "Somosopentech",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "PepitoManolo",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "Platanitomaduro",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "HolaBrenda",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "NoseQueEstoyHaciendo",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "AyudaPorfavo",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "AAAAAA",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "Somosopentech",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
  {
    scraped_date: {
      $date: 123456789,
    },
    username: "Somosopentech",
    post_count: 32,
    follower_count: 248,
    following_count: 103,
  },
];
