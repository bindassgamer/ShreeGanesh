import { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../lib/api";

const initialState = {
  address: "",
  email: "",
  phone: "",
  brand: "",
  description: ""
};

export default function RepairForm({ category }) {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!category) {
      setStatus({ type: "error", message: "Please choose a category first." });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const payload = await apiFetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify({ ...formData, category })
      });

      setStatus({
        type: "success",
        message: payload?.message || "Thanks! Your request is in. We will be back to you soon."
      });
      setFormData(initialState);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 rounded-3xl border border-white/70 bg-white/70 p-8 shadow-glow backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-midnight">
            {category || "Choose a device type"}
          </h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Address
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, City, Zip"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@email.com"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Phone No
          <input
            required
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 ****** ******"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Brand
          <input
            required
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Asus/Dell/HP/Lenovo"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Description
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us what is happening"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
      </div>

      {status.message ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
            status.type === "success"
              ? "bg-mint/20 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-midnight px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </motion.form>
  );
}

