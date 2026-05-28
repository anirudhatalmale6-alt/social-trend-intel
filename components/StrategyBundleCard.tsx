// components/StrategyBundleCard.tsx
import React from "react";
import { StrategyBundle } from "../lib/strategyBundles";

interface Props {
  bundle: StrategyBundle;
  isSelected: boolean;
  onSelect: () => void;
}

const StrategyBundleCard: React.FC<Props> = ({ bundle, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-lg backdrop-blur-md bg-[#0f1629] bg-opacity-60 border transition-all duration-200 ${isSelected ? "border-[#6c63ff] shadow-xl" : "border-transparent hover:border-[#6c63ff]"}`}
    >
      <h3 className="text-lg font-semibold text-[#e8eaf6] mb-1">{bundle.name}</h3>
      <p className="text-sm text-[#7986cb] mb-2">{bundle.description}</p>
      <div className="flex flex-wrap gap-1">
        {bundle.tickers.slice(0, 5).map((ticker) => (
          <span
            key={ticker}
            className="text-xs px-2 py-0.5 bg-[#6c63ff] bg-opacity-30 rounded-full text-[#e8eaf6]"
          >
            {ticker}
          </span>
        ))}
        {bundle.tickers.length > 5 && (
          <span className="text-xs px-2 py-0.5 bg-[#6c63ff] bg-opacity-30 rounded-full text-[#e8eaf6]">
            +{bundle.tickers.length - 5}
          </span>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center text-xs text-[#7986cb]">
        <span>Risk: {"★".repeat(bundle.riskScore)}</span>
        <span>Alloc: {bundle.initialAllocation}%</span>
      </div>
    </div>
  );
};

export default StrategyBundleCard;
