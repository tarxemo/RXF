import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./api/apolloClient";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./components/ui/use-toast";
import Navigation from "./components/navigation";
import { AuthProvider } from "./lib/auth-context";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter> {/* ✅ Added this */}
        <AuthProvider>
          <ToastProvider>
            <Navigation />
            <div className="App pt-16">
              <AppRoutes />
            </div>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
