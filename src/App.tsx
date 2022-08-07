import React, { Suspense } from "react";
import HomePage from "./pages/Home";

const App = () => {
  return (
    <Suspense fallback={<></>}>
      <HomePage />
    </Suspense>
  );
};

export default App;
