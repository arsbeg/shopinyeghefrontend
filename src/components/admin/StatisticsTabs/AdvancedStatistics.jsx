import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function AdvancedStatistics() {
    const { token } = useAuth();

    // FILTERS

    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("");
    const [storeId, setStoreId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);

    // =========================
    // DATA
    // =========================

    const [statistics, setStatistics] = useState([]);

    // What should the graph show?
    // "sales" or "quantity"
    const [graphType, setGraphType] = useState("sales");

    // =========================
    // FETCH STATISTICS
    // =========================

    const fetchStatistics = async () => {
        try {
            const res = await api.get("/Statistics/graph_statistics", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

                params: {
                    year: year || undefined,
                    month: month || undefined,
                    store_id: storeId || undefined,
                    category_id: categoryId || undefined,
                },
            });

            setStatistics(res.data.statistics || []);

        } catch (err) {
            console.error("Statistics error:", err);
            setStatistics([]);
        }
    };

    // Fetch Stores
    const fetchStores = async () => {
        try {
            const res = await api.get("/Store/all");
            setStores(res.data);
        } catch (err) {
            console.error("Error fetching stores:", err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    // Fetch whenever filters change
    useEffect(() => {
        if (token) {
            fetchStatistics();
        }
    }, [token, year, month, storeId, categoryId]);

    // Fetch categories
    const fetchCategories = async (storeId) => {
        // If "All Stores" is selected
        if (!storeId) {
            setCategories([]);
            setCategoryId("");
            return;
        }

        try {
            const res = await api.get(`/Category/cat-by-storeid/${storeId}`);

            setCategories(res.data);
            setCategoryId(""); // reset category when store changes

        } catch (err) {
            console.error("Error fetching categories:", err);
            setCategories([]);
        }
    };

    useEffect(() => {
        if (storeId) {
            fetchCategories(storeId);
        } else {
            setCategories([]);
            setCategoryId("");
        }
    }, [storeId]);

    // =========================
    // GRAPH SETTINGS
    // =========================

    const graphDataKey =
        graphType === "sales"
            ? "total_sales"
            : "total_quantity";

    const graphTitle =
        graphType === "sales"
            ? "💰 Sales"
            : "📦 Quantity";

    // Determine what time_group represents
    const timeLabel = month
        ? "Day"
        : year
            ? "Month"
            : "Year";

    // =========================
    // TOTALS
    // =========================

    const totalSales = statistics.reduce(
        (sum, item) => sum + Number(item.total_sales || 0),
        0
    );

    const totalQuantity = statistics.reduce(
        (sum, item) => sum + Number(item.total_quantity || 0),
        0
    );

    // =========================
    // RENDER
    // =========================

    return (
        <div className="p-2 md:p-4">

            {/* TITLE */}

            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
                📊 Statistics
            </h1>


            {/* =========================
          FILTERS
      ========================= */}

            <div className="bg-white rounded-2xl shadow-md p-4 mb-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* YEAR */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Year
                        </label>

                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">All Years</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                        </select>
                    </div>


                    {/* MONTH */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Month
                        </label>

                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">All Months</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>


                    {/* STORE */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Store
                        </label>

                        <select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">All Stores</option>

                            {stores.map((s) => (
                                <option key={s.id} value={s.id}>{s.st_name}</option>
                            ))}
                        </select>
                    </div>


                    {/* CATEGORY */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={!storeId}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">{storeId ? "All Categories" : "Select a Store First"}</option>

                            {/* 
                Later replace these with your categories.map()
              */}
                            {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.cat_name}</option>
                            ))}
                        </select>
                    </div>

                </div>

            </div>


            {/* =========================
          TOTAL CARDS
      ========================= */}

            <div className="grid grid-cols-2 gap-4 mb-5">

                {/* SALES */}

                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl shadow-md p-4">

                    <div className="text-sm opacity-90">
                        💰 Total Sales
                    </div>

                    <div className="text-xl md:text-2xl font-bold mt-1">
                        {totalSales.toLocaleString()} ֏
                    </div>

                </div>


                {/* QUANTITY */}

                <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-2xl shadow-md p-4">

                    <div className="text-sm opacity-90">
                        📦 Products Sold
                    </div>

                    <div className="text-xl md:text-2xl font-bold mt-1">
                        {totalQuantity.toLocaleString()}
                    </div>

                </div>

            </div>


            {/* =========================
          GRAPH BUTTONS
      ========================= */}

            <div className="flex justify-center mb-4">

                <div className="bg-gray-100 rounded-full p-1 shadow-inner">

                    {/* SALES */}

                    <button
                        onClick={() => setGraphType("sales")}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${graphType === "sales"
                            ? "bg-white shadow-md text-green-600"
                            : "text-gray-500"
                            }`}
                    >
                        💰 Sales
                    </button>


                    {/* QUANTITY */}

                    <button
                        onClick={() => setGraphType("quantity")}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${graphType === "quantity"
                            ? "bg-white shadow-md text-blue-600"
                            : "text-gray-500"
                            }`}
                    >
                        📦 Quantity
                    </button>

                </div>

            </div>


            {/* =========================
          GRAPH
      ========================= */}

            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-5">

                <div className="flex justify-between items-center mb-4">

                    <div>

                        <h2 className="text-lg md:text-xl font-bold text-gray-800">
                            {graphTitle}
                        </h2>

                        <p className="text-sm text-gray-500">
                            By {timeLabel}
                        </p>

                    </div>

                </div>


                <div className="w-full h-[350px]">

                    {statistics.length > 0 ? (

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart
                                data={statistics}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 10,
                                    bottom: 10,
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    opacity={0.3}
                                />

                                <XAxis
                                    dataKey="time_group"
                                    tick={{ fontSize: 12 }}
                                />

                                <YAxis
                                    tick={{ fontSize: 12 }}
                                />

                                <Tooltip
                                    formatter={(value) =>
                                        graphType === "sales"
                                            ? [`${Number(value).toLocaleString()} ֏`, "Sales"]
                                            : [value, "Quantity"]
                                    }
                                />

                                <Line
                                    type="monotone"
                                    dataKey={graphDataKey}
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 7 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    ) : (

                        <div className="h-full flex items-center justify-center text-gray-400">
                            No statistics available
                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}