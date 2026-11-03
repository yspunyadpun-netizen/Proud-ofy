import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const page = await base44.entities.Profile.filter({}, { sort: "-created_date", limit: 1 });
      setProfile(page?.items?.[0] || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, refresh, setProfile };
}