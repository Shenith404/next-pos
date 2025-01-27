'use client'
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../services/clientSideApiService";

function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // useCallback ensures the function is stable across re-renders
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response: T = await apiService.get(url);
            setData(response);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [url]);  // Effect will re-run when the URL changes

    const reload = () => {
        fetchData();  // This triggers the fetching again
    };

    useEffect(() => {
        fetchData();  // Initial fetch when the component mounts or URL changes
    }, [fetchData]);  // Dependency on fetchData, which includes URL changes

    return { data, loading, error, reload };
}

export default useFetch;
