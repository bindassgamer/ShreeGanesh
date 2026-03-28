import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

export default function MyBookings() {
  const { token } = useAuth();
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      if (!token) {
        setBookings([]);
        setStatus({ type: "idle", message: "" });
        return;
      }

      setStatus({ type: "loading", message: "" });
      try {
        const data = await apiFetch("/api/bookings/me", { token });
        if (active) {
          setBookings(Array.isArray(data) ? data : []);
          setStatus({ type: "success", message: "" });
        }
      } catch (error) {
        if (active) {
          setStatus({ type: "error", message: error.message || "Unable to load bookings." });
        }
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:px-12">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">My Bookings</p>
        <h1 className="text-3xl font-semibold text-midnight sm:text-4xl">Your Repair Requests</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Review previous and upcoming bookings linked to your account.
        </p>
      </motion.header>

      {!token ? (
        <div className="mt-8 rounded-3xl border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-glow backdrop-blur">
          Sign in from the booking page to view your repair history.
        </div>
      ) : null}

      {status.type === "error" ? (
        <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700">
          {status.message}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4">
        {status.type === "loading" ? (
          <div className="rounded-3xl border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-glow backdrop-blur">
            Loading bookings...
          </div>
        ) : bookings.length ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Booking ID</p>
                  <p className="mt-2 text-lg font-semibold text-midnight">{booking.bookingId}</p>
                  <p className="text-sm text-slate-600">{booking.serviceDetails?.category}</p>
                </div>
                <span className="rounded-full bg-midnight/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-midnight">
                  {booking.status}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p>Issue: {booking.serviceDetails?.issueDescription}</p>
                <p>Technician: {booking.technicianName || "Pending"}</p>
                <p>City: {booking.address?.city}</p>
                <p>Total: ?{booking.pricing?.totalAmount}</p>
              </div>
            </div>
          ))
        ) : token ? (
          <div className="rounded-3xl border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-glow backdrop-blur">
            No bookings yet. Submit your first service request from the booking page.
          </div>
        ) : null}
      </div>
    </div>
  );
}

