"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaChartLine } from "react-icons/fa";

type Booking = {
  status: "pending" | "confirmed" | "completed";
  createdAt: any;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        let total = 0;
        let pending = 0;
        let completed = 0;
        
        const dateCounts: Record<string, number> = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Booking;
          total++;
          if (data.status === "pending") pending++;
          if (data.status === "completed") completed++;

          if (data.createdAt) {
            const date = data.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" });
            dateCounts[date] = (dateCounts[date] || 0) + 1;
          }
        });

        setStats({ total, pending, completed });

        const formattedData = Object.keys(dateCounts)
          .map(date => ({ name: date, Bookings: dateCounts[date] }))
          .slice(-7);
          
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold text-on-surface">Dashboard Overview</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-primary/20 bg-surface p-6 shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaCalendarAlt className="text-9xl text-primary" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-2xl text-primary">
              <FaCalendarAlt />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-on-surface-muted">Total Bookings</div>
              <div className="mt-1 text-4xl font-bold text-on-surface">{stats.total}</div>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-yellow-500/20 bg-surface p-6 shadow-lg transition-all hover:border-yellow-500/50 hover:shadow-yellow-500/10 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaClock className="text-9xl text-yellow-500" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/20 text-2xl text-yellow-500">
              <FaClock />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-on-surface-muted">Pending</div>
              <div className="mt-1 text-4xl font-bold text-yellow-500">{stats.pending}</div>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-green-500/20 bg-surface p-6 shadow-lg transition-all hover:border-green-500/50 hover:shadow-green-500/10 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaCheckCircle className="text-9xl text-green-500" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/20 text-2xl text-green-500">
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-on-surface-muted">Completed</div>
              <div className="mt-1 text-4xl font-bold text-green-500">{stats.completed}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 rounded-2xl border border-primary/20 bg-surface p-6 shadow-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <FaChartLine />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Recent Booking Trends</h3>
            <p className="text-xs text-on-surface-muted">Number of bookings placed over the last 7 days.</p>
          </div>
        </div>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#C19A6B" }}
                  itemStyle={{ color: "#C19A6B" }}
                />
                <Bar dataKey="Bookings" fill="#C19A6B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-on-surface-muted">
              No recent data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
