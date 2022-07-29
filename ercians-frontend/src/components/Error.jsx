import React from "react";
import { useState } from "react";
import "../styles/Error.css";

const Error = ({ message }) => {
  const [close, setClose] = useState(false);
  if (message === undefined) {
    message = "Error occor in some component";
  }
  return (
    <div className={close ? "display-none" : "error"}>
      <p>{message}</p>
      <span onClick={() => setClose(true)}>X</span>
    </div>
  );
};

export default Error;
