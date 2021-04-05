import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CWidgetProgressIcon,
  CWidgetBrand,
} from "@coreui/react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact, AgGridColumn } from "ag-grid-react";

import service from "src/services/instagram";

const ScraperInstagram = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(defaultData);

  const history = useHistory();
  const location = useLocation();

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const getUsersEngagement = async (userId, timestamp) => {
    try {
      let res = await service.getScrapedDetails(userId, timestamp);
      console.log("response", res.data);
      // setRowData(res.data);
      return res.data;
    } catch (e) {
      console.log("error en getUsersEngagement", e);
      // setRowData([]);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    const timestamp = searchParams.get("timestamp");
    getUsersEngagement(userId, timestamp);
  }, [location]);

  return (
    <>
      <CRow>
        {/* Información del usuario scrapeado */}
        <CCol sm="6" xxl="5">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs="7">
                  <h2>@usuarioscrapeado</h2>
                </CCol>
                <CCol xs="5" className="my-auto">
                  <h5 className="my-auto">20/10/2021 5:45 p.m.</h5>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="6" className="ta-center">
                  <CWidgetProgressIcon
                    header="87.500"
                    text="Followers"
                    color="gradient-info"
                    value="100"
                    className="insta-info-card"
                    inverse
                  >
                    <CIcon name="cil-people" height="36" />
                  </CWidgetProgressIcon>
                </CCol>
                <CCol sm="6">
                  <CWidgetProgressIcon
                    header="385"
                    text="Following"
                    color="gradient-success"
                    value="100"
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
                    rightHeader="3.7%"
                    rightFooter="ENGAGEMENT"
                    leftHeader="4251"
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
            {/* <CCardHeader>Doughnut Chart</CCardHeader> */}
            <CCardBody style={{height: "500px"}}>
              <CChartDoughnut
                datasets={[
                  {
                    backgroundColor: [
                      // "#41B883",
                      // "#E46651",
                      "#00D8FF",
                      "#DD1B16",
                    ],
                    data: [6000, 750],
                  },
                ]}
                labels={["Likes", "Comentarios"]}
                options={{
                  tooltips: {
                    enabled: true,
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Tabla de user engagements */}
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>Engagements de los usuarios</CCardHeader>
            <CCardBody>
              <div
                className="ag-theme-alpine instagram-grid"
                style={{ height: 500, width: "100%" }}
              >
                <AgGridReact
                  rowData={rowData}
                  // rowSelection="multiple"
                  pagination={true}
                  paginationPageSize={10}
                  onGridReady={onGridReady}
                  // onRowClicked={navigateToScrape}
                >
                  <AgGridColumn
                    sortable
                    headerName="Fecha"
                    field="fecha"
                    checkboxSelection={false}
                    // valueGetter={(params) => {
                    //   const unixTime = params.data.scraped_date["$date"];
                    //   return new Date(unixTime).toLocaleString("es-VE");
                    // }}
                  />
                  <AgGridColumn
                    field="username"
                    headerName="Usuario"
                    filter
                    sortable
                  />
                  <AgGridColumn field="posts" headerName="# de Posts" />
                  <AgGridColumn field="followers" headerName="Followers" />
                  <AgGridColumn field="following" headerName="Following" />
                </AgGridReact>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
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
