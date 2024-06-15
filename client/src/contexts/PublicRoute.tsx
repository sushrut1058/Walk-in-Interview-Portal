import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PublicRouteProps {
    component: React.ElementType; // Using React.ElementType to type the component
  }

const PublicRoute : React.FC<PublicRouteProps> = ({component: Component}) => {
    const {isAuthenticated, isLoading} = useAuth();

    // if (isAuthenticated==null) return null;
    if (isLoading){
        return <div>Loading...</div>
    }

    return isAuthenticated ? <Navigate to="/home" replace /> : <Component/>;

}

export default PublicRoute;