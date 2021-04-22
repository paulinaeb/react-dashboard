import React, { useState,useEffect, Suspense  } from 'react'
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
import { useHistory , withRouter } from 'react-router-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { useLocation } from "react-router-dom";
import googleDataServices from '../../../services/googleServices'
import linkedinDataServices from '../../../services/linkedinServices'

const SearchScraper = (props) => {
	let history = useHistory();
	const [gridApi, setGridApi] = useState([]);
	const [rowData,setRowData] = useState([]);
	const location = useLocation();	
	let count = location.customNameData.count;
	let document = location.customNameData.document;
	const keywords = location.customNameData.keywords;
	  const [loading, setLoading] = useState(true);

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



	
	const getSelectedRowData = () => {
	    let selectedNodes = gridApi.getSelectedNodes();
	    let selectedData = selectedNodes.map(node => node.data);
	    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
	    let datos = [];
	    // console.log(selectedData[0].NOMBRE)
	    for (var i = 0; i < selectedData.length; ++i) {
        	        	
        	datos.push(selectedData[i].NOMBRE)
        }
     	console.log(datos)
	    
	    linkedinDataServices.createGoo(datos)
	       .then(response => {
	         console.log(response.data)
	         history.push({
	         	pathname: '/sistemaLeeds/searchLinkedin',
	         	customNameData: response.data,
	         });
	       })
	  };

	const onGridReady = params => {
	    setGridApi(params.api);
	}
	
	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					
					<CCardHeader xs="12">
						<CRow>
							<CCol xs="4">
							
								Busqueda: 
							
							</CCol>
							<CCol xs="4">
							
								Count : {count}
							
							</CCol>
							<CCol xs="4">
							
								<button 
						          onClick={getSelectedRowData}
						          style={{margin: 10}}
						          >Buscar en linkedin
						        </button>
							
							</CCol>
						</CRow>
					</CCardHeader>	
					
						
					<CCardBody>
						<div className="ag-theme-alpine" style={{ height: 360, width: '100%' }}>
							
				            <AgGridReact
				            	
				            	rowData= {rowData}
				            	rowSelection="multiple"
				               	onGridReady={onGridReady}
						        pagination={true}
						        paginationPageSize={6}
						        >
				                <AgGridColumn  sortable={ true } field="NOMBRE" checkboxSelection={ true }  ></AgGridColumn>
				                <AgGridColumn field="TELEFONO" filter={ true }></AgGridColumn>
				                <AgGridColumn field="DIRECCION"></AgGridColumn>
				                <AgGridColumn field="SITIO_WEB"></AgGridColumn>
				                <AgGridColumn field="INPUT"></AgGridColumn>
				            </AgGridReact>
				        </div>
				        <Suspense fallback={<div>Loading...</div>}>
					        <loading />
					    </Suspense>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);

}

export default SearchScraper