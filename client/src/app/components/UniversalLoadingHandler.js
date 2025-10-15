"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../slices/loadingSlice';

// This component handles showing/hiding loading for ALL page navigations
const UniversalLoadingHandler = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();

    useEffect(() => {
        // Show loading when pathname changes
        dispatch(showLoading());
        
        // Hide after 1 second (enough time to see it)
        const timer = setTimeout(() => {
            dispatch(hideLoading());
        }, 1000);
        
        return () => {
            clearTimeout(timer);
        };
    }, [pathname, dispatch]);

    return null;
};

export default UniversalLoadingHandler;

