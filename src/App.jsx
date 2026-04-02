import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Transaction from "./pages/Transaction";
import Navbar from "./components/Navbar";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <Navbar setPage={setPage} />

      {page === "dashboard" ? <Dashboard /> : <Transaction />}
    </div>
  );
}

export default App;
