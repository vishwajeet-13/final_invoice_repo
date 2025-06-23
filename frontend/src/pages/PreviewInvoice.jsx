import { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PreviewInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestInvoice = async () => {
      try {
        if (location?.state?.invoice) {
          setInvoice(location.state.invoice);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://invoice-backend-846x.onrender.com/invoices/latest/`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setInvoice(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setLoading(false);
      }
    };

    fetchLatestInvoice();
  }, [location?.state?.invoice]);

  const calculateItemTotal = useCallback((item) => {
    const baseTotal = item.quantity * item.rate;
    const gstAmount = (baseTotal * item.gst) / 100;
    return baseTotal + gstAmount;
  }, []);

  const subtotal = useMemo(() => {
    if (!invoice?.invoice_items) return 0;
    return invoice.invoice_items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );
  }, [invoice?.invoice_items]);

  const totalGST = useMemo(() => {
    if (!invoice?.invoice_items) return 0;
    return invoice.invoice_items.reduce(
      (acc, item) => acc + (item.quantity * item.rate * item.gst) / 100,
      0
    );
  }, [invoice?.invoice_items]);

  const totalAmount = useMemo(() => subtotal + totalGST, [subtotal, totalGST]);

  const handlePrint = useCallback(() => {
    const nonPrintableElements = document.querySelectorAll(".no-print");
    nonPrintableElements.forEach((el) => {
      el.style.display = "none";
    });

    const printStyles = `
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-content, .printable-content * {
            visibility: visible;
          }
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0.5in;
          }
        }
      </style>
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles
      .replace("<style>", "")
      .replace("</style>", "");
    document.head.appendChild(styleElement);

    window.print();

    setTimeout(() => {
      document.head.removeChild(styleElement);
      nonPrintableElements.forEach((el) => {
        el.style.display = "";
      });
    }, 1000);
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    try {
      const printWindow = window.open("", "_blank");

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice.inv_num}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page { size: A4; margin: 0.5in; }
                body { print-color-adjust: exact; }
              }
            </style>
          </head>
          <body class="bg-white">
            ${document.querySelector(".printable-content").outerHTML}
          </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation failed. Please try the print option.");
    }
  }, [invoice?.inv_num]);

  const goBack = () => {
    navigate("/create");
  };

  if (loading) {
    return (
      <div className="p-5 text-white bg-[#171717] min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Loading Invoice...</h2>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-5 text-white bg-[#171717] min-h-screen flex flex-col items-start">
        <h2 className="text-2xl mb-4">No Invoice Data</h2>
        <p className="mb-4 text-gray-400">
          Unable to load invoice data. Please create a new invoice.
        </p>
        <button
          onClick={goBack}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 text-white bg-[#171717] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 no-print">
        <h1 className="text-3xl font-bold">Invoice Preview</h1>
        <div className="flex flex-wrap gap-3">
          {/* <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Print Invoice
          </button> */}
          <button
            onClick={handleDownloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={goBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </header>

      <div className="printable-content bg-white text-black p-8 rounded-lg w-full max-w-4xl mx-auto shadow-xl">
        <section className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold mb-1">
            Invoice #{invoice.inv_num}
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Date:</strong>{" "}
            {new Date(invoice.inv_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                invoice.is_paid === "True" || invoice.is_paid === true
                  ? "text-lg font-semibold text-green-800"
                  : "text-lg font-semibold text-red-800"
              }`}
            >
              {invoice.is_paid === "True" || invoice.is_paid === true
                ? "Paid"
                : "Unpaid"}
            </span>
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">From </h3>
            <address className="not-italic">
              <p className="font-medium">
                {user?.c_name || "Your Company Name"}
              </p>
              <p>{user?.address || "Your Company Address"}</p>
              <p>Phone: {user?.contact || "Your Contact Number"}</p>
              {user?.gst && <p>GSTIN: {user.gst}</p>}
            </address>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              To (Supplier)
            </h3>
            <address className="not-italic">
              <p className="font-medium">{invoice.party?.c_name}</p>
              <p>{invoice.party?.address}</p>
              <p>Phone: {invoice.party?.contact}</p>
              {invoice.party?.gst && <p>GSTIN: {invoice.party.gst}</p>}
            </address>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Description
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    Qty
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Rate
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    GST %
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹
                      {Number(item.rate).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {item.gst}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹
                      {calculateItemTotal(item).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex justify-end mb-8">
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 w-full max-w-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="text-gray-800">
                  ₹
                  {subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total GST:</span>
                <span className="text-gray-800">
                  ₹
                  {totalGST.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="border-t border-gray-400 pt-2">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>
                    ₹
                    {totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {invoice.remark && (
          <section className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 p-4 rounded">
            <p className="font-medium">Remarks:</p>
            <p className="text-sm mt-1">{invoice.remark}</p>
          </section>
        )}

        <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </footer>
      </div>
    </div>
  );
};

export default PreviewInvoice;
