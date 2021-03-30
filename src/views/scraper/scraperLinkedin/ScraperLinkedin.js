import React, {Fragment} from 'react'
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
import { useHistory , withRouter } from 'react-router-dom';
import linkedinDataServices from '../../../services/linkedinServices'


const ScraperLinkedin = (props) => {

	let history = useHistory();

	const enviarDatos = (event) => {
        event.preventDefault()
        const ele = event.target.elements.inputs
        let status = false
        let keywords = []
        
        if (status !== true){
        	keywords.push({
        		"inputs" : ele.value})
        }

        
        
       	linkedinDataServices.create(keywords)
	       .then(response => {
	         console.log(response.data)
	         history.push({
	         	pathname: '/sistemaLeeds/searchLinkedin',
	         	customNameData: response.data,
	         });
	       })
    }

	return(
		<Fragment>
            <CRow>
            	<CCol xs="12">
            		<CCard>
            			<CCardHeader>
							Scraper Linkedin
													
						</CCardHeader>
						<CCardBody>
							<CForm  onSubmit={(e) => enviarDatos(e)}>
								<CRow>
									<CCol xs="8">
										<CFormGroup>
					                  		<CLabel htmlFor="nf-busqueda">Busqueda</CLabel>
					                  		<CInput type="text"  placeholder="busqueda"  name="inputs" />
					    					
					                	</CFormGroup>


									</CCol>
									<CCol xs="4">
										<div className="posi-button">

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
	)

}

export default withRouter (ScraperLinkedin)

