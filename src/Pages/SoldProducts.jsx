import { useEffect, useState, useContext } from "react";
import { getSoldProduct, deleteSoldProduct } from "../service/soldapi.js";
import { CurrentUserContext } from "../context/CurrentUserContext.jsx";
import ResponsiveAppBar from "../Components/ResponsiveAppBar.jsx";
import { Box } from "@mui/material";

const SoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);

  // Fetch sold products
  useEffect(() => {
    const fetchSales = async () => {
      try {
        if (currentUser != null) {
          const response = await getSoldProduct(currentUser.sub);
          setSoldProducts(response || []); // Ensure soldProducts is always an array
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
      if (currentUser != null) {
        await deleteSoldProduct(currentUser.sub, productId);
        setSoldProducts((prevProducts) =>
          prevProducts.filter((product) => product.productId !== productId)
        );
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <>
    <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1100,
          }}
        >
          <ResponsiveAppBar />
        </Box>
        <div className="sold-products-container">
      <h1 className="page-title">List Of order</h1>
      {soldProducts && soldProducts.length > 0 ? (
        <ul className="product-list">
          {soldProducts.map((product) => (
            <li key={product.productId} className="product-item">
              <div className="product-details">
                <strong>{product.name}</strong> - {product.price} Rs. - {product.vendor}
              </div>
              <button
                onClick={() => handleDelete(product.productId)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-products">No sold products available.</p>
      )}
    </div>
    <style>{
      `
      /* General Page Styles */
.sold-products-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  margin-top: 10vh;
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
}

/* Product List */
.product-list {
  list-style-type: none;
  padding: 0;
  width: 80%;
  max-width: 800px;
  margin-top: 20px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-details {
  font-size: 1.2rem;
  color: #444;
  flex: 1;
}

.delete-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #d9363e;
}

/* No Products Message */
.no-products {
  font-size: 1.5rem;
  color: #888;
  margin-top: 20px;
  font-style: italic;
  text-align: center;
}

/* Responsive Design for Mobile */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .product-list {
    width: 90%;
  }

  .product-item {
    align-items: flex-start;
    padding: 10px 15px;
  }

  .product-details {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .delete-button {
    align-self: flex-end;
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }

  .product-item {
    padding: 10px;
  }

  .product-details {
    font-size: 0.9rem;
  }

  .delete-button {
    font-size: 0.8rem;
    padding: 5px 8px;
  }

  .no-products {
    font-size: 1.2rem;
  }
}

      
      `
      }
   

    </style>
    </>
    
  );
};

export default SoldProducts;
