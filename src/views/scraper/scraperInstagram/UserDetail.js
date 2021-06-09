import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
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
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import PaginationBox from 'src/reusable/PaginationBox';
import service from 'src/services/instagram';

const UserDetail = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColum] = useState({ field: null, sort: null });

  const selectedUser = useSelector((state) => state.instagram.selectedUser);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    const updateGrid = async () => {
      const { username, date, profile_id } = selectedUser;
      setLoading(true);
      try {
        let res = await service.getUserDetails2(
          username,
          profile_id,
          date['$date'],
          page,
          pageSize,
          sortedColumn.field,
          sortedColumn.sort
        );
        // console.log('response', res.data);
        const formattedData = res.data.rows.map((e) => ({
          ...e,
          engagement: e.engagement.toFixed(3),
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
  }, [page, pageSize, sortedColumn, selectedUser]);

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
    const { username, date, profile_id } = selectedUser;
    setLoading(true);
    try {
      let response = await service.exportInteractedPostsToCsv(
        username,
        profile_id,
        date['$date']
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_interacted_posts.csv');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.log('error en export\n', e);
      setErrorModal(!errorModal);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUser || !selectedUser.date) {
    return <Redirect to="/instagramscraper" />;
  }

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
                  pagination={false}
                  paginationPageSize={20}
                  onGridReady={onGridReady}
                  onSortChanged={onSortChanged}
                  sortingOrder={['desc', 'asc', null]}
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
                  />
                  <AgGridColumn
                    field="has_commented"
                    headerName="Comentó"
                    cellRenderer="checkComponent"
                    sortable
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

export default UserDetail;
