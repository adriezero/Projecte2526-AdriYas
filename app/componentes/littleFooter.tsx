"use client";

export default function LittleFooter() {
  return (
    <>
      {/* FOOTER CON POCA INFORMACIÓN */}
      <footer className="fixed bottom-0 left-0 w-full h-20 flex justify-center items-center font-bold bg-gray-200 text-center text-gray-700">
        Copyright © {new Date().getFullYear()} TruckWave
      </footer>
    </>
  );
}