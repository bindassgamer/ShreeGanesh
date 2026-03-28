import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CategoryCards from "../components/CategoryCards.jsx";
import RepairForm from "../components/RepairForm.jsx";

export default function Home() {
  const [category, setCategory] = useState("Laptop");
  const [hasSelected, setHasSelected] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (hasSelected && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [category, hasSelected]);

  const handleCategorySelect = (nextCategory) => {
    setCategory(nextCategory);
    setHasSelected(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-12">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6"
      >
        <div id="home" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mt-4 text-4xl font-semibold text-midnight md:text-5xl">
              Repair support for laptops, desktops, and printers.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              Submit your device issue in minutes. Our technicians review every ticket and reach
              out with next steps within one business day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex items-center justify-center rounded-full bg-midnight px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink"
              >
                Book a service
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                Track booking
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/70 px-6 py-5 text-sm text-slate-600 shadow-glow backdrop-blur">
            <p className="font-semibold text-midnight">Service coverage</p>
            <p className="mt-2">On-site & remote support across major metro areas.</p>
          </div>
        </div>
      </motion.header>

      <section className="mt-10 sm:mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-midnight">Choose your device</h2>
        </div>
        <div className="mt-6">
          <CategoryCards selected={category} onSelect={handleCategorySelect} />
        </div>
      </section>

      <section ref={formRef} className="mt-10 sm:mt-12">
        <h2 className="text-2xl font-semibold text-midnight">Tell us what you need fixed</h2>
        <RepairForm category={category} />
      </section>

      <footer className="mt-12 border-t border-slate-200/70 py-6 text-sm text-slate-500">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Shree Ganesh Care © 2026</span>
          <span>Need help? support@shreeganeshcare.com</span>
        </div>
      </footer>
    </div>
  );
}

