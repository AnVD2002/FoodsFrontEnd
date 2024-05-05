import "./Home.css";
import Header from "../Header/Header";
import ExploreMenu from "../ExploreMenu/ExploreMenu";
import FoodDisplay from "../FoodDisplay/FoodDisplay";
const Home = () => {
  return (
    <div>
      <Header></Header>
      <ExploreMenu></ExploreMenu>
      <FoodDisplay />
    </div>
  );
};

export default Home;
