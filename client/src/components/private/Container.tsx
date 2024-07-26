import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ContainerProps {
  activeComponent: React.ReactElement | undefined;
}

const Container: React.FC<ContainerProps> = ({activeComponent}) => {
    return <>{activeComponent}</>
}

export default Container;