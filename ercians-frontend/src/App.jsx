import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { login } from "./store/userSlice";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Messanger from "./pages/Messanger";
import { getCookie } from "./utils/cookieController";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  const dispatch = useDispatch();

  // get user logged in on page reload
  useEffect(() => {
    // this function return user that the token belongs to
    async function fetchDefaultUser() {
      try {
        const token = getCookie("auth_token");
        const response = await axios({
          method: "get",
          url: `http://127.0.0.1:8000/api/auth/login/default-login/${token}/`,
          data: {
            token,
          },
        });
        const user = await response.data;
        dispatch(login({ token, user })); // login action to set user and token to global state
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
          <Route
            path="/profile/:id/:username"
            element={
              <div className="home">
                <Navbar />
                <div className="app">
                  <Sidebar />
                  <Profile />
                  {/* <RightSidebar /> */}
                </div>
              </div>
            }
          />
          <Route
            path="/profile/update"
            element={
              <div className="home">
                <Navbar />
                <div className="app">
                  <Sidebar />
                  <UpdateProfile />
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/message" element={<Messanger />} />
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

// import e from "express";
// import React from "react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import "../styles/UpdateProfile.css";

// const UpdateProfile = () => {
//   const user = useSelector((state) => state.user.loggedInUser.data);

//   const [userProfileInfo, setUserProfileInfo] = useState({
//     name: "",
//     location: "",
//     bio: "",
//   });

//   const [userPasswordInfo, setUserPasswordInfo] = useState({
//     oldPassword: "",
//     newPassword: "",
//     re_newPassword: "",
//   });

//   //   const [userProfilePicture, setUserProfilePicture] = useState();

//   const handleUpdateUserProfileInfo = (e) => {
//     e.preventDefault();
//     const data = {
//       name: userProfileInfo.name,
//       location: userProfileInfo.location,
//       bio: userProfileInfo.bio,
//     };

//     console.log(data);
//   };

//   const handleUserPasswordChange = (e) => {
//     e.preventDefault();
//     const data = {
//       oldPassword: userPasswordInfo.oldPassword,
//       newPassword: userPasswordInfo.newPassword,
//       re_newPassword: userProfileInfo.re_newPassword,
//     };

//     console.log(data);
//   };

//   return (
//     <div className="update-profile">
//       <div className="profile-picture__update">
//         <div>
//           <p className="profile-picture__update__heading">Profile Picture</p>
//           <img src={"http://127.0.0.1:8000" + user.profile_picture} />
//           <div className="upload-photo">
//             <label htmlFor="upload">
//               <div className="btn-small btn-primary">Upload new</div>
//             </label>
//             <input id="upload" type="file" accept="image/png, image/jpeg" />
//           </div>
//         </div>
//       </div>

//       <div className="profile-info__update">
//         <form onSubmit={handleUpdateUserProfileInfo}>
//           <div className="form-group">
//             <label for="name">Name</label>
//             <input
//               type="text"
//               id="name"
//               className="input-field"
//               placeholder={user.name}
//               defaultValue={user.name}
//               value={userProfileInfo.name}
//               onChange={(e) =>
//                 setUserProfileInfo({
//                   ...userProfileInfo,
//                   name: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div className="form-group">
//             <label for="location">Location</label>
//             <input
//               type="text"
//               id="location"
//               className="input-field"
//               placeholder={
//                 user.location ? user.location : "Enter your location"
//               }
//               defaultValue={user.location ? user.location : ""}
//               value={userProfileInfo.location}
//               onChange={(e) =>
//                 setUserProfileInfo({
//                   ...userProfileInfo,
//                   location: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div className="form-group">
//             <label for="bio">Bio</label>
//             <textarea
//               id="bio"
//               placeholder={user.bio ? user.bio : "Enter your bio..."}
//               defaultValue={user.bio ? user.bio : ""}
//               value={userProfileInfo.bio}
//               onChange={(e) =>
//                 setUserProfileInfo({
//                   ...userProfileInfo,
//                   bio: e.target.value,
//                 })
//               }
//             ></textarea>
//           </div>
//           <div className="form-group">
//             <button type="submit" className="update-btn btn btn-primary">
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//       <div className="profile__password__change">
//         <h1 className="change__password__heading">Change password</h1>
//         <form onSubmit={handleUserPasswordChange}>
//           <div className="form-gorup">
//             <label for="old-password">old password</label>
//             <input
//               type="password"
//               id="old-password"
//               className="input-field"
//               placeholder="old password"
//               value={userPasswordInfo.oldPassword}
//               onChange={(e) =>
//                 setUserPasswordInfo({
//                   ...userPasswordInfo,
//                   oldPassword: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div className="form-gorup">
//             <label for="new-password">new password</label>
//             <input
//               type="password"
//               id="new-password"
//               className="input-field"
//               placeholder="new password"
//               value={userPasswordInfo.newPassword}
//               onChange={(e) =>
//                 setUserPasswordInfo({
//                   ...userPasswordInfo,
//                   newPassword: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div className="form-gorup">
//             <label for="re-new-password">re-new password</label>
//             <input
//               type="password"
//               id="re-new-password"
//               className="input-field"
//               placeholder="re-new password"
//               value={userPasswordInfo.re_newPassword}
//               onChange={(e) =>
//                 setUserPasswordInfo({
//                   ...userPasswordInfo,
//                   re_newPassword: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <button type="submit" className="mt btn btn-primary">
//             Update password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProfile;
