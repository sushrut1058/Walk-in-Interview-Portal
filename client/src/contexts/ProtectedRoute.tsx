import React, { Component, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
    component: React.ElementType; // Using React.ElementType to type the component
  }

const ProtectedRoute : React.FC<ProtectedRouteProps> = ({component: Component}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const [route,setRoute]= useState("/");

    // if (isAuthenticated==null) return null;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    

    // useEffect(()=>{
    //   routeDet();
    // },[])
    
    console.log(isAuthenticated)

    return (isAuthenticated) ? <Component/> : <Navigate to="/" replace />;

}

export default ProtectedRoute;