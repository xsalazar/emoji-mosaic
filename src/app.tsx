import Footer from "./Components/footer.js";
import Mosaic from "./Components/mosaic.js";

export default function App() {
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
