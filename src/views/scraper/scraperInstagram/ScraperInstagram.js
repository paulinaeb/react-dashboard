import React, { useEffect, useState } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact, AgGridColumn } from "ag-grid-react";

import service from "src/services/instagram";

const ScraperInstagram = () => {
  // const [gridApi, setGridApi] = useState(null);
  // const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  // const onGridReady = (params) => {
  //   setGridApi(params.api);
  //   setGridColumnApi(params.columnApi);
  // };

  const getProfiles = async (page = 0, size = 10) => {
    try {
      let res = await service.getScrapedProfiles(page, size);
      console.log("response", res.data);
      setRowData(res.data);
      return res.data;
    } catch (e) {
      console.log("error en getProfiles", e);
      setRowData([]);
    }
  };

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>Realizar un nuevo scrape</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="4">
                <CForm action="" method="post">
                  <CFormGroup>
                    <CLabel htmlFor="username">
                      Nombre de usuario a analizar
                    </CLabel>
                    <CInput
                      name="username"
                      placeholder="somosopentech"
                      required
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">
                      Email que recibirá la notificación
                    </CLabel>
                    <CInput
                      type="email"
                      id="nf-email"
                      name="nf-email"
                      placeholder="Enter Email.."
                      autoComplete="email"
                    />
                  </CFormGroup>
                  <CButton type="submit" size="sm" color="success">
                    <CIcon name="cil-scrubber" /> Iniciar Scrape
                  </CButton>
                </CForm>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>Perfiles analizados recientemente</CCardHeader>
          <CCardBody>
            <div
              className="ag-theme-alpine"
              style={{ height: 420, width: "100%" }}
            >
              <AgGridReact
                rowData={rowData}
                // rowSelection="multiple"
                pagination={true}
                paginationPageSize={5}
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
    </CRow>
  );
};

export default ScraperInstagram;

const defaultData = [
  {
    fecha: "16/03/2021",
    username: "Somosopentech",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "PepitoManolo",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "Platanitomaduro",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "HolaBrenda",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "NoseQueEstoyHaciendo",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "AyudaPorfavo",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "AAAAAA",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "Somosopentech",
    posts: 32,
    followers: 248,
    following: 103,
  },
  {
    fecha: "16/03/2021",
    username: "Somosopentech",
    posts: 32,
    followers: 248,
    following: 103,
  },
];
