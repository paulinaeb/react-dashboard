import React, { useState, useEffect } from 'react'
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
import linkedinDataServices from '../../../services/linkedinServices'
import { useLocation } from "react-router-dom";

const SearchScraperLinkedin = (props) => {

	const [rowData,setRowData] = useState([])
	const location = useLocation();

	let count = location.customNameData.count;
	let document = location.customNameData.document;
	const keywords = location.customNameData.keywords;
	const getPeople = id => {
	     linkedinDataServices.get(id)
	      .then(response => {
	        console.log(response.data);
	        setRowData(response.data)
	      })
	      .catch(e => {
	        console.log(e);
	      });
	  };

	useEffect(() => {
	    getPeople(document);
	}, [document]);


	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					
					<CCardHeader xs="12">
						<CRow>
							<CCol xs="">
							
								Busqueda: {keywords[0]}
							
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
				                <AgGridColumn sortable={ true } field="Nombre" checkboxSelection={ true } ></AgGridColumn>
				                <AgGridColumn field="Especialidad" filter={ true }></AgGridColumn>
				                <AgGridColumn field="ExperienciaLaboral"></AgGridColumn>
				                <AgGridColumn field="Contacto.Perfil"></AgGridColumn>
				                <AgGridColumn field="Contacto.Sitios_Web"></AgGridColumn>
				                <AgGridColumn field="Contacto.Twitter"></AgGridColumn>
				                <AgGridColumn field="Contacto.Cumpleanios"></AgGridColumn>

				            </AgGridReact>
				        </div>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);

}

export default SearchScraperLinkedin