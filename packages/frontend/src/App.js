import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import SignIn from "./components/SignIn/SignIn";
import MFA from "./components/SignIn/MFA";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin/mfa" element={<MFA />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
