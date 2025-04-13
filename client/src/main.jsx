import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./AppRoutes.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { Toaster } from "sonner";
import { QueryClientProvider, QueryClient } from "react-query";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InitialLoading from "./components/InitialLoading";

const queryClient = new QueryClient();

const RootApp = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000); // Set the delay in milliseconds (e.g., 2000 = 2 seconds)

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  if (!isAppReady) {
    return <InitialLoading />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <QueryClientProvider client={queryClient} contextSharing={true}>
            <AppRoutes />
          </QueryClientProvider>
        </Router>
        <Toaster visibleToasts={1} position="top-center" richColors />
      </PersistGate>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
