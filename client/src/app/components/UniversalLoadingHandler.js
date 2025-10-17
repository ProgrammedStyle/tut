"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading } from '../slices/loadingSlice';

// This component handles auto-hiding loading after navigation
// Pages should use usePageReady() hook to signal when they're done loading
const UniversalLoadingHandler = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { show } = useSelector((state) => state.loading);
    const timeoutRef = useRef(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Skip on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Fallback: Auto-hide after pages have had time to render and load
        // This prevents loading from getting stuck on pages that don't use the hook
        timeoutRef.current = setTimeout(() => {
            dispatch(hideLoading());
        }, 5000); // Maximum 5 seconds if page doesn't use usePageReady()
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [pathname, searchParams, dispatch]);

    // Note: Removed same-page timeout as it was interfering with form submissions
    // Form submissions and API requests now control their own loading timing

    return null;
};

export default UniversalLoadingHandler;

