import Routers from "./Routers";
import NectorLoader from "./components/NectorSDK/NectorLoader";

function App() {
  return (
    <>
      <NectorLoader />
      <Routers />
    </>
  );
}

export default App;
