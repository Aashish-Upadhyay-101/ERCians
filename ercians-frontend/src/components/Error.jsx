import React from "react";
import { useState, useEffect } from "react";
import "../styles/Error.css";

// use react toastify for this implementation

const Error = ({ message }) => {
  const [close, setClose] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  if (message === undefined) {
    message = "Error occor in some component";
  }
  useEffect(() => {
    // re-render this component
    setNewMessage(message);
    console.log("message set");
  }, [message]);
  return (
    <div className={close ? "display-none" : "error"}>
      <p>{newMessage}</p>
      <span onClick={() => setClose(true)}>X</span>
    </div>
  );
};

export default Error;
