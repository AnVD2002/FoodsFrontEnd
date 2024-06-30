import React from "react";
import { ShopContext } from "../../Context/ShopContext";
import { useContext } from "react";
import { Container, Paper, Typography } from "@mui/material";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

const ChartFoods = () => {
  const { allFood } = useContext(ShopContext);

  const aggregatedData = allFood.map((food) => {
    const totalOrdered = food.foodDetails.reduce(
      (acc, detail) => acc + detail.ordered,
      0
    );
    const totalRevenue = food.foodDetails.reduce(
      (acc, detail) => acc + detail.price * detail.ordered,
      0
    );
    return {
      foodName: food.foodName,
      totalOrdered,
      totalRevenue,
    };
  });

  return (
    <div>
      <Container>
        <Paper elevation={3} style={{ padding: "24px", marginTop: "24px" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Giá cả và số lượng đặt hàng
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={aggregatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="foodName"
                label={{ value: "", position: "insideBottom" }}
              />
              <YAxis
                label={{ value: "", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #cccccc",
                }}
                itemStyle={{ color: "#333333" }}
              />
              <Bar
                dataKey="totalRevenue"
                fill="url(#colorRevenue)"
                name="Total Revenue"
              />
              <Line
                type="monotone"
                dataKey="totalOrdered"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
                name="Total Ordered"
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
    </div>
  );
};

export default ChartFoods;
