"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Order = {
  id: string;
  item: string;
  amount: number;
  status: string;
  customer_id: string;
  created_at?: string;
  customers?: {
    name: string;
  };
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  created_at?: string;
  loyalty_status?: string;
};

type Debt = {
  id: string;
  customer_id: string;
  amount: number;
  amount_paid: number;
  status: string;
  created_at?: string;
};

const COLORS = ["#0f7a3b", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsClient({
  orders,
  customers,
  debts,
}: {
  orders: Order[];
  customers: Customer[];
  debts: Debt[];
}) {
  const [period, setPeriod] = useState("all");

  const filteredOrders = useMemo(() => {
    return filterByPeriod(orders, period);
  }, [orders, period]);

  const monthlyRevenue = useMemo(() => {
    const grouped = new Map<string, number>();

    filteredOrders
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .forEach((order) => {
        const key = getMonthLabel(order.created_at);
        grouped.set(key, (grouped.get(key) || 0) + Number(order.amount || 0));
      });

    return Array.from(grouped.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [filteredOrders]);

  const statusBreakdown = useMemo(() => {
    const grouped = new Map<string, number>();

    filteredOrders.forEach((order) => {
      grouped.set(order.status, (grouped.get(order.status) || 0) + 1);
    });

    return Array.from(grouped.entries()).map(([status, count]) => ({
      status,
      count,
    }));
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const grouped = new Map<string, { item: string; revenue: number; count: number }>();

    filteredOrders
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .forEach((order) => {
        const key = order.item || "Unknown item";
        const existing = grouped.get(key) || {
          item: key,
          revenue: 0,
          count: 0,
        };

        existing.revenue += Number(order.amount || 0);
        existing.count += 1;

        grouped.set(key, existing);
      });

    return Array.from(grouped.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredOrders]);

  const topCustomers = useMemo(() => {
    const grouped = new Map<
      string,
      { customer: string; revenue: number; orders: number }
    >();

    filteredOrders
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .forEach((order) => {
        const customerName = order.customers?.name || "Unknown customer";

        const existing = grouped.get(order.customer_id) || {
          customer: customerName,
          revenue: 0,
          orders: 0,
        };

        existing.revenue += Number(order.amount || 0);
        existing.orders += 1;

        grouped.set(order.customer_id, existing);
      });

    return Array.from(grouped.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredOrders]);

  const customerGrowth = useMemo(() => {
    const grouped = new Map<string, number>();

    filterByPeriod(customers, period).forEach((customer) => {
      const key = getMonthLabel(customer.created_at);
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    return Array.from(grouped.entries()).map(([month, count]) => ({
      month,
      count,
    }));
  }, [customers, period]);

  const debtData = useMemo(() => {
    const totalDebt = filteredOrders
      .filter((order) => order.status === "pending")
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);

    const collectedDebt = filteredOrders
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return [
      { name: "Outstanding", value: totalDebt },
      { name: "Collected", value: collectedDebt },
    ];
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Analysis period</h2>
          <p className="mt-1 text-sm text-slate-500">
            Filter the charts by sales period.
          </p>
        </div>

        <select
          title="fnldk"    
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
        >
          <option value="all">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 12 months</option>
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue trend"
          description="Paid and delivered sales over time."
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value) => `GHS ${Number(value).toLocaleString()}`} 
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#0f7a3b"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0f7a3b" }}
                activeDot={{ r: 6, fill: "#0f7a3b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Order status"
          description="Breakdown of pending, paid, delivered, and cancelled orders."
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label
              >
                {statusBreakdown.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top products"
          description="Products/items bringing in the most money."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value) => `GHS ${Number(value).toLocaleString()}`} 
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#0f7a3b" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="revenue" position="top" formatter={(val: any) => `GHS ${Number(val).toLocaleString()}`} style={{ fontSize: '10px', fill: '#64748b' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top customers"
          description="Customers with the highest sales value."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topCustomers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customer" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value) => `GHS ${Number(value).toLocaleString()}`} 
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="revenue" position="top" formatter={(val: any) => `GHS ${Number(val).toLocaleString()}`} style={{ fontSize: '10px', fill: '#64748b' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Customer growth"
          description="New customers added over time."
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Customers"
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Debt overview"
          description="Outstanding debt versus amount collected."
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={debtData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label
              >
                {debtData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `GHS ${Number(value).toLocaleString()}`} 
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TableCard title="Best customers">
          <tbody className="divide-y divide-slate-100">
            {topCustomers.map((customer, index) => (
              <tr key={customer.customer}>
                <td className="px-4 py-3 text-sm font-bold text-slate-400">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-950">
                  {customer.customer}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {customer.orders} order(s)
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-950">
                  GHS {customer.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>

        <TableCard title="Best products">
          <tbody className="divide-y divide-slate-100">
            {topProducts.map((product, index) => (
              <tr key={product.item}>
                <td className="px-4 py-3 text-sm font-bold text-slate-400">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-950">
                  {product.item}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {product.count} sale(s)
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-950">
                  GHS {product.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {children}
    </div>
  );
}

function TableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      </div>

      <table className="w-full text-left">
        <thead className="bg-[#fafbf7] text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Count</th>
            <th className="px-4 py-3 text-right">Revenue</th>
          </tr>
        </thead>
        {children}
      </table>
    </div>
  );
}

function filterByPeriod<T extends { created_at?: string }>(items: T[], period: string) {
  if (period === "all") return items;

  const days = Number(period);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return items.filter((item) => {
    if (!item.created_at) return false;
    return new Date(item.created_at) >= cutoff;
  });
}

function getMonthLabel(date?: string) {
  if (!date) return "Unknown";

  return new Intl.DateTimeFormat("en-GH", {
    month: "short",
    year: "2-digit",
  }).format(new Date(date));
}