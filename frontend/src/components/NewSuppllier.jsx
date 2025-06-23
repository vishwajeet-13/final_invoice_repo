import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";

const inputClass =
  "bg-[#232323] w-full rounded-md py-2 px-3 outline-none text-white";

const NewSupplier = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onCloseHandler = () => navigate(-1);

  const onSubmitHandler = async (data) => {
    const { email, ...dataToSend } = data;

    try {
      const response = await axios.post("/party/create/", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Supplier created successfully!");
        reset();
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error("Failed to create supplier.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating supplier.");
    }
  };

  return (
    <main className="flex items-center justify-center bg-[#171717] text-white min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="p-6 border border-gray-600 rounded-md w-full max-w-2xl bg-[#171717] shadow-lg"
      >
        <ToastContainer position="top-right" />

        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">New Customer</h2>
          <button
            onClick={onCloseHandler}
            type="button"
            aria-label="Close"
            className="text-lg cursor-pointer bg-transparent border-none"
          >
            X
          </button>
        </header>

        <hr className="border-t border-gray-800 my-6" />

        <div className="mb-4">
          <label htmlFor="gst" className="font-thin mb-1 block">
            GSTIN
          </label>
          <input
            id="gst"
            type="text"
            {...register("gst", { required: "GSTIN is required" })}
            className={inputClass}
          />
          {errors.gst && (
            <p className="text-red-400 text-sm mt-1">{errors.gst.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="c_name" className="font-thin mb-1 block">
            Customer Name
          </label>
          <input
            id="c_name"
            type="text"
            {...register("c_name", { required: "Customer Name is required" })}
            className={`${inputClass} mb-2`}
          />
          {errors.c_name && (
            <p className="text-red-400 text-sm mt-1">{errors.c_name.message}</p>
          )}
        </div>

        <hr className="border-t border-gray-800 my-6" />

        <section className="mb-4">
          <h3 className="text-md font-medium mb-3">Primary Contact Details</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="contact" className="font-thin mb-1 block">
                Contact
              </label>
              <input
                id="contact"
                type="text"
                {...register("contact", {
                  required: "Contact is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Contact must be 10-15 digits",
                  },
                })}
                className={inputClass}
              />
              {errors.contact && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="email" className="font-thin mb-1 block">
                Email ID
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-800 my-6" />

        <section className="mb-6">
          <h3 className="text-md font-medium mb-3">Primary Address Details</h3>
          <label htmlFor="address" className="font-thin mb-1 block">
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address", { required: "Address is required" })}
            className={inputClass}
          />
          {errors.address && (
            <p className="text-red-400 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </section>

        <button
          className="w-full py-2 font-semibold text-lg bg-[#E2E2E2] text-black rounded-md hover:bg-white transition-colors"
          type="submit"
        >
          Save
        </button>
      </form>
    </main>
  );
};

export default NewSupplier;
