import React from 'react'
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


const ScraperLinkedin = () => {
	return(
		<CRow>
			<CCol xs="12">
				<CCard>
					<CCardHeader>
						Scraper Linkedin
						
					</CCardHeader>
					<CRow>
						<CCol xs="8">
							<CCardBody>
								<CForm action="" method="" >
									<CFormGroup>
				                  		<CLabel htmlFor="nf-busqueda">Busqueda</CLabel>
				                  		<CInput type="text" id="nf-keywords" placeholder=""  name="nf-keywords"/>
				    	
				                	</CFormGroup>
								</CForm>
							</CCardBody>
						</CCol>
						<CCol xs="4">
							<CCardBody>
							<div className="posi-button">
								<CButton type="submit" className="btn-sepa" size="sm" color="danger">Limpiar</CButton>
			            		<CButton type="reset" className="btn-sepa" size="sm" color="success"><CHeaderNavLink to="/sistemaLeeds/searchLinkedin">Buscar</CHeaderNavLink></CButton>
							</div>	
								
							</CCardBody>
						</CCol>
					</CRow>
				</CCard>
			</CCol>
		</CRow>
	)

}

export default ScraperLinkedin