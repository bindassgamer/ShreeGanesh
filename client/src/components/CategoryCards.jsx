import { motion } from "framer-motion";

const categories = [
  {
    id: "Laptop",
    title: "Laptop Repair",
    description: "Screen swaps, battery health, charging issues, and performance tune-ups.",
    accent: "from-sunrise/20 via-white to-white"
  },
  {
    id: "Desktop",
    title: "Desktop Repair",
    description: "Build diagnostics, power supply checks, upgrades, and thermal fixes.",
    accent: "from-mint/20 via-white to-white"
  },
  {
    id: "Printer",
    title: "Printer Repair",
    description: "Paper jams, ink system care, driver setup, and wireless issues.",
    accent: "from-blush/20 via-white to-white"
  }
];

export default function CategoryCards({ selected, onSelect }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {categories.map((category, index) => {
        const isActive = selected === category.id;
        return (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`rounded-3xl border border-white/60 bg-gradient-to-br ${category.accent} p-6 text-left shadow-glow transition focus:outline-none focus:ring-2 focus:ring-sunrise/40 ${
              isActive ? "ring-2 ring-sunrise/70" : "hover:shadow-lg"
            }`}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{category.id}</p>
            <h3 className="mt-2 text-xl font-semibold text-midnight">{category.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{category.description}</p>
            <div className="mt-6 flex items-center justify-between text-sm font-medium text-midnight">
              <span>{isActive ? "Selected" : "Choose"}</span>
              <span className="text-slate-400">→</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

