import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosConfig.js"; // 👈 your axios instance

const DomainContext = createContext(null);

export const DomainProvider = ({ children }) => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get("/meta/internship-domains");
        setDomains(res.data);
      } catch (err) {
        console.error("Failed to fetch internship domains", err);
        setError("Unable to load internship domains");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return (
    <DomainContext.Provider value={{ domains, loading, error }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomains = () => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error("useDomains must be used within a DomainProvider");
  }
  return context;
};
