"use client";

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { showLoading } from '../../slices/loadingSlice';

const LoadingLink = ({ href, children, style, className, ...props }) => {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        // Show loading immediately on click
        dispatch(showLoading());
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

