import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  CommonLayout,
  UserProfile,
  LoginForm,
  SignUpForm,
  AuthProvider,
  ContactUs,
  Loader,
  ApiDetails,
} from "./shared";
import { EmissionDataProvider } from "./context/EmissionDataContext";
import "./App.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <EmissionDataProvider>
          {isLoading && <Loader />}

          <Routes>
            <Route
              path="/"
              element={<Navigate replace to="/form?name=fuel" />}
            />
            <Route
              path="/dashboard"
              element={<Navigate replace to="/form?name=fuel" />}
            />
            <Route
              path="/profile"
              element={
                <CommonLayout>
                  <UserProfile />
                </CommonLayout>
              }
            />
            <Route
              path="/form"
              element={
                <CommonLayout>
                  <ApiDetails />
                </CommonLayout>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<SignUpForm />} />
            <Route
              path="/contactus"
              element={
                <CommonLayout>
                  <ContactUs />
                </CommonLayout>
              }
            />
          </Routes>
        </EmissionDataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
