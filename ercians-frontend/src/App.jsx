import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import RightSidebar from "./components/RightSidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Feed />
      <RightSidebar />

      {/* <Signup /> */}
      {/* <Login /> */}
    </div>
  );
}

export default App;
