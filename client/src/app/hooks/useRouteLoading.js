import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { hideLoading } from '../slices/loadingSlice';

export const useRouteLoading = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        // Just ensure loading is hidden when route finishes loading
        // Individual pages will call showLoading() themselves
        const timer = setTimeout(() => {
            dispatch(hideLoading());
        }, 50);

        return () => clearTimeout(timer);
    }, [pathname, searchParams, dispatch]);

    return null;
};

export default useRouteLoading;
