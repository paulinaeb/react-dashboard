import React, { Fragment, useState, useRef, Suspense } from 'react'
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
import Spinner from 'react-bootstrap/Spinner'


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
	      document.getElementById("tag_form").reset();    
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
        console.log(keywords)
        
       	googleDataServices.create(keywords)
           .then(response => {
             console.log(response.data)
             setLoading(false);
             history.push({

             	pathname: '/sistemaLeeds/searchGogle',
             	customNameData: response.data,
             });
             // props.setRecarga(true)
           })
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
							<CForm onSubmit={(e) => enviarDatos(e)} id="tag_form" >
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
					    					<input 
									             
									            type="file" 
									            name="file" 
									            id="file" 
									            onChange={handleInputChange} 
									            placeholder="Archivo de excel" 
									        />
					                	</CFormGroup>
					                	{ loading && <Spinner animation="border"/> }

									</CCol>
									<CCol xs="4">
										<div className="posi-button">

											<CButton type="reset" className="btn-sepa" size="sm" color="danger">Limpiar</CButton>
						            		<CButton type="submit"   className="btn-sepa" size="sm" color="success">buscar</CButton>
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
