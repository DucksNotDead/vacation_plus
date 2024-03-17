import Header from "./components/header";
import AppRouter from "./router";
import {UserContextProvider} from "./context/userContext";

function App() {
  return (
      <UserContextProvider>
        <div className={"App"}>
          <div className={"app-page"}>
            <Header/>
            <div className={"p-sm pt-md"}>
              <AppRouter/>
            </div>
          </div>
        </div>
      </UserContextProvider>
  )
}

export default App;

