const Navbar = ({ setPage }) => {
  return (
    <div className="flex gap-4 p-4 bg-gray-800 sticky top-0 z-50">
      <button
        onClick={() => setPage("dashboard")}
        className="px-4 py-2 bg-black text-white rounded shadow"
      >
        Dashboard
      </button>

      <button
        onClick={() => setPage("transactions")}
        className="px-4 py-2 bg-black text-white rounded shadow"
      >
        Transactions
      </button>
    </div>
  );
};

export default Navbar;