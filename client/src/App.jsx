import { useState } from "react";
import { Footer, Navbar, Services, Transactions, Welcome } from "./components";

function App() {
  return (

      <div className="max-h-screen ">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>

        <Services />
        <Transactions />
        <Footer />
      </div>

  );
}

export default App;
