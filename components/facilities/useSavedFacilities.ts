"use client";

import { useEffect, useState } from "react";

export type SavedFacility = {
  id: string;
  name: string;
  type: string;
  status: string;
  address: string;
  area: string;
};

export function useSavedFacilities() {
  const [facilities, setFacilities] = useState<SavedFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/facilities", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load saved facilities. The database connection may be unavailable.");
        return (await response.json()) as SavedFacility[];
      })
      .then(setFacilities)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to load saved facilities.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { facilities, loading, error };
}
