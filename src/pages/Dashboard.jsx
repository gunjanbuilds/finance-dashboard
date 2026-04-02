import React from "react";
import { transactions } from "../data/mockData";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {

  //  Calculations
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  //  Line Chart Data (Balance over time)
  const chartData = transactions.map((t, index) => {
    return {
      date: t.date,
      balance: transactions
        .slice(0, index + 1)
        .reduce(
          (acc, curr) =>
            curr.type === "income"
              ? acc + curr.amount
              : acc - curr.amount,
          0
        ),
    };
  });

  //  Pie Chart Data (Category-wise expenses)
  const categoryData = Object.values(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = { name: curr.category, value: 0 };
        }
        acc[curr.category].value += curr.amount;
        return acc;
      }, {})
  );

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/*  Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 text-gray-500 shadow p-4 rounded">
          <h2>Total Balance</h2>
          <p className="text-xl text-white font-bold">₹{balance}</p>
        </div>

        <div className="bg-gray-800 text-gray-500 shadow p-4 rounded">
          <h2>Income</h2>
          <p className="text-green-600 text-xl font-bold">₹{income}</p>
        </div>

        <div className="bg-gray-800 text-gray-500 shadow p-4 rounded">
          <h2>Expenses</h2>
          <p className="text-red-600 text-xl font-bold">₹{expense}</p>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-2 gap-6 mt-8">

        {/* Line Chart */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="mb-4 text-white font-semibold">Balance Trend</h2>
          <LineChart width={400} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="mb-4 text-white font-semibold">Spending Breakdown</h2>
          <PieChart width={400} height={250}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;