import { useQuery } from "react-query";
import ProductsTable from "../components/ProductsTable/ProductsTable";
import axios from "axios";
import "./Home.scss";
import { PRODUCTS_API_URL } from "../utils/Constants";

const Home = () => {
  const { data } = useQuery("getProducts", {
    queryFn: () => axios.get(`${PRODUCTS_API_URL}/products`),
  });

  return (
    <div className="home">
      <h1 className="home__title">🛒 Our Products</h1>
      <ProductsTable data={data?.data} />
    </div>
  );
};

export default Home;
