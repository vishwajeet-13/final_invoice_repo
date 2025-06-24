import { useState, useEffect } from "react";

const ItemTable = ({ onItemsChange }) => {
  const [rows, setRows] = useState([
    { item: "", qty: "", rate: "", gst: "", selected: false },
  ]);

  const calculateGrandTotal = (rows) => {
    return rows.reduce((total, row) => {
      const itemTotal =
        (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0);
      const gstAmount = (itemTotal * (parseFloat(row.gst) || 0)) / 100;
      const totalWithGst = itemTotal + gstAmount;
      return total + totalWithGst;
    }, 0);
  };

  const updateParent = (updatedRows) => {
    if (onItemsChange) {
      const formattedItems = updatedRows.map((row) => ({
          item_name: row.item,
          quantity: parseFloat(row.qty) || 0,
          rate: parseFloat(row.rate) || 0,
          gst: parseFloat(row.gst) || 0,
        }));

      onItemsChange(formattedItems);
    }
  };

  const addRow = () => {
    const newRows = [
      ...rows,
      { item: "", qty: "", rate: "", gst: "", selected: false },
    ];
    setRows(newRows);
    updateParent(newRows);
  };

  const deleteRow = () => {
    const remaining = rows.filter((row) => !row.selected);
    if (remaining.length === rows.length) return;

    const newRows =
      remaining.length > 0
        ? remaining
        : [{ item: "", qty: "", rate: "", gst: "", selected: false }];

    setRows(newRows);
    updateParent(newRows);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    updateParent(updatedRows);
  };

  const toggleCheckbox = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].selected = !updatedRows[index].selected;
    setRows(updatedRows);
  };

  useEffect(() => {
    updateParent(rows);
  }, []);

  const grandTotal = calculateGrandTotal(rows);

  return (
    <div className="mt-10 ">
      <table className="min-w-full bg-[#171717] text-white rounded-lg overflow-hidden text-sm">
        <thead className="bg-[#232323] border border-[#232323] text-gray-300">
          <tr>
            <th className="px-2 py-2 text-left">
              <div className="flex items-center justify-center">
                <input className="text-sm" type="checkbox" />
              </div>
            </th>
            <th className="px-2 py-2 text-left">No.</th>
            <th className="px-2 py-2 text-left">Item</th>
            <th className="px-2 py-2 text-left">Qty</th>
            <th className="px-2 py-2 text-left">Rate</th>
            <th className="px-2 py-2 text-left">GST</th>
            <th className="px-2 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody className="border border-[#232323]">
          {rows.map((row, idx) => {
            const itemTotal =
              (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0);
            const gstAmount = (itemTotal * (parseFloat(row.gst) || 0)) / 100;
            const totalWithGst = itemTotal + gstAmount;

            return (
              <tr key={idx} className="border border-[#232323]">
                <td className="px-2 py-1 border border-[#232323]">
                  <div className="flex items-center justify-center h-full">
                    <input
                      className="text-sm"
                      type="checkbox"
                      checked={row.selected}
                      onChange={() => toggleCheckbox(idx)}
                    />
                  </div>
                </td>

                <td className="px-2 py-1">{idx + 1}</td>
                <td className="px-2 py-1 border border-[#232323]">
                  <input
                    type="text"
                    value={row.item}
                    onChange={(e) => handleChange(idx, "item", e.target.value)}
                    className="w-full px-1 py-2 text-xs rounded text-white outline-none bg-transparent appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-2 py-1 border border-[#232323]">
                  <input
                    type="number"
                    value={row.qty}
                    onChange={(e) => handleChange(idx, "qty", e.target.value)}
                    className="w-full px-1 py-2 text-xs rounded text-white outline-none bg-transparent appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-2 py-1 border border-[#232323]">
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) => handleChange(idx, "rate", e.target.value)}
                    className="w-full px-1 py-2 text-xs rounded text-white outline-none bg-transparent appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-2 py-1 border border-[#232323]">
                  <input
                    type="number"
                    value={row.gst}
                    onChange={(e) => handleChange(idx, "gst", e.target.value)}
                    className="w-full px-1 py-2 text-xs rounded text-white outline-none bg-transparent appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-2 py-1 border border-[#232323] text-right">
                  <span className="text-xs">
                    {totalWithGst > 0 ? `₹${totalWithGst.toFixed(2)}` : "₹0.00"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-start">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addRow}
            className="bg-[#383838] text-white px-2 py-[4px] text-sm rounded-lg"
          >
            Add Row
          </button>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={deleteRow}
              className="bg-red-700 hover:bg-red-700 text-white px-2 py-[4px] text-sm rounded-lg"
            >
              Delete Row
            </button>
          )}
        </div>

        <div className="text-white">
          <div className="text-lg text-gray-300 mb-1">Total:</div>
          <div className="bg-[#232323] border border-[#232323] px-2 py-2 rounded-lg text-right min-w-[100px]">
            <span className="">₹ {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTable;
