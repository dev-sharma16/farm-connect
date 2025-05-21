import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen px-8 pb-20 sm:px-20 grid place-items-center bg-[#F8FFF2]  font-[family-name:var(--font-geist-sans)]">
      <div className="text-center max-w-xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#113A18]">
          Welcome to FarmConnect
        </h1>
        <p className="text-lg sm:text-xl text-gray-700">
          Bridging the gap between Farmers and Consumers with a trusted and transparent platform.
        </p>
        <Link
          href="/signUp"
          className="inline-block bg-[#113A18] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#0e2f14] transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
