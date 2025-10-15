"use client";

import Link from 'next/link';

const LoadingLink = ({ href, children, style, className, ...props }) => {
    const handleClick = (e) => {
        // Loading handled by UniversalLoadingHandler
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

