import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CategoryCards from "../components/CategoryCards.jsx";
import AuthPanel from "../components/AuthPanel.jsx";
import ProfileCompletionCard from "../components/ProfileCompletionCard.jsx";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

const categoryOptions = ["Laptop", "Desktop", "Printer"];

export default function BookService() {
  const { token, profile } = useAuth();
  const [category, setCategory] = useState("Laptop");
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [serviceStatus, setServiceStatus] = useState({ type: "idle", message: "" });

  const [pincode, setPincode] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [quote, setQuote] = useState(null);
  const [quoteStatus, setQuoteStatus] = useState({ type: "idle", message: "" });

  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [bookingStatus, setBookingStatus] = useState({ type: "idle", message: "" });
  const [booking, setBooking] = useState(null);

  const selectedService = useMemo(
    () => services.find((service) => service._id === selectedServiceId),
    [services, selectedServiceId]
  );

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      setServiceStatus({ type: "loading", message: "" });
      try {
        const data = await apiFetch(`/api/services?category=${encodeURIComponent(category)}`);
        if (active) {
          setServices(Array.isArray(data) ? data : []);
          setSelectedServiceId("");
          setServiceStatus({ type: "success", message: "" });
        }
      } catch (error) {
        if (active) {
          setServiceStatus({ type: "error", message: error.message || "Unable to load services." });
        }
      }
    };

    loadServices();

    return () => {
      active = false;
    };
  }, [category]);

  useEffect(() => {
    setQuote(null);
    setQuoteStatus({ type: "idle", message: "" });
    setBooking(null);
    setBookingStatus({ type: "idle", message: "" });
  }, [selectedServiceId]);

  const handleCheckQuote = async () => {
    if (!selectedServiceId) {
      setQuoteStatus({ type: "error", message: "Select a service first." });
      return;
    }
    if (!pincode) {
      setQuoteStatus({ type: "error", message: "Enter a pincode to calculate pricing." });
      return;
    }

    setQuoteStatus({ type: "loading", message: "" });
    try {
      const data = await apiFetch("/api/bookings/quote", {
        method: "POST",
        body: JSON.stringify({ serviceId: selectedServiceId, pincode })
      });
      setQuote(data);
      setQuoteStatus({ type: "success", message: "Quote generated." });
      setAddress((prev) => ({ ...prev, pincode }));
    } catch (error) {
      setQuote(null);
      setQuoteStatus({ type: "error", message: error.message || "Unable to calculate quote." });
    }
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBooking = async (event) => {
    event.preventDefault();

    if (!selectedServiceId) {
      setBookingStatus({ type: "error", message: "Please select a service." });
      return;
    }

    if (!token) {
      setBookingStatus({ type: "error", message: "Sign in to complete your booking." });
      return;
    }

    if (!profile?.isProfileComplete) {
      setBookingStatus({ type: "error", message: "Complete your profile before booking." });
      return;
    }

    setBookingStatus({ type: "loading", message: "" });
    try {
      const payload = await apiFetch("/api/bookings", {
        method: "POST",
        token,
        body: JSON.stringify({
          customerPhone,
          address: {
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: Number(address.pincode || pincode)
          },
          serviceDetails: {
            issueDescription
          },
          serviceId: selectedServiceId
        })
      });
      setBooking(payload);
      setBookingStatus({ type: "success", message: "Booking created successfully." });
    } catch (error) {
      setBooking(null);
      setBookingStatus({ type: "error", message: error.message || "Unable to create booking." });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-12">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Service Booking</p>
        <h1 className="text-3xl font-semibold text-midnight sm:text-4xl">Book a Repair Visit</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Choose a repair service, check pricing for your area, and reserve a technician slot in minutes.
        </p>
      </motion.header>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-midnight">Choose a device category</h2>
          <div className="hidden gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 md:flex">
            {categoryOptions.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <CategoryCards selected={category} onSelect={setCategory} />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Available Services</p>
                <h3 className="mt-2 text-xl font-semibold text-midnight">{category} issues</h3>
              </div>
              <span className="rounded-full bg-midnight/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-midnight">
                {services.length} options
              </span>
            </div>

            {serviceStatus.type === "error" ? (
              <p className="mt-4 text-sm text-rose-600">{serviceStatus.message}</p>
            ) : null}

            <div className="mt-6 grid gap-4">
              {serviceStatus.type === "loading" ? (
                <p className="text-sm text-slate-600">Loading services...</p>
              ) : services.length ? (
                services.map((service) => {
                  const isSelected = selectedServiceId === service._id;
                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => setSelectedServiceId(service._id)}
                      className={`flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? "border-sunrise/70 bg-sunrise/10"
                          : "border-white/60 bg-white/70 hover:border-slate-200"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-midnight">{service.issueName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                          Est. {service.estimatedTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-midnight">?{service.basePrice}</p>
                        <p className="text-xs text-slate-500">Base price</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-slate-600">No services are active for this category yet.</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur"
          >
            <h3 className="text-xl font-semibold text-midnight">Check your quote</h3>
            <p className="mt-2 text-sm text-slate-600">
              Enter your pincode to confirm availability and taxes. Quotes update instantly.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="text-sm font-medium text-slate-700">
                Serviceable pincode
                <input
                  type="number"
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value)}
                  placeholder="410206"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                />
              </label>
              <button
                type="button"
                onClick={handleCheckQuote}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-midnight px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink"
              >
                Get quote
              </button>
            </div>

            {quoteStatus.message ? (
              <p
                className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                  quoteStatus.type === "success"
                    ? "bg-mint/20 text-emerald-700"
                    : quoteStatus.type === "loading"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {quoteStatus.type === "loading" ? "Calculating quote..." : quoteStatus.message}
              </p>
            ) : null}

            {quote ? (
              <div className="mt-5 grid gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                  <span>Base amount</span>
                  <span className="font-semibold">?{quote.pricing.baseAmount}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                  <span>Pincode surge</span>
                  <span className="font-semibold">?{quote.pricing.pincodeSurge}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                  <span>Taxes</span>
                  <span className="font-semibold">?{quote.pricing.tax}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-midnight/10 bg-midnight/5 px-4 py-3 text-base font-semibold text-midnight">
                  <span>Total</span>
                  <span>?{quote.pricing.totalAmount}</span>
                </div>
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur"
          >
            <h3 className="text-xl font-semibold text-midnight">Complete your booking</h3>
            <p className="mt-2 text-sm text-slate-600">
              Share the exact issue and address so we can dispatch the right technician.
            </p>

            <form onSubmit={handleCreateBooking} className="mt-5 grid gap-4">
              <label className="text-sm font-medium text-slate-700">
                Issue description
                <textarea
                  required
                  rows={3}
                  value={issueDescription}
                  onChange={(event) => setIssueDescription(event.target.value)}
                  placeholder="Tell us the symptoms, error codes, or recent changes."
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Contact phone
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="+91 90000 00000"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Street address
                  <input
                    required
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  City
                  <input
                    required
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  State
                  <input
                    required
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Pincode
                  <input
                    required
                    type="number"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
                  />
                </label>
              </div>

              {bookingStatus.message ? (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    bookingStatus.type === "success"
                      ? "bg-mint/20 text-emerald-700"
                      : bookingStatus.type === "loading"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {bookingStatus.type === "loading" ? "Creating booking..." : bookingStatus.message}
                </p>
              ) : null}

              {booking ? (
                <div className="rounded-2xl border border-midnight/10 bg-midnight/5 px-4 py-4 text-sm text-midnight">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Booking confirmed</p>
                  <p className="mt-2 text-lg font-semibold">{booking.bookingId}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    We have emailed a receipt to {booking.customerEmail || "your account email"}.
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-midnight px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink"
              >
                Confirm booking
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          <AuthPanel />
          {profile && !profile.isProfileComplete ? <ProfileCompletionCard /> : null}
          <div className="rounded-3xl border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-glow backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tips</p>
            <ul className="mt-4 space-y-3">
              <li>Keep your device model and serial number handy during the visit.</li>
              <li>Quotes include location-based surge and 18% tax.</li>
              <li>You can track booking status anytime from the tracking page.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

