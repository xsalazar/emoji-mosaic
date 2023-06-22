import React from "react";
import Footer from "./Components/footer";
import Mosaic from "./Components/mosaic";

function App() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        maxHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Mosaic />
      <Footer />
    </div>
  );
}

export default App;
