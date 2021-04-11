import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import service from 'src/services/instagram';

const ScrapeDetail = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [errorModal, setErrorModal] = useState(false);

  const selectedUser = useSelector((state) => state.instagram.selectedUser);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    getUserInteractedPosts();
  };

  const getUserInteractedPosts = async () => {
    const { username, date, profile_id } = selectedUser;
    try {
      let res = await service.getUserDetails(
        username,
        profile_id,
        date['$date']
      );
      // console.log('response', res.data);
      const formattedData = res.data.map((e) => ({
        ...e,
        engagement: e.engagement.toFixed(3),
      }));
      setRowData(formattedData);
    } catch (e) {
      console.log('error en getUserInteractedPosts\n', e);
      setRowData(null);
      setErrorModal(!errorModal);
    }
  };

  return (
    <>
      {/* Tabla de user engagements */}
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h5 className="card-title">
                {`Posts con los que @${selectedUser.username} ha interactuado`}
              </h5>
            </CCardHeader>
            <CCardBody>
              <div
                className="ag-theme-alpine"
                style={{ height: 520, width: '100%' }}
              >
                <AgGridReact
                  rowData={rowData}
                  pagination={true}
                  paginationPageSize={20}
                  onGridReady={onGridReady}
                  frameworkComponents={{
                    iconComponent: (params) => (
                      <a
                        href={`https://www.instagram.com/p/${params.value}/`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <CIcon name="cib-instagram" height="24" />
                      </a>
                    ),
                    checkComponent: (params) =>
                      params.value ? (
                        <CIcon name="cil-check-circle" height="24" />
                      ) : (
                        <CIcon name="cil-x-circle" height="24" />
                      ),
                  }}
                >
                  <AgGridColumn
                    field="short_code"
                    headerName="Post"
                    cellRenderer="iconComponent"
                    flex={1}
                    // maxWidth={150}
                  />
                  <AgGridColumn
                    field="likes_count"
                    headerName="# de Likes"
                    sortable
                    flex={1}
                  />
                  <AgGridColumn
                    field="comments_count"
                    headerName="# de Comentarios"
                    sortable
                    flex={1}
                  />
                  <AgGridColumn
                    field="engagement"
                    headerName="% de Engagement"
                    sortable
                    flex={1}
                  />
                  <AgGridColumn
                    field="has_liked"
                    headerName="Dio Like"
                    sortable
                    cellRenderer="checkComponent"
                    flex={1}
                    // maxWidth={150}
                  />
                  <AgGridColumn
                    field="has_commented"
                    headerName="Comentó"
                    cellRenderer="checkComponent"
                    sortable
                    flex={1}
                    // maxWidth={150}
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
