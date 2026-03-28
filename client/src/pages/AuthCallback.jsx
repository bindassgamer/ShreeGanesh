import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finalize = async () => {
      await supabase.auth.getSession();
      navigate("/book", { replace: true });
    };

    finalize();
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full rounded-3xl border border-white/70 bg-white/70 p-8 text-center shadow-glow backdrop-blur"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signing you in</p>
        <h1 className="mt-3 text-2xl font-semibold text-midnight">Finishing Google login</h1>
        <p className="mt-3 text-sm text-slate-600">
          Please wait while we sync your account and load the booking dashboard.
        </p>
      </motion.div>
    </div>
  );
}
