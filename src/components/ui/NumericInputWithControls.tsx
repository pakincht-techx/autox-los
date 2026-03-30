import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NumericInputWithControlsProps {
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function NumericInputWithControls({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  placeholder = "0",
  disabled = false,
  className = "",
}: NumericInputWithControlsProps) {
  const numValue = Number(value) || 0;

  const handleDecrement = () => {
    const newValue = Math.max(min, numValue - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, numValue + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || inputValue === "-") {
      onChange(0);
      return;
    }
    const newValue = Math.min(max, Math.max(min, Number(inputValue)));
    onChange(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || numValue <= min}
        className="h-10 w-10 p-0 rounded-xl border-gray-200 hover:bg-gray-50"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <input
        type="number"
        value={numValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        className="h-10 flex-1 rounded-xl bg-white border border-gray-200 text-center text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={disabled || numValue >= max}
        className="h-10 w-10 p-0 rounded-xl border-gray-200 hover:bg-gray-50"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
