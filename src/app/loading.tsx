'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="ml-64 flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="animate-spin inline-block w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full" />
          <span className="text-gray-300">Loading…</span>
        </div>
      </div>
    </div>
  );
}