export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-solid rounded-full animate-spin border-t-indigo-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 font-medium">
          Loading
        </div>
      </div>
    </div>
  );
}
