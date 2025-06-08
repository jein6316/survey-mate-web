import React from "react";
import { cn } from "@/app/utils/cn";

export const Table = ({
  children,
  className,
  colWidths = [], // 추가
}: React.HTMLAttributes<HTMLTableElement> & { colWidths?: string[] }) => (
  <div className="w-full overflow-auto">
    <table
      className={cn("min-w-[600px] w-full caption-bottom text-sm", className)}
    >
      {colWidths.length > 0 && (
        <colgroup>
          {colWidths.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
      )}
      {children}
    </table>
  </div>
);

export const TableHeader = ({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("[&_tr]:border-b bg-muted", className)}>
    {children}
  </thead>
);

export const TableBody = ({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)}>
    {children}
  </tbody>
);

export const TableRow = ({
  children,
  className,
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
  >
    {children}
  </tr>
);

export const TableHead = ({
  children,
  className,
  style,
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "h-10 px-4 py-2 text-left align-middle font-bold text-muted-foreground text-nowrap [&:has([role=checkbox])]:pr-0",
      className
    )}
    style={style}
  >
    {children}
  </th>
);

export const TableCell = ({
  children,
  className,
  onClick,
  style,
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      "align-middle text-nowrap [&:has([role=checkbox])]:pr-0",
      className
    )}
    onClick={onClick}
    style={style}
  >
    {children}
  </td>
);
