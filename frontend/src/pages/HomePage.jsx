import { IoMenu } from "react-icons/io5";
import Navbar2 from "../components/Navbar2";
import { useNavigate } from "react-router";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(`/invoices/${user.id}`);
          setInvoices(response.data);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };

    fetchInvoices();
  }, [user]);

  const ClickHandler = () => {
    navigate("/create");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);

  return (
    <>
      <Navbar2 />
      <hr className="text-[#232323]" />
      <div className="px-4 sm:px-6 md:px-10 py-4 bg-[#171717] text-[#F8F8F8] min-h-[90vh] w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-4 items-center">
            <IoMenu className="text-2xl" />
            <h1 className="text-xl">Invoice</h1>
          </div>
          <button
            onClick={ClickHandler}
            className="bg-[#f3f3f3] scale-[0.9] text-[#171717] px-4 py-2 rounded-lg text-lg font-medium md:w-auto"
          >
            + Add New Invoice
          </button>
        </div>

        <div className="flex flex-col lg:flex-row mt-6 gap-6 ">
          <div className="w-full lg:w-1/4 text-sm">
            <h4 className="text-gray-300 text-xs">Filter By</h4>
            <input
              type="text"
              placeholder="Assigned To"
              className="py-1.5 px-3 w-full outline-none bg-[#232323] placeholder:text-gray-300 rounded-lg mt-4 text-xs"
            />
            <input
              type="text"
              placeholder="Created By"
              className="py-1.5 px-3 w-full outline-none bg-[#232323] placeholder:text-gray-300 rounded-lg mt-4 text-xs"
            />
            <h4 className="text-sm text-gray-100 mt-4">Edit Filters</h4>
            <input
              type="text"
              placeholder="Tags"
              className="py-1.5 px-3 w-full outline-none bg-[#232323] placeholder:text-gray-300 rounded-lg mt-3 text-xs"
            />
            <h4 className="text-xs text-gray-100 mt-3">Show Tags</h4>
            <h4 className="text-xs text-gray-300 mt-5">Save Filter</h4>
            <input
              type="text"
              placeholder="Filter Name"
              className="py-1.5 px-3 w-full  outline-none bg-[#232323] placeholder:text-gray-300 rounded-lg mt-3 text-xs"
            />
          </div>
          <div className="w-full lg:w-3/4 border rounded-lg border-[#232323] p-5">
            <div className="flex flex-col md:flex-row md:gap-6">
              <input
                type="text"
                placeholder="Invoice Number"
                className="py-1 px-3 w-full outline-none bg-[#232323] placeholder:text-[#999999] placeholder:text-sm rounded-xl mt-4"
              />
              <input
                type="text"
                placeholder="Supplier"
                className="py-1 px-3 w-full outline-none bg-[#232323] placeholder:text-[#999999] placeholder:text-sm rounded-xl mt-4"
              />
              <input
                type="text"
                placeholder="Inv Date"
                className="py-1 px-3 w-full outline-none bg-[#232323] placeholder:text-[#999999] placeholder:text-sm rounded-xl mt-4"
              />
              <input
                type="text"
                placeholder="Status"
                className="py-1 px-3 w-full outline-none bg-[#232323] placeholder:text-[#999999] placeholder:text-sm rounded-xl mt-4"
              />
            </div>
            <div className="overflow-x-auto rounded-lg mt-8 border border-[#232323] bg-[#171717]">
              <table className="min-w-full table-auto text-sm text-left text-[#F8F8F8]">
                <thead className="bg-[#232323] text-[#C7C7C7]">
                  <tr>
                    <th className="pl-4 py-2 w-12">
                      <input type="checkbox" />
                    </th>
                    <th className="py-2 px-4">Supplier</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Inv Date</th>
                    <th className="py-2 px-4">Inv Num</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.map((invoice, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#292929] border-b border-[#232323]"
                    >
                      <td className="pl-4 py-2">
                        <input type="checkbox" />
                      </td>
                      <td className="px-4 py-2">{invoice.party?.c_name}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-[9px] py-[2px] rounded-full text-sm font-semibold ${
                            invoice.is_paid
                              ? "bg-[#173B2C] text-[#FFF7F1]"
                              : "bg-[#CC2929] text-[#FFF7F1] "
                          }`}
                        >
                          {invoice.is_paid ? "Paid" : "Overdue"}
                        </span>
                      </td>
                      <td className="px-4 py-2">{invoice.inv_date}</td>
                      <td className="px-4 py-2">{invoice.inv_num}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invoices.length > 0 && (
                <div className="flex justify-center gap-2 mt-4 mb-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#232323] text-[#F8F8F8] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-[#C7C7C7]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-[#232323] text-[#F8F8F8] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
              {invoices.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-6">
                  No invoices found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
