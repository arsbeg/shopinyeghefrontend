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

import { useLang } from "../context/LanguageContext";
import { tField } from "../utils/tField";

const steps = [
  { key: "created", label: "Created", label_arm: "Ստեղծված", icon: FilePlus },
  { key: "packaging", label: "Packaging", label_arm: "Հավաքում", icon: Package },
  { key: "ready", label: "Ready", label_arm: "Պատրաստ", icon: CircleCheckBig },
  { key: "assigned", label: "Assigned", label_arm: "Նշանակված", icon: UserCheck },
  { key: "on_the_way", label: "OnWay", label_arm: "Ճանապարհին", icon: Truck },
  { key: "complete", label: "Completed", label_arm: "Ավարտված", icon: CheckCircle },
];

export default function OrderStatus({ status }) {
  const currentIndex = steps.findIndex((s) => s.key === status);
  const { lang } = useLang()

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
                <Icon size={20} />
 
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
                {tField(step, "label", lang)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
