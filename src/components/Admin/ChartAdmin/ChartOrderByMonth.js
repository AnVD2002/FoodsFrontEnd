import React, { useEffect, useState } from "react";
import apiClient from "../Axios/AxiosService";
import { Container, Paper, Typography } from "@mui/material";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

const MonthlyRevenueChart = () => {
  const [orders, setOrders] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/admin/getAllOrder");
        if (response.data.statusCodeValue === 200) {
          setOrders(response.data.body);
        } else {
          console.error("Failed to fetch orders:", response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const totalsByMonth = orders.reduce((acc, order) => {
        const date = new Date(order.localDate);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = 0;
        }

        if (order.total !== null) {
          acc[key] += parseFloat(order.total);
        }

        return acc;
      }, {});

      const formattedData = Object.keys(totalsByMonth).map((key) => ({
        month: key,
        total:
          totalsByMonth[key] !== null
            ? parseFloat(totalsByMonth[key]).toFixed(2)
            : 0,
      }));

      setMonthlyTotals(formattedData);
    }
  }, [orders]);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "24px", marginTop: "24px" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Doanh thu theo tháng
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={monthlyTotals}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              label={{ value: "", position: "insideBottom" }}
            />
            <YAxis label={{ value: "", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #cccccc",
              }}
              itemStyle={{ color: "#333333" }}
            />
            <Bar
              dataKey="total"
              fill="url(#colorRevenue)"
              name="Total Revenue"
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default MonthlyRevenueChart;
