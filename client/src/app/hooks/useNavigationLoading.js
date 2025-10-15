"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading } from '../slices/loadingSlice';

export const useNavigationLoading = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { show } = useSelector((state) => state.loading);

    useEffect(() => {
        // ALWAYS hide loading after navigation completes, even if pathname didn't change
        // This fixes the issue where clicking the same page leaves loading stuck
        if (show) {
            console.log('🔄 useNavigationLoading - Hiding loading after navigation');
            const timer = setTimeout(() => {
                dispatch(hideLoading());
            }, 800); // Extended to 800ms so it's visible

            return () => clearTimeout(timer);
        }
    }, [pathname, show, dispatch]);

    return null;
};

export default useNavigationLoading;

