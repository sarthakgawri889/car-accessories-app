import  { useEffect, useState,useContext } from "react";
import { getSoldProduct, deleteSoldProduct } from "../service/soldapi.js";
import { CurrentUserContext } from "../context/CurrentUserContext.jsx";
const SoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);

  // Fetch sold products
  useEffect(() => {
    const fetchSales = async () => {
      try {
        if (currentUser!=null) {
            const { data } = await getSoldProduct(currentUser.sub);
            setSoldProducts(data);
        }
       
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
    fetchSales();
  }, [currentUser]);

  // Handle delete
  const handleDelete = async (productId) => {
    try {
        if (currentUser!=null) {
            await deleteSoldProduct(currentUser.sub, productId);
            setSoldProducts(soldProducts.filter((product) => product.productId !== productId));
        }
      
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
