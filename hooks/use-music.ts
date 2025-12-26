"use client";

import { useState, useEffect, useCallback } from "react";
import { musicApi, MusicTrack, MusicFilters, MusicListResponse } from "@/lib/api";
import { toast } from "sonner";

export function useMusic(initialFilters?: MusicFilters) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MusicFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchMusic = useCallback(async (newFilters?: MusicFilters) => {
    setLoading(true);
    setError(null);

    const currentFilters = newFilters || filters;
    const result = await musicApi.list({
      ...currentFilters,
      page: pagination.page,
      limit: pagination.limit,
    });

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else if (result.data) {
      setTracks(result.data.data);
      setPagination({
        page: result.data.page,
        limit: result.data.limit,
        total: result.data.total,
        totalPages: result.data.totalPages,
      });
    }

    setLoading(false);
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchMusic();
  }, [filters, pagination.page]);

  const updateFilters = useCallback((newFilters: MusicFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  }, [pagination.page]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  }, [pagination.totalPages]);

  return {
    tracks,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    nextPage,
    prevPage,
    goToPage,
    refetch: fetchMusic,
  };
}

export function useMusicTrack(id: string) {
  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      setLoading(true);
      setError(null);

      const result = await musicApi.get(id);

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setTrack(result.data);
      }

      setLoading(false);
    }

    if (id) {
      fetchTrack();
    }
  }, [id]);

  return { track, loading, error };
}

