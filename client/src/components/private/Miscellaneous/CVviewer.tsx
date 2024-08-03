import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import axios from "axios";
import "../css/CVviewer.css";

interface props {
  file_: string | null;
}

const CVviewer: React.FC<props> = (file_: props) => {
    const [cvBlobUrl, setCvBlobUrl] = useState<string | null>(null);
    const auth = useAuth();

    const fetchCv = async () => {
        if(cvBlobUrl){
            setCvBlobUrl(null);
            return;
        }
        try {
          const token = await localStorage.getItem('access');
          const response = await axios.get(`http://localhost:5000/actions/cv/${auth.user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setCvBlobUrl(url);
        } catch (e) {
          console.log("Can't fetch CV", e);
        }
    };

    useEffect(()=>{fetchCv();},[])

    if (cvBlobUrl===null) return <p>Loading...</p>

    return (    
    <div className="pdf-view">
        {cvBlobUrl ? (
            <object data={cvBlobUrl} type="application/pdf" className="cv-object">
            <p>Your browser does not support PDFs. <a href={cvBlobUrl}>Download the PDF</a>.</p>
            </object>
        ) : (
            <p>Nothing to show.</p>
        )}
    </div>
  )
}

export default CVviewer;