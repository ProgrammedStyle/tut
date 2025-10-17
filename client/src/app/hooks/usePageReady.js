"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading } from '../slices/loadingSlice';

/**
 * Hook to signal when a page has finished loading its data
 * Call this in your page component's useEffect after data is loaded
 * 
 * @param {boolean} isReady - Set to true when page data is loaded
 * @param {number} minDelay - Minimum time to show loading (ms), default 1500ms
 */
export const usePageReady = (isReady = true, minDelay = 1500) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (isReady) {
            let timeoutId;
            
            // Wait for next animation frame to ensure rendering is complete
            // Then add minimum delay for smooth UX
            const rafId = requestAnimationFrame(() => {
                timeoutId = setTimeout(() => {
                    dispatch(hideLoading());
                }, minDelay);
            });
            
            return () => {
                cancelAnimationFrame(rafId);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
    }, [isReady, minDelay, dispatch]);
};

export default usePageReady;

