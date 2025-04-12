import React from "react";
import { cn } from "@/app/utils/cn";

export const Table = ({
  children,
  className,
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table
      className={cn("min-w-[600px] w-full caption-bottom text-sm", className)}
    >
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
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground text-nowrap [&:has([role=checkbox])]:pr-0",
      className
    )}
  >
    {children}
  </th>
);

export const TableCell = ({
  children,
  className,
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      "p-2 align-middle text-nowrap [&:has([role=checkbox])]:pr-0",
      className
    )}
  >
    {children}
  </td>
);
