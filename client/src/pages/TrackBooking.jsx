import { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../lib/api";

export default function TrackBooking() {
  const [bookingId, setBookingId] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [tracking, setTracking] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!bookingId) {
      setStatus({ type: "error", message: "Enter a booking ID to continue." });
      return;
    }

    setStatus({ type: "loading", message: "" });
    try {
      const payload = await apiFetch(`/api/bookings/track/${bookingId}`);
      setTracking(payload);
      setStatus({ type: "success", message: "Tracking loaded." });
    } catch (error) {
      setTracking(null);
      setStatus({ type: "error", message: error.message || "Unable to find booking." });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:px-12">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Tracking</p>
        <h1 className="text-3xl font-semibold text-midnight sm:text-4xl">Track Your Booking</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Enter your booking ID to see technician assignment and repair progress in real time.
        </p>
      </motion.header>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="mt-8 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur"
      >
        <label className="text-sm font-medium text-slate-700">
          Booking ID
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={bookingId}
              onChange={(event) => setBookingId(event.target.value.toUpperCase())}
              placeholder="BK-2026-XXXX"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-midnight px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink"
            >
              Track
            </button>
          </div>
        </label>

        {status.message ? (
          <p
            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
              status.type === "success"
                ? "bg-mint/20 text-emerald-700"
                : status.type === "loading"
                ? "bg-slate-100 text-slate-600"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {status.type === "loading" ? "Loading tracking details..." : status.message}
          </p>
        ) : null}
      </motion.form>

      {tracking ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Booking Status</p>
              <h2 className="mt-2 text-2xl font-semibold text-midnight">{tracking.status}</h2>
            </div>
            <div className="text-sm text-slate-600">
              Technician: <span className="font-semibold text-midnight">{tracking.technicianName || "Pending"}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {tracking.progressSteps?.map((step) => (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                  step.done
                    ? "border-mint/40 bg-mint/10 text-emerald-700"
                    : "border-white/60 bg-white/70 text-slate-500"
                }`}
              >
                <span>{step.label}</span>
                <span className="text-xs uppercase tracking-[0.2em]">
                  {step.done ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      ) : null}
    </div>
  );
}

