import { motion } from "framer-motion";
import {
  FilePlus,
  CircleCheckBig,
  Package,
  UserCheck,
  Truck,
  CheckCircle,
  Check,
} from "lucide-react";

const steps = [
  { key: "created", label: "Created", icon: FilePlus },
  { key: "packaging", label: "Packaging", icon: Package },
  { key: "ready", label: "Ready", icon: CircleCheckBig },
  { key: "assigned", label: "Assigned", icon: UserCheck },
  { key: "on_the_way", label: "On Way", icon: Truck },
  { key: "complete", label: "Completed", icon: CheckCircle },
];

export default function OrderStatus({ status }) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center relative">

        {/* Background gray line */}
        <div className="absolute top-2/3 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>

        {/* Animated progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.6 }}
          className="absolute top-2/3 left-0 h-1 bg-purple-600 -translate-y-1/2 rounded-full"
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center w-full">
              <div
                className={`
                  w-6 md:w-8 lg:w-10 h-6 md:h-8 lg:h-10 flex items-center justify-center rounded-full border-2
                  transition-all duration-300 text-white
                  ${
                    isCompleted
                      ? "bg-green-500 border-green-500"
                      : isCurrent
                      ? "bg-purple-600 border-purple-600"
                      : "bg-gray-200 border-gray-300 text-gray-500"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              <span
                className={`
                  text-[8px] md:text-[10px] lg:text-[12px] mt-2 font-medium
                  ${
                    isCurrent
                      ? "text-purple-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
