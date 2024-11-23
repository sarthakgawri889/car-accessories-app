import  { createContext, useState, useEffect,useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { CurrentUserContext } from "../context/CurrentUserContext.jsx";
import {
    getProducts,
  } from "../service/productapi.js";

  export const ProductContext = createContext();

  export const ProductProvider = ({ children }) => {
    const {  isAuthenticated } = useAuth0();
    const [refreshKey, setRefreshKey] = useState(0); 
    const [products, setProducts] = useState([]);
    const { currentUser } = useContext(CurrentUserContext);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if(currentUser!=null){
                    const { data } = await getProducts(currentUser.sub);
                    setProducts(data);
                }
              
            } catch (err) {
              console.error("Error fetching products:", err);
            }
          };
      if (isAuthenticated && currentUser) {
        fetchProducts();
      } else {
        setLoading(false);
      }
    }, [isAuthenticated,currentUser,refreshKey]);

    const refreshProducts = () => setRefreshKey((prev) => prev + 1);
    return (
      <ProductContext.Provider value={{ products, loading,refreshProducts  }}>
        {children}
      </ProductContext.Provider>
    );
  };