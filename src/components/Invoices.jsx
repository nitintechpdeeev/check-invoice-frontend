import { useEffect, useState } from "react";
import axios from "axios";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/invoices");
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="table-container">
      <h1 className="table-title">Invoices</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Number</th>
            <th>Company</th>
            <th>Check</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.number}</td>
              <td>{invoice.company?.name}</td>
              <td>
                {invoice.checks.length > 0
                  ? invoice.checks.map((check) => check.number).join(", ")
                  : "No Check"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
