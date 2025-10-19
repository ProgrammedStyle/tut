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
    const previousPathRef = useRef(null);

    useEffect(() => {
        // Skip on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            previousPathRef.current = pathname;
            return;
        }

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Note: Removed same-page detection as it conflicts with usePageReady
        // Pages should use usePageReady() hook to control their own loading timing
        
        // Fallback: Auto-hide after pages have had time to render and load
        // This prevents loading from getting stuck on pages that don't use the hook
        timeoutRef.current = setTimeout(() => {
            dispatch(hideLoading());
        }, 2000); // Reduced to 2 seconds for faster response
        
        previousPathRef.current = pathname;
        
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

