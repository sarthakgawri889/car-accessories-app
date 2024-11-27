import  { useEffect, useState,useContext } from "react";
import { getSoldProduct, deleteSoldProduct } from "../service/sellapi";
import { ProductContext } from "../context/ProductContext";
const SoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const { products } = useContext(ProductContext);
console.log(products)
  // Fetch sold products
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await getSoldProduct(products?.userId);
        setSoldProducts(data);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
    fetchSales();
  }, [products]);

  // Handle delete
  const handleDelete = async (productId) => {
    try {
      await deleteSoldProduct(products?.userId, productId);
      setSoldProducts(soldProducts.filter((product) => product.productId !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div>
      <h1>Sold Products</h1>
      <ul>
        {soldProducts.map((product) => (
          <li key={product.productId}>
            <div>
              <strong>{product.name}</strong> - ${product.price} - {product.vendor}
            </div>
            <button onClick={() => handleDelete(product.productId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoldProducts;
