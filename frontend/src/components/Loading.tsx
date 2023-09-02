export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="w-20 h-20 border-4 border-white rounded-full animate-spin"></div>
    </div>
  );
}
