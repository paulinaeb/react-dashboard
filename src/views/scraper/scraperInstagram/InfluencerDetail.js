import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader, 
} from '@coreui/react'; 

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; 
import service from 'src/services/instagram';

const InfluencerDetail = () => {   
  // const selectedInfluencer = useSelector((state) => state.instagram.selectedInfluencer);
 
  // useEffect(() => {
  //   const info = async () => {
  //   //   const { username, date, profile_id } = selectedInfluencer; 
  //   };
    
  // },  
  // ); 

  // if (!selectedInfluencer) {
  //   return <Redirect to="/instagramscraper" />;
  // }

  return (
    <>
      {/* Tabla de user engagements */}
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h5 className="card-title">
                {/* {`Información sobre @${selectedInfluencer.username}, su perfil e interacciones`} */}
                {`Información sobre usuario, su perfil e interacciones`}
              </h5>
            </CCardHeader>
            <CCardBody>
               
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default InfluencerDetail;
