import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  className?: string;
  text?: string;
}

export function PlaceholderImage({ className, text = "No Image" }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "w-[80px] h-[80px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium rounded-md",
        className
      )}
    >
      <div className="text-center">
        <svg
          className="w-6 h-6 mx-auto mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs">{text}</span>
      </div>
    </div>
  );
} 