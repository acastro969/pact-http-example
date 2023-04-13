import ProductsRow from "./ProductsRow/ProductsRow";
import "./ProductsTable.scss";

const ProductsTable = ({ data }) => (
  <table className="products-table">
    <thead>
      <tr>
        <th className="products-table__th">Name</th>
        <th className="products-table__th">Description</th>
        <th className="products-table__th">Availability</th>
      </tr>
    </thead>
    <tbody>
      {data?.map((p) => (
        <ProductsRow key={p.id} product={p} />
      ))}
    </tbody>
  </table>
);

export default ProductsTable;
