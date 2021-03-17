import React, { useState } from 'react'
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
	CHeaderNavLink,
	CButton
} from '@coreui/react'



const ScraperGoogle = () => {
	
	const defaultState = {
	  nombre: ""	  
	};
	
	let [contador,setContador] = useState(0);

	const Row=({ onChange, onRemove, nombre })=> {
	  if (contador > 0) {
	  	
		  	return (

		    <CFormGroup>
		    	<CInput type="text" id="nf-keywords" placeholder=""   value={nombre}/>
		        <CButton type="" className="btn-gen" size="sm" color="danger" value={nombre} onChange={e => onChange("nombre", e.target.value)} onClick={handleOnRemove}>Eliminar input</CButton> 
		      	
		    </CFormGroup>
		  );
	  }
	  	
	  	return null

	}

	

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
			console.log('entre')
    		setRows(rows.concat(defaultState));
  		}
    	
    	
  	};

  	const handleOnRemove = (index) => {
  		setContador(contador -  1);
    	const copyRows = [...rows];
    	copyRows.splice(index, 1);
    	setRows(copyRows);
  		
    	
    	
  	};

	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					<CCardHeader>
						Scraper Google-Maps	
												
					</CCardHeader>
					<CRow>
						<CCol xs="8">
							<CCardBody>
									<CForm action="" method="" >
										<CFormGroup>
					                  		<CLabel htmlFor="nf-busqueda">Busqueda</CLabel>
					                  		<CInput type="text" id="nf-keywords" placeholder=""  name="nf-keywords"/>
					    	
					                	</CFormGroup>

					                	{rows.map((row, index) => (
								     	   	<Row								          
									          onChange={(name, value) => handleOnChange(index, name, value)}
									    	   onRemove={() => handleOnRemove(index)}
									   	       key={index}
									   	    />
								    	))}
								
				                			                
			              			</CForm>
							</CCardBody>
						</CCol>
						<CCol xs="4">
							<CCardBody>
							<div className="posi-button">

								<CButton type="" className="btn-sepa" size="sm" color="info" onClick={handleOnAdd}>Agregar Inputs</CButton>
								
								<CButton type="submit" className="btn-sepa" size="sm" color="danger">Limpiar</CButton>
			            		<CButton type="reset" className="btn-sepa" size="sm" color="success"><CHeaderNavLink to="/sistemaLeeds/searchGogle">Buscar</CHeaderNavLink></CButton>
							</div>	
								
							</CCardBody>
						</CCol>
					</CRow>
					
				</CCard>
			</CCol>

			
		</CRow>
	)

}

export default ScraperGoogle
