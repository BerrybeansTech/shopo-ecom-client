import Routers from "./Routers";
import NectorProvider from "./components/NectorSDK/NectorProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <NectorProvider>
      <Routers />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </NectorProvider>
  );
}

export default App;
