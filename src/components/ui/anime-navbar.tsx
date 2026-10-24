import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  icon: LucideIcon;
}

interface AnimeNavBarProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (name: string) => void;
  className?: string;
  mascotImage?: string;
  mascotAlt?: string;
}

export function AnimeNavBar({
  items,
  activeTab,
  onTabChange,
  className,
  mascotImage = "/marvel/ironman-helmet.svg",
  mascotAlt = "Marvel Mascot",
}: AnimeNavBarProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);


  return (
    <div className={cn("flex justify-center", className)}>
      <motion.div
        className="flex items-center gap-1 bg-black/60 border border-white/10 backdrop-blur-lg py-1.5 px-1.5 rounded-full shadow-xl relative"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          const isHovered = hoveredTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => onTabChange(item.name)}
              onMouseEnter={() => setHoveredTab(item.name)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-300 select-none",
                "text-white/50 hover:text-white/90",
                isActive && "text-white"
              )}
            >
              {/* Active glow layers (Stark red & gold glow, no purple) */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-[#EC1D24]/20 rounded-full blur-md" />
                  <div className="absolute inset-[-4px] bg-[#EC1D24]/15 rounded-full blur-xl" />
                  <div className="absolute inset-[-8px] bg-[#FFD700]/10 rounded-full blur-2xl" />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EC1D24]/25 to-transparent"
                    style={{ animation: "shine 3s ease-in-out infinite" }}
                  />
                </motion.div>
              )}

              {/* Active solid pill */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white/10 border border-[#EC1D24]/40 -z-10 shadow-[0_0_12px_rgba(236,29,36,0.25)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Label */}
              <motion.span
                className="relative z-10 hidden sm:inline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>

              {/* Mobile: icon only */}
              <motion.span
                className="sm:hidden relative z-10"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={16} strokeWidth={2} />
              </motion.span>

              {/* Hover ghost pill */}
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 bg-white/6 rounded-full -z-10"
                  />
                )}
              </AnimatePresence>

              {/* Character Mascot Pointer above active tab */}
              {isActive && (
                <motion.div
                  layoutId="anime-mascot"
                  className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-40"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="relative w-11 h-10 flex items-center justify-center filter drop-shadow-[0_2px_12px_rgba(236,29,36,0.6)]"
                    animate={
                      hoveredTab
                        ? { scale: [1, 1.15, 1], rotate: [0, -4, 4, 0], transition: { duration: 0.35 } }
                        : { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
                    }
                  >
                    <img
                      src={mascotImage}
                      alt={mascotAlt}
                      className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                    />
                  </motion.div>
                  {/* Downward indicator */}
                  <motion.div
                    className="w-2 h-2 -mt-1 bg-[#EE0C28] rotate-45 transform origin-center border-r border-b border-[#F6B649]"
                    animate={
                      hoveredTab
                        ? { y: [0, 2, 0], transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" } }
                        : { y: [0, 1, 0], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } }
                    }
                  />
                </motion.div>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default AnimeNavBar;
