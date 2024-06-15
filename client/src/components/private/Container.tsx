import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

interface ContainerProps {
  activeComponent: React.ReactElement | undefined;
}

const Container: React.FC<ContainerProps> = ({activeComponent}) => {
    return <>{activeComponent}</>
}

export default Container;