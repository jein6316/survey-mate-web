import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/app/utils/cn";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      onChange(parsed);
    }
  };

  return (
    <div className="relative w-[150px]">
      <input
        type="date"
        ref={ref}
        value={value ? format(value, "yyyy-MM-dd") : ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-10 px-3 py-2 border border-input rounded-md text-sm focus:outline-none"
      />
      <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
    </div>
  );
};
