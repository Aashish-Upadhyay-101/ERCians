import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { setDefaultLoginUser } from "./store/userSlice";
import { fetchAllPosts } from "./store/postSlice";

function App() {
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const token = cookies.get("auth_token");
  useEffect(() => {
    dispatch(setDefaultLoginUser(token));
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// comment showing feature done !!! ( reply of the comment is left to show but I will handle it later )
/* before adding any new features first of all I would like to do error handling in the
front end 
 */
