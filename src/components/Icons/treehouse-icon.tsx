import { cn } from "@/lib/utils";

interface TreehouseIconProps {
  size?: number;
  className?: string;
}

export function TreehouseIcon({ size = 24, className }: TreehouseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M5.25407 10.291L11.2638 4.79247C11.69 4.40252 12.3558 4.40252 12.782 4.79247L18.7917 10.291C19.5199 10.9573 19.0337 12.1442 18.0326 12.1442L15.8124 12.1442L21.1697 17.0086C22.1562 17.9043 21.4976 19.5 20.1413 19.5L3.85879 19.5C2.50258 19.5 1.84395 17.9043 2.83044 17.0086L8.18773 12.1442L6.01317 12.1442C5.01205 12.1442 4.52586 10.9573 5.25407 10.291Z"
        fill="currentColor"
      />
    </svg>
  );
}
