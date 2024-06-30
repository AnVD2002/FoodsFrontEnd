import "./Home.css";
import Header from "../Header/Header";
import ExploreMenu from "../ExploreMenu/ExploreMenu";
import FoodDisplay from "../FoodDisplay/FoodDisplay";
import Contact from "../Contact/Contact";

const Home = () => {
  return (
    <div>
      <Header></Header>
      <ExploreMenu></ExploreMenu>
      <FoodDisplay />
      <Contact></Contact>
    </div>
  );
};

export default Home;
