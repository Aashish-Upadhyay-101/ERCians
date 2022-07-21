import React from "react";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="app">
        <Sidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
