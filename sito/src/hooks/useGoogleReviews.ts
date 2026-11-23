import { useQuery } from "@tanstack/react-query";
import { agencyRatings as fallbackRatings, reviews as fallbackReviews, REVIEWS_UPDATED, sumReviews, weightedAverage } from "@/data/reviews";
import type { AgencyRating, Review } from "@/data/reviews";

type ApiResponse = {
  ok: boolean;
  updated: string;
  agencies: (AgencyRating & { rating: number | null })[];
  reviews: Review[];
};

/** Recensioni Google aggiornate (da /api/recensioni); se la funzione non risponde, usa la copia salvata nel sito. */
export const useGoogleReviews = () => {
  const { data } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: async (): Promise<ApiResponse | null> => {
      const res = await fetch("/api/recensioni", { headers: { Accept: "application/json" } });
      if (!res.ok || !(res.headers.get("content-type") || "").includes("application/json")) return null;
      const body = (await res.json()) as ApiResponse;
      return body.ok && body.agencies?.length ? body : null;
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const live = !!data;
  const ratings: AgencyRating[] = live
    ? data!.agencies.filter((a) => a.rating != null).map((a) => ({ agency: a.agency, rating: a.rating!, count: a.count, url: a.url }))
    : fallbackRatings;
  const reviews = live && data!.reviews.length ? data!.reviews : fallbackReviews;
  const updatedLabel = live
    ? new Date(data!.updated).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : REVIEWS_UPDATED;

  return { live, ratings, reviews, total: sumReviews(ratings), average: weightedAverage(ratings), updatedLabel };
};
