import React, { useState } from 'react'
import {
	CCol,
  	CRow,
  	CCard,
 	CCardHeader,
 	CCardBody
	
} from '@coreui/react'

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';

const SearchScraper = () => {

// const [rowData, setRowData] = useState([]);
// const [gridApi, setGridApi] = useState(null);
// useEffect(() => {
//     fetch('https://www.ag-grid.com/example-assets/row-data.json')
//      .then(result => result.json())
//      .then(rowData => setRowData(rowData))
// }, []);

const [rowData] = useState([
    {Nombre: "Diseño web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "Conmar-web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "OpenTech C.A", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "Mobil-app", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "desing- Admin", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "Guyana dev", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "Dev caracas", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "Diseño web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    {Nombre: "Diseño web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
    
]);
	
	const rowStyle = { background: 'black' };

// set background colour on even rows again, this looks bad, should be using CSS classes
const getRowStyle = params => {
    if (params.node.rowIndex % 2 === 0) {
        return { background: 'red' };
    }
};

	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					
					<CCardHeader xs="12">
						<CRow>
							<CCol xs="">
							
								Busqueda: Desarrollo web
							
							</CCol>
							<CCol xs="6">
							
								Count : 9
							
							</CCol>
						</CRow>
					</CCardHeader>	
					
						
					<CCardBody>
						<div className="ag-theme-alpine" style={{ height: 360, width: '100%' }}>
							
				            <AgGridReact
				            	
				            	rowData= {rowData}
				            	rowSelection="multiple"
				               	
						        pagination={true}
						        paginationPageSize={6}
						        >
				                <AgGridColumn rowStyle={rowStyle} getRowStyle={getRowStyle} sortable={ true } field="Nombre" checkboxSelection={ true } ></AgGridColumn>
				                <AgGridColumn field="Telefono" filter={ true }></AgGridColumn>
				                <AgGridColumn field="Direccion"></AgGridColumn>
				                <AgGridColumn field="Web"></AgGridColumn>
				            </AgGridReact>
				        </div>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);




}

export default SearchScraper