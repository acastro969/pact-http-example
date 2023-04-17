import ProductsTable from "../components/ProductsTable/ProductsTable";
import { getAllProducts } from "../services/ProductsService";
import "./Home.scss";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState();

  useEffect(() => {
    getAllProducts().then((response) => setProducts(response.data));
  }, []);

  return (
    <div className="home">
      <h1 className="home__title">🛒 Our Products</h1>
      <ProductsTable data={products} />
    </div>
  );
};

export default Home;
