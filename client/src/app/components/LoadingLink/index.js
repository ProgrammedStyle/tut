"use client";

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { showLoading } from '../../slices/loadingSlice';

const LoadingLink = ({ href, children, style, className, ...props }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();

    const handleClick = (e) => {
        // Only show loading if navigating to a different page
        if (href !== pathname) {
            dispatch(showLoading());
        }
    };

    return (
        <Link 
            href={href} 
            style={style}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
};

export default LoadingLink;

