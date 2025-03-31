import { useEffect, useState } from "react";
import axios from "axios";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:3000/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="table-container">
      <h1 className="table-title">Companies</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Companies;