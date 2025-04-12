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
  const [selected, setSelected] = React.useState(value || "");

  const handleSelect = (val: string) => {
    setSelected(val);
    setOpen(false);
    onValueChange?.(val);
  };

  return (
    <div className="relative inline-block w-full">
      <SelectTrigger onClick={() => setOpen(!open)}>
        <SelectValue>{selected}</SelectValue>
        <ChevronDown className="ml-auto h-4 w-4" />
      </SelectTrigger>
      {open && (
        <SelectContent>
          {React.Children.map(children, (child) =>
            React.cloneElement(child as React.ReactElement, {
              onSelect: handleSelect,
            })
          )}
        </SelectContent>
      )}
    </div>
  );
};

export const SelectTrigger = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "flex items-center justify-between w-full px-3 py-2 border border-input rounded-md bg-background text-sm",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const SelectValue = ({ children }: { children?: React.ReactNode }) => (
  <span>{children}</span>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
    <div className="p-1 space-y-1 max-h-60 overflow-y-auto">{children}</div>
  </div>
);

export const SelectItem = ({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (val: string) => void;
}) => (
  <div
    onClick={() => onSelect?.(value)}
    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent rounded"
  >
    {children}
  </div>
);
