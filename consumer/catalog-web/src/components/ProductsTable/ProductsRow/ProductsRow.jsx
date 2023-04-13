import "./ProductsRow.scss";

const ProductsRow = (data) => (
  <tr className="products-row">
    <td className="products-row__data">{data?.product.name}</td>
    <td className="products-row__data">{data?.product.description}</td>
    {data?.product.available ? (
      <td className="products-row__data--available">✓</td>
    ) : (
      <td className="products-row__data--unavailable">𐄂</td>
    )}
  </tr>
);

export default ProductsRow;
