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

  // 항목 선택시 부모로 값 전달
  const handleSelect = (val: string) => {
    onValueChange?.(val); // 부모로 선택된 값 전달
    setOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="relative inline-block w-full">
      {/* 드롭다운이 열리지 않았을 때만 SelectTrigger 보이게 */}
      <SelectTrigger onClick={() => setOpen((prev) => !prev)}>
        <SelectValue>{value}</SelectValue>
        <ChevronDown className="ml-auto h-4 w-4" />
      </SelectTrigger>

      {/* 드롭다운이 열린 경우에만 SelectContent 보이기 */}
      {open && (
        <SelectContent>
          {React.Children.map(children, (child) =>
            React.cloneElement(child as React.ReactElement, {
              onSelect: handleSelect, // 각 항목 클릭 시 선택 처리
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
    onClick={() => onSelect?.(value)} // 선택 시 onSelect 호출
    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent rounded"
  >
    {children}
  </div>
);
