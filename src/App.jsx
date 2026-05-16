import Routers from "./Routers";
import NectorLoader from "./components/NectorSDK/NectorLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <NectorLoader />
      <Routers />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
