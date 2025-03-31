import { useEffect, useState } from "react";
import axios from "axios";

const Checks = () => {
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/checks");
        setChecks(response.data.checks);
      } catch (error) {
        console.error("Error fetching checks:", error);
      }
    };
    fetchChecks();
  }, []);

  return (
    <div className="table-container">
      <h1 className="table-title">Checks</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Company</th>
            <th>Check #</th>
            <th>Invoices</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.id}>
              <td>{check.id}</td>
              <td>{new Date(check.created_at).toLocaleDateString()}</td>
              <td>{check.company_name}</td>
              <td>{check.number}</td>
              <td>
                {check.invoices?.length > 0 ? check.invoices.join(", ") : "No Invoices"}
              </td>
              <td>
                {check.image?.url ? (
                  <img
                    className="check-image"
                    src={check.image.url}
                    alt="Check"
                  />
                ) : (
                  "No Image"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Checks;
