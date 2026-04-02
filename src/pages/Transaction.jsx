import React, { useState, useEffect } from "react";
import { transactions as initialData } from "../data/mockData";

const Transaction = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [role, setRole] = useState("viewer");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(data));
  }, [data]);

  const [newTransaction, setNewTransaction] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });

  //  Filter Logic
  const filteredData = data.filter((t) => {
    const matchesSearch = t.category
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : t.type === filter;

    return matchesSearch && matchesFilter;
  });

  // Add Transaction
  const handleAdd = () => {
    if (!newTransaction.date || !newTransaction.amount || !newTransaction.category) return;

    const newEntry = {
      ...newTransaction,
      id: Date.now(),
      amount: Number(newTransaction.amount),
    };

    setData([newEntry, ...data]);

    setNewTransaction({
      date: "",
      amount: "",
      category: "",
      type: "expense",
    });
  };

  //  Delete Transaction
  const handleDelete = (id) => {
    setData(data.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-6">Transactions</h1>

      {/* 👤 Role Selector */}
      <div className="mb-4">
        <label className="mr-2 text-white font-semibold">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-400"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/*  Add Form */}
      {role === "admin" && (
        <div className="bg-gray-800 p-4 rounded shadow mb-4 flex gap-2 flex-wrap">
          <input
            type="date"
            className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-300"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Amount"
            className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-300 placeholder-gray-500"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Category"
            className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-300 placeholder-gray-500"
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
          />

          <select
            className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-300"
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      )}

      {/*  Search + Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by category..."
          className="border border-gray-600 bg-gray-800 p-2 rounded w-1/3 text-gray-400 placeholder-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/*  Table */}
      <div className="bg-gray-800 rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Category</th>
              <th className="p-3">Type</th>
              {role === "admin" && <th className="p-3">Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((t) => (
              <tr
                key={t.id}
                className="border-t border-gray-700 hover:bg-gray-700 transition"
              >
                <td className="p-3 text-gray-400">{t.date}</td>
                <td className="p-3 text-gray-400">₹{t.amount}</td>
                <td className="p-3 text-gray-400">{t.category}</td>

                <td
                  className={`p-3 ${
                    t.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.type}
                </td>

                {role === "admin" && (
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Insights */}
      <div className="mt-8 bg-gray-800 p-4 rounded shadow text-gray-400">
        <h2 className="font-semibold mb-4 text-gray-300">Insights</h2>

        {data.length > 0 && (
          <>
            {/* Highest Spending */}
            <p>
              🥇 Highest Spending:{" "}
              {
                Object.entries(
                  data
                    .filter((t) => t.type === "expense")
                    .reduce((acc, curr) => {
                      acc[curr.category] =
                        (acc[curr.category] || 0) + curr.amount;
                      return acc;
                    }, {})
                ).sort((a, b) => b[1] - a[1])[0]?.[0]
              }
            </p>

            {/* Total */}
            <p>📊 Total Transactions: {data.length}</p>

            {/* Balance */}
            <p>
              💰 Net Balance: ₹
              {data.reduce(
                (acc, t) =>
                  t.type === "income"
                    ? acc + t.amount
                    : acc - t.amount,
                0
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Transaction;