import React, {Fragment, useState} from 'react'
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
import { useLocation } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'

const ScraperLinkedin = (props) => {

	let history = useHistory();
	
	const [tags, setTags] = React.useState([]);
	const [loading, setLoading] = useState(false);

	
	const removeTag = (i) => {
	    const newTags = [ ...tags ];
	    newTags.splice(i, 1);

	    // Call the defined function setTags which will replace tags with the new value.
	    setTags(newTags);
	};

	const inputKeyDown = (e) => {
	   	

		
	    const val = e.target.value;
	    
	    if (e.key === 'Enter' && val) {
	      if (tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
	        return;
	      }
	      setTags([...tags, val]);
	      console.log(tags)
	      document.getElementById("tag_form_linkedin").reset();    
	  	} else if (e.key === 'Backspace' && !val) {
	      removeTag(tags.length - 1);
	    }
	};

	const enviarDatos = (event) => {
		setLoading(true)
        event.preventDefault()
       	let liCan = event.target.children[0].children[0].children[0].children[1].children.length
        let ul = event.target.children[0].children[0].children[0].children[1]
        
        let keywords = []
        for (var i = 0; i < liCan; ++i) {
        	if( ul.children[i].innerText !== ''){
        		
        		keywords.push({
	        	 "inputs" : ul.children[i].innerText
	        	})
        	}
        	
        	
        }
        

        
        
       	linkedinDataServices.create(keywords)
	       .then(response => {
	       	setLoading(false)
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
							<CForm  onSubmit={(e) => enviarDatos(e)} id="tag_form_linkedin">
								<CRow>
									<CCol xs="8">
										<CFormGroup>
					                  		<CLabel htmlFor="nf-busqueda">Busqueda</CLabel>
					                  		<ul className="input-tag__tags">
										        { tags.map((tag, i) => (
										          <li key={tag}>
										            {tag}
										            <button type="button" onClick={() => { removeTag(i); }}></button>
										          </li>
										        ))}
										        <li className="input-tag__tags__input">
										        	<CInput  type="text" name="inputs" onKeyDown={(e) => inputKeyDown(e) }
										        	 onKeyPress={(e)=>{e.key === 'Enter' && e.preventDefault();}} />
										       
										        </li>
										     </ul>
					    					
					                	</CFormGroup>
					                	{ loading && <Spinner animation="border"/> }

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

export default ScraperLinkedin

