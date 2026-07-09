import { useQuery } from "@tanstack/react-query";

export interface MonumentSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

export interface MonumentDetails {
  title: string;
  extract: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

// ── Search Monuments ───────────────────────────────────────────────────────
export function useSearchMonuments(query: string, enabled = true) {
  return useQuery({
    queryKey: ["wiki-search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          query
        )}&utf8=&format=json&origin=*`
      );
      
      if (!res.ok) throw new Error("Failed to fetch search results");
      
      const data = await res.json();
      return (data?.query?.search || []) as MonumentSearchResult[];
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ── Monument Details (Extract & Image) ─────────────────────────────────────
export function useMonumentDetails(title: string, enabled = true) {
  return useQuery({
    queryKey: ["wiki-details", title],
    queryFn: async () => {
      if (!title) return null;

      // 1. Fetch details and image
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=&explaintext=&piprop=original|thumbnail&pithumbsize=600&titles=${encodeURIComponent(
          title
        )}&format=json&origin=*`
      );

      if (!res.ok) throw new Error("Failed to fetch details");

      const data = await res.json();
      const pages = data?.query?.pages;
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      if (pageId === "-1") return null; // Page not found

      const page = pages[pageId];

      const details: MonumentDetails = {
        title: page.title,
        extract: page.extract || "No description available.",
        imageUrl: page.original?.source,
        thumbnailUrl: page.thumbnail?.source,
      };

      return details;
    },
    enabled: enabled && !!title,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ── Image Only Fetch ───────────────────────────────────────────────────────
export function useWikipediaImage(title: string, enabled = true) {
  return useQuery({
    queryKey: ["wiki-image", title],
    queryFn: async () => {
      if (!title) return null;

      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&titles=${encodeURIComponent(
          title
        )}&format=json&origin=*`
      );

      if (!res.ok) throw new Error("Failed to fetch image");

      const data = await res.json();
      const pages = data?.query?.pages;
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      if (pageId === "-1") return null;

      const page = pages[pageId];
      // Prefer thumbnail (scaled to 800px) over original for performance
      return page.thumbnail?.source || page.original?.source || null;
    },
    enabled: enabled && !!title,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (images rarely change)
  });
}
