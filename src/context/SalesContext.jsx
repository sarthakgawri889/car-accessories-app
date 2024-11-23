import { createContext, useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "../context/CurrentuserContext";
import { getSales } from "../service/sellapi.js";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const {  isAuthenticated } = useAuth0();
  const { currentUser } = useContext(CurrentUserContext);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 

  useEffect(() => {
    const fetchSales = async () => {
      try {
        if (currentUser!=null) {
          const {data} = await getSales(currentUser.sub);
          
          setSales(data);
        }
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (isAuthenticated && currentUser) {
      fetchSales();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, refreshKey]);
  

  const refreshSales = () => setRefreshKey((prev) => prev + 1);

  return (
    <SalesContext.Provider value={{ sales, loading, refreshSales }}>
      {children}
    </SalesContext.Provider>
  );
};
