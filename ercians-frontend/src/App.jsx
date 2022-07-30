import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { login, setDefaultLoginUser } from "./store/userSlice";
import { fetchAllPosts } from "./store/postSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const cookies = new Cookies();

  // get user logged in on page reload
  useEffect(() => {
    console.log("defaut user getting...");
    async function fetchDefaultUser() {
      try {
        const token = cookies.get("auth_token");
        const response = await axios({
          method: "get",
          url: `http://127.0.0.1:8000/api/auth/login/default-login/${token}/`,
          data: {
            token,
          },
        });
        const user = await response.data;
        dispatch(login({ token, user }));
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchDefaultUser();
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
