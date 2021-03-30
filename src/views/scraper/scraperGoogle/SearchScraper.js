import React, { useState,useEffect } from 'react'
import {
	CCol,
  	CRow,
  	CCard,
 	CCardHeader,
 	CCardBody
	
} from '@coreui/react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { useLocation } from "react-router-dom";
import googleDataServices from '../../../services/googleServices'

const SearchScraper = (props) => {

	const [rowData,setRowData] = useState([])
	const location = useLocation();	
	let count = location.customNameData.count;
	let document = location.customNameData.document;
	const keywords = location.customNameData.keywords;
	console.log(keywords)
	const getLocations = id => {
	     googleDataServices.get(id)
	      .then(response => {
	        console.log(response.data);
	        setRowData(response.data)
	      })
	      .catch(e => {
	        console.log(e);
	      });
	  };

	useEffect(() => {
	    getLocations(document);
	}, [document]);

	// const [rowData] = useState([
	//     {Nombre: "Diseño web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "Conmar-web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "OpenTech C.A", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "Mobil-app", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "desing- Admin", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "Guyana dev", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "Dev caracas", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "Diseño web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	//     {Nombre: "Diseño web", Telefono: "0212-2214548", Direccion: "caracas - venezuela", Web: "www.web-diseño.com"},
	    
	// ]);
	
	
	// useEffect(() => {
	//        console.log(location.pathname); // result: '/secondpage'
	//        console.log(location.customNameData); // result: '?query=abc'
	// }, [location]);
	// useEffect(() => {
 //     fetch('https://www.ag-grid.com/example-assets/row-data.json')
	//     .then(result => result.json())
	//      .then(rowData => setRowData(rowData))
	//  }, []);

	
	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					
					<CCardHeader xs="12">
						<CRow>
							<CCol xs="">
							
								Busqueda: 
							
							</CCol>
							<CCol xs="6">
							
								Count : {count}
							
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
				                <AgGridColumn  sortable={ true } field="NOMBRE" checkboxSelection={ true } ></AgGridColumn>
				                <AgGridColumn field="TELEFONO" filter={ true }></AgGridColumn>
				                <AgGridColumn field="DIRECCION"></AgGridColumn>
				                <AgGridColumn field="SITIO_WEB"></AgGridColumn>
				                <AgGridColumn field="INPUT"></AgGridColumn>
				            </AgGridReact>
				        </div>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);

}

export default SearchScraper