import { cn } from "../../lib/utils";

export default function Label({ className, children, ...props }) {
  return (
    <label
      className={cn("block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1", className)}
      {...props}
    >
      {children}
    </label>
  );
}
