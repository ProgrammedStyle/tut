/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development
    reactStrictMode: true,
    
    // Configure static file serving
    async rewrites() {
        return [
            {
                source: '/_html5/:path*',
                destination: '/api/static/_html5/:path*'
            }
        ];
    }
};

export default nextConfig;
