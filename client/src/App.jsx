import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import CandidateCertificate from "./pages/CandidateCertificate.jsx";

const linkClass = ({ isActive }) =>
  `relative text-sm font-medium transition hover:text-midnight ${
    isActive ? "text-midnight" : "text-slate-600"
  } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-midnight after:transition-transform after:duration-300 hover:after:scale-x-100 ${
    isActive ? "after:scale-x-100" : ""
  }`;

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-8 sm:px-6 md:px-12"
      >
        <nav className="flex-wrap items-center justify-between gap-4 md:flex">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Shree Ganesh Care</p>
          </div>
          <div className="flex items-center gap-6 max-md:hidden">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About Us
            </NavLink>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <Home />
              </motion.main>
            }
          />
          <Route
            path="/about"
            element={
              <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <About />
              </motion.main>
            }
          />
          <Route
            path="/candidate/:id"
            element={
              <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <CandidateCertificate />
              </motion.main>
            }
          />
        </Routes>
      </AnimatePresence>

      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3 sm:hidden sm:right-6">
        <a
          href="/"
          aria-label="Go to home page"
          className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-gradient-to-br from-sunrise/60 via-white to-mint/50 text-midnight shadow-glow backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h5v-6h2v6h5a1 1 0 0 0 1-1V9.5" />
          </svg>
        </a>
        <a
          href="/about"
          aria-label="Go to about page"
          className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-gradient-to-br from-mint/50 via-white to-sunrise/60 text-midnight shadow-glow backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
          </svg>
        </a>
      </div>
    </div>
  );
}
