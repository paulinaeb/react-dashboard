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

const SearchScraperLinkedin = () => {
	const [rowData ] = useState([
	    {Nombre: "juan perez", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "pablo cort", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "jaime lopez", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "luis angola", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "neikitsu kimura", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "harry potter", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "carlos vera", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "ana longuis", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    {Nombre: "cris brito", especialidad: "ingenireo en informatica", esperiencia: "desarrollo movil, Google", contacto: "perso"},
	    
	]);


	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					
					<CCardHeader xs="12">
						<CRow>
							<CCol xs="">
							
								Busqueda: Ingeniero en informatica
							
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
				                <AgGridColumn sortable={ true } field="Nombre" checkboxSelection={ true } ></AgGridColumn>
				                <AgGridColumn field="especialidad" filter={ true }></AgGridColumn>
				                <AgGridColumn field="esperiencia"></AgGridColumn>
				                <AgGridColumn field="contacto"></AgGridColumn>
				            </AgGridReact>
				        </div>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);

}

export default SearchScraperLinkedin