import React, { Fragment, useState } from 'react'
import * as XLSX from 'xlsx'
import { useHistory , withRouter } from 'react-router-dom';
import {
	CCol,
  	CRow,
  	CCard,
 	CCardHeader,
 	CCardBody,
 	CForm,
 	CFormGroup,
 	CLabel,
	CInput,
	CButton
} from '@coreui/react'
import googleDataServices from '../../../services/googleServices'



const ScraperGoogle = (props) => {
	let history = useHistory();
	const handleInputChange = (event) => {
	    const target = event.target
	    const name = target.name
	    // console.log(target)
	    // console.log(value)
	    // console.log(name)
	    let hojas = []
	    if( name === 'file'){
	    	let reader = new FileReader()
      		reader.readAsArrayBuffer(target.files[0])
      		reader.onloadend = (e) => {
		        var data = new Uint8Array(e.target.result);
		        var workbook = XLSX.read(data, {type: 'array'});
		        console.log(workbook)
		        workbook.SheetNames.forEach(function(sheetName) {
		          // Here is your object
		          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		          hojas.push({
		            data: XL_row_object,
		            sheetName
		          })
		        })
		        console.log(hojas)
		      }
	    }
	  } 


	const defaultState = {
	  nombre: ""	  
	};
	
	let [contador,setContador] = useState(0);

	const [rows, setRows] = useState([defaultState]);
	const handleOnChange = (index, name, value) => {
    	const copyRows = [...rows];
    	copyRows[index] = {
      		...copyRows[index],
      		[name]: value
    	};
    	setRows(copyRows);
  	};

  	const handleOnAdd = () => {
  		setContador(contador + 1);
  		if(contador>0){
			setRows(rows.concat(defaultState));
  		}
  	};

  	const handleOnRemove = (index) => {
  		setContador(contador -  1);
    	const copyRows = [...rows];
    	copyRows.splice(index, 1);
    	setRows(copyRows);
  	};

  	
    const enviarDatos = (event) => {
        event.preventDefault()
        // console.log('enviando datos...' + datos.inputs + ' ' + datos.inputs2)
        const ele = event.target.elements.inputs
        let status = false
        let keywords = []
        // ele.forEach(function(RadioNodeList){
        // 	keywords.push(RadioNodeList.value)
        // })
        
        
        for (var i = 0; i < ele.length; ++i) {
        	keywords.push({
        	 "inputs" : ele[i].value
        	})
        	
        	status = true
        	// code...
        }
        if (status !== true){
        	keywords.push({
        		"inputs" : ele.value})
        }
        
       	googleDataServices.create(keywords)
           .then(response => {
             console.log(response.data)
             history.push({
             	pathname: '/sistemaLeeds/searchGogle',
             	customNameData: response.data,
             });
             // props.setRecarga(true)
           })
    }

    const Row=({ onChange, onRemove, nombre })=> {
	  if (contador > 0) {
	  	
		  return (

		    <CFormGroup>
		    	<CInput type="text" name="inputs"  />
		        <CButton type="" className="btn-gen" size="sm" color="danger"  onClick={handleOnRemove}>Eliminar input</CButton> 
		      	
		    </CFormGroup>
		  );
	  }
	  	
	  	return null

	}

    return (
        <Fragment>
            <CRow>
            	<CCol xs="12">
            		<CCard>
            			<CCardHeader>
							Scraper Google-Maps	
													
						</CCardHeader>
						<CCardBody>
							<CForm  onSubmit={(e) => enviarDatos(e)}>
								<CRow>
									<CCol xs="8">
										<CFormGroup>
					                  		<CLabel htmlFor="nf-busqueda">Busqueda</CLabel>
					                  		<CInput type="text"  placeholder="busqueda"  name="inputs" />
					    					<input 
									             
									            type="file" 
									            name="file" 
									            id="file" 
									            onChange={handleInputChange} 
									            placeholder="Archivo de excel" 
									        />
					                	</CFormGroup>

					                	{rows.map((row, index) => (
								     	   	<Row								          
									          onChange={(name, value) => handleOnChange(index, name, value)}
									    	   onRemove={() => handleOnRemove(index)}
									   	       key={index}
									   	    />
								    	))}

									</CCol>
									<CCol xs="4">
										<div className="posi-button">

											<CButton type="reset" className="btn-sepa" size="sm" color="info" onClick={handleOnAdd}>Agregar Inputs</CButton>
											
											<CButton type="reset" className="btn-sepa" size="sm" color="danger">Limpiar</CButton>
						            		<CButton type="submit"  className="btn-sepa" size="sm" color="success">buscar</CButton>
										</div>	
									</CCol>
								</CRow>
							</CForm>
							
						</CCardBody>
					</CCard>
            	</CCol>
            </CRow>
        </Fragment>
    );

}

export default withRouter (ScraperGoogle)
