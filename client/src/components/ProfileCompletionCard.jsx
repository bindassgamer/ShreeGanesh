import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileCompletionCard() {
  const { profile, updateProfile, profileLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || ""
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    try {
      await updateProfile(formData);
      setStatus({ type: "success", message: "Profile updated." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to update profile." });
    }
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Complete Profile</p>
      <h3 className="mt-2 text-lg font-semibold text-midnight">We need a few more details</h3>
      <p className="mt-2 text-sm text-slate-600">
        Bookings require a verified phone and address. Update your profile once to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="text-sm font-medium text-slate-700">
          Full name
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Phone
          <input
            required
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Address
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          City
          <input
            required
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>

        {status.message ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              status.type === "success" ? "bg-mint/20 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={profileLoading}
          className="inline-flex items-center justify-center rounded-full bg-midnight px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink disabled:cursor-not-allowed disabled:opacity-70"
        >
          {profileLoading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

