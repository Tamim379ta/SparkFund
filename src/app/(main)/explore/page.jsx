import { Suspense } from "react";
import ExploreClient from "@/components/explore/ExploreClient";

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExploreClient />
    </Suspense>
  );
}