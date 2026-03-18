import { motion } from "framer-motion";

const collaborators = [
  { name: "Aarav Sharma", role: "Device Diagnostics" },
  { name: "Meera Iyer", role: "Printer Systems" },
  { name: "Rohan Patel", role: "On-site Support" },
  { name: "Nisha Gupta", role: "Customer Success" }
];

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-glow backdrop-blur"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">About Us</p>
            <h2 className="mt-3 text-3xl font-semibold text-midnight">ApplianceCare Hub team</h2>
            <p className="mt-4 text-base text-slate-600">
              We are a customer-first repair collective focused on fast diagnostics, transparent
              estimates, and service that respects your time. Our collaborators specialize in
              hardware recovery, printer systems, and on-site setup so you get consistent support
              end-to-end.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-600">
              <p className="font-semibold text-midnight">What makes us different</p>
              <p className="mt-2">
                24-hour response targets, transparent service notes, and coverage designed for busy
                homes and offices.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {collaborators.map((person) => (
              <div key={person.name} className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm">
                <img
                  src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23f59e0b'/><stop offset='100%' stop-color='%2334d399'/></linearGradient></defs><rect width='64' height='64' rx='18' fill='url(%23g)'/><text x='50%' y='54%' text-anchor='middle' font-size='26' font-family='Arial' fill='white'>${person.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}</text></svg>`}
                  alt={`${person.name} portrait`}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-midnight">{person.name}</p>
                  <p className="text-xs text-slate-500">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
