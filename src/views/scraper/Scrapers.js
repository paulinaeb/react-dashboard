import React, { useState} from 'react'
import {
	CCol,
  	CRow,
  	CCard,
  	CCardBody
} from '@coreui/react'

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';

const Scrapers = () => {
	const [rowData ] = useState([
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    {Fecha: "16/03/2021", Keywords: "ingenireo en informatica", count: "25", },
	    
	]);

	return(
		<CRow>
			<CCol xs="12">
				<CCard>
									
					<CCardBody>
						<div className="ag-theme-alpine" style={{ height: 360, width: '100%' }}>
							
				            <AgGridReact
				            	
				            	rowData= {rowData}
				            	rowSelection="multiple"
				               	
						        pagination={true}
						        paginationPageSize={6}
						        >
				                <AgGridColumn sortable={ true } field="Fecha" checkboxSelection={ true } ></AgGridColumn>
				                <AgGridColumn field="Keywords" filter={ true }></AgGridColumn>
				                <AgGridColumn field="count"></AgGridColumn>
				                
				            </AgGridReact>
				        </div>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);

}



export default Scrapers