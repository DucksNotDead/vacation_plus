import {PrismaneProvider, Toaster} from "@prismane/core";
import Router from "./router";
import {CurrentUserProvider} from "./context/currentUserContext.tsx";
import theme from "./theme.ts";
import {UnitsProvider} from "./context/unitsContext.tsx";
import {ConfirmProvider} from "./context/confirmContext.tsx";

const App = () => {
  return (
      <PrismaneProvider theme={theme}>
        <CurrentUserProvider>
          <UnitsProvider>
            <ConfirmProvider>
              <Toaster>
                <Router />
              </Toaster>
            </ConfirmProvider>
          </UnitsProvider>
        </CurrentUserProvider>
      </PrismaneProvider>
  );
};

export default App;