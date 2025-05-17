import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/app/utils/cn";

export const Select = ({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (val: string) => {
    onValueChange?.(val);
    setOpen(false);
  };

  const selectedLabel = React.Children.toArray(children)
    .map((child) => child as React.ReactElement)
    .find((child) => child.props.value === value)?.props.label;

  return (
    <div className="relative inline-block w-full text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
      >
        <span>{selectedLabel || "선택해주세요"}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md">
          <div className="max-h-60 overflow-y-auto py-1">
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement, {
                onSelect: handleSelect,
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SelectItem = ({
  value,
  label,
  onSelect,
}: {
  value: string;
  label: string;
  onSelect?: (val: string) => void;
}) => (
  <div
    onClick={() => onSelect?.(value)}
    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
  >
    {label}
  </div>
);
