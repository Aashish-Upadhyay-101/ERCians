import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import RightSidebar from "./components/RightSidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="app">
        <Sidebar />
        <Feed />
        <RightSidebar />
      </div>

      {/* <Signup /> */}
      {/* <Login /> */}
    </div>
  );
}

export default App;

{
  /* <ion-icon name="notifications-outline"></ion-icon> */
}
{
  /* <ion-icon name="chatbubbles-outline"></ion-icon> */
}
