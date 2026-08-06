import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[150px] md:text-[200px] font-black text-white/5 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className="text-primary font-black text-5xl md:text-7xl">404</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
          Page Not Found
        </h1>
        <p className="text-muted text-lg max-w-md mx-auto mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="bg-primary text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition"
          >
            Go Home
          </Link>
          <Link
            href="/explore"
            className="border border-primary/40 text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-white transition"
          >
            Explore Campaigns
          </Link>
        </div>
      </div>
    </div>
    
  );
}