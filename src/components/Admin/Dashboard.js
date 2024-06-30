import { CssBaseline, Box } from "@mui/material";
import RevenueDisplayBox from "./ChartAdmin/TotalOrder";
import QuantityDisplayBox from "./ChartAdmin/QuantityOrder";
import ChartFoods from "./ChartAdmin/ChartFoods";
import NewOrderDisplayBox from "./ChartAdmin/ChatNewOrder";
import UserOrderDisplayBox from "./ChartAdmin/ChartUser";
import MonthlyRevenueChart from "./ChartAdmin/ChartOrderByMonth";

function App() {
  return (
    <>
      <CssBaseline />

      <Box component="main" sx={{ p: 3 }}>
        {/* Main content goes here */}
      </Box>

      <div style={{ display: "flex" }}>
        <RevenueDisplayBox />
        <QuantityDisplayBox />
        <NewOrderDisplayBox />
        <UserOrderDisplayBox />
      </div>
      <ChartFoods />
      <MonthlyRevenueChart />
    </>
  );
}

export default App;
