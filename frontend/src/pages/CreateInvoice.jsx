import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import Navbar1 from "../components/Navbar1";
import ItemTable from "../components/ItemTable";
import Autocomplete from "../components/Autocomplete";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CreateInvoice = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [partyOptions, setPartyOptions] = useState([]);
  const [isLoadingParties, setIsLoadingParties] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceData, setInvoiceData] = useState({
    inv_number: "",
    inv_date: "",
    is_paid: false,
    total_amount: 0,
    party: { c_name: "", address: "", contact: "", gst: "" },
  });

  const handleItemsChange = (items) => {
    setInvoiceItems(items);

    const total = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate;
      const gstAmount = (itemTotal * item.gst) / 100;
      return sum + itemTotal + gstAmount;
    }, 0);

    setTotalAmount(total);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: user?.c_name,
    },
  });

  useEffect(() => {
    const loadPartyData = async () => {
      setIsLoadingParties(true);
      try {
        const response = await fetch("/parties");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPartyOptions(data);
        setIsLoadingParties(false);
      } catch (error) {
        console.error("Error loading suppliers:", error);
        setIsLoadingParties(false);
      }
    };

    loadPartyData();
  }, []);

  const handleSelectEntity = (fieldName, selectedValue, options) => {
    const selectedPartyData = options.find(
      (party) => party.c_name === selectedValue
    );

    if (selectedPartyData) {
      setValue("party", selectedValue);

      setInvoiceData((prev) => ({
        ...prev,
        party: {
          c_name: selectedPartyData.c_name,
          address: selectedPartyData.address || "",
          contact: selectedPartyData.contact || "",
          gst: selectedPartyData.gst || "",
        },
      }));
    }
  };

  const resetForm = () => {
    reset({
      company: user?.c_name,
      party: "",
      inv_num: "",
      date: "",
      isPaid: false,
      remark: "",
    });

    setInvoiceItems([]);
    setTotalAmount(0);
    setInvoiceData({
      inv_number: "",
      inv_date: "",
      is_paid: false,
      total_amount: 0,
      party: { c_name: "", address: "", contact: "", gst: "" },
    });
  };
  console.log(invoiceData.party.c_name)

  const onSubmit = async (data) => {
    if (!invoiceData.party.c_name) {
      toast.error("Please select a supplier");
      return;
    }

    const validItems = invoiceItems.filter(
      (item) =>
        item &&
        (item.item_name || item.name) &&
        item.quantity > 0 &&
        item.rate > 0
    );

    if (validItems.length === 0) {
      toast.error(
        "Please add at least one valid item with name, quantity, and rate"
      );
      return;
    }

    const payload = {
      customer: user?.id || null,
      inv_num: data.inv_num,
      inv_date: data.date,
      remark: data.remark || "",
      is_paid: data.isPaid ? "True" : "False",
      party: {
        c_name: invoiceData.party.c_name,
        contact: invoiceData.party.contact,
        address: invoiceData.party.address,
        gst: invoiceData.party.gst,
      },
      invoice_items: validItems.map((item) => ({
        item_name: item.item_name || item.name,
        quantity: item.quantity,
        rate: item.rate,
        gst: item.gst || 0,
      })),
      total: totalAmount,
    };

    try {
      const response = await fetch(
        "https://invoice-backend-846x.onrender.com/invoices/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const result = await response.json();

      toast.success("Invoice Created Successfully");
      resetForm();
      navigate("/preview-invoice");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(`Error creating invoice: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar1 />
      <hr className="text-[#232323]" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-[#171717] text-white min-h-[91vh] w-full px-4 sm:px-6 md:px-10 py-5">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-4 items-center">
              <IoMenu className="text-xl" />
              <h1 className="text-lg font-semibold">New Purchase Invoice</h1>
            </div>
            <button
              type="submit"
              className="py-2 px-3 scale-[0.9] bg-[#F3F3F3] text-[#171717] font-semibold rounded-lg self-start md:self-center"
            >
              Submit
            </button>
          </div>

          <div className="border border-[#232323] mt-7 p-4 rounded-lg sm:p-6 md:px-7 md:py-8 flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-gray-400 text-base text-sm mb-2">
                    Supplier <span className="text-rose-400">*</span>
                    {isLoadingParties && (
                      <span className="text-gray-500 ml-2">(Loading...)</span>
                    )}
                  </label>
                  <Autocomplete
                    options={partyOptions.map((c) => c.c_name)}
                    onSelect={(val) =>
                      handleSelectEntity("party", val, partyOptions)
                    }
                  />
                  <input
                    {...register("party", { required: "Supplier is required" })}
                    type="hidden"
                  />
                  {errors.party && (
                    <p className="text-red-400 text-sm ml-2">
                      {errors.party.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-gray-400 text-base text-sm mb-2">
                    Invoice No. <span className="text-rose-400">*</span>
                  </label>
                  <input
                    {...register("inv_num", {
                      required: "Invoice number is required",
                    })}
                    className="w-full py-1 px-3 rounded-lg bg-[#232323] outline-none"
                  />
                  {errors.inv_num && (
                    <p className="text-red-400 text-sm ml-2">
                      {errors.inv_num.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-gray-400 text-base text-sm mb-2">
                    Company
                  </label>
                  <input
                    {...register("company")}
                    className="w-full py-1 px-4 rounded-lg bg-[#232323] outline-none text-[#F8F8F8]"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-gray-400 text-base text-sm mb-2">
                    Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    className="w-full py-1 px-3 rounded-lg bg-[#232323] text-md outline-none"
                  />
                  {errors.date && (
                    <p className="text-red-400 text-sm ml-2">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex ">
              <div className="flex gap-2 p-10 items-top">
                <input
                  type="checkbox"
                  {...register("isPaid")}
                  id="isPaid"
                  className="my-1 w-3 h-4"
                />
                <label htmlFor="isPaid" className="text-white text-sm">
                  is paid
                </label>
              </div>
            </div>
          </div>

          <ItemTable onItemsChange={handleItemsChange} />

          <div className="mt-10">
            <label htmlFor="remark" className="block mb-2">
              Remark
            </label>
            <textarea
              type="text"
              id="remark"
              placeholder=""
              {...register("remark")}
              className="w-full p-3 bg-[#232323] min-h-[200px] rounded-lg outline-none text-white"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateInvoice;
