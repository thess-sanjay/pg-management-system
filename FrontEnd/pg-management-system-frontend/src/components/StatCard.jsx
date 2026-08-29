import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

function StatCard({ icon, label, value, detail, delay }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <div className="stat-top">
        <div className="stat-icon">
          {icon}
        </div>

        <ArrowUpRight size={16} className="stat-arrow" />
      </div>

      <span className="stat-label">{label}</span>

      <strong className="stat-value">{value}</strong>

      <small>{detail}</small>
    </motion.div>
  );
}

export default StatCard;