"use client";

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading } from '../slices/loadingSlice';
import { usePathname } from 'next/navigation';

/**
 * Hook to signal when a page has finished loading its data
 * Call this in your page component's useEffect after data is loaded
 * 
 * @param {boolean} isReady - Set to true when page data is loaded
 * @param {number} minDelay - Minimum time to show loading (ms), default 1500ms
 */
export const usePageReady = (isReady = true, minDelay = 1500) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const isReadyRef = useRef(false);

    // Reset isReady when pathname changes
    useEffect(() => {
        isReadyRef.current = false;
    }, [pathname]);

    useEffect(() => {
        if (isReady) {
            isReadyRef.current = true;
            let timeoutId;
            
            // Wait for next animation frame to ensure rendering is complete
            // Then add minimum delay for smooth UX
            const rafId = requestAnimationFrame(() => {
                timeoutId = setTimeout(() => {
                    // Only hide loading if we're still ready and on the same pathname
                    if (isReadyRef.current) {
                        dispatch(hideLoading());
                    }
                }, minDelay);
            });
            
            return () => {
                cancelAnimationFrame(rafId);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
    }, [isReady, minDelay, dispatch, pathname]);
};

export default usePageReady;

