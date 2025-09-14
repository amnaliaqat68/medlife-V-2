import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mx-auto mb-4`} />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ title = "Loading...", description = "Please wait while we fetch your data" }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5, columns = 4 }) {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-100 rounded-t-lg p-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
