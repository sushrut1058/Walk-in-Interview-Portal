import React, { Component, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
    component: React.ElementType;
  }

const ProtectedRoute : React.FC<ProtectedRouteProps> = ({component: Component}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const [route,setRoute]= useState("/");

    if (isLoading) {
      return <div>Loading...</div>;
    }
        
    console.log(isAuthenticated)

    return (isAuthenticated) ? <Component/> : <Navigate to="/" replace />;

}

export default ProtectedRoute;