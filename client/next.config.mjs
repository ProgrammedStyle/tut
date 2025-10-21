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
    },
    
    // Configure headers for static files
    async headers() {
        return [
            {
                source: '/_html5/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000',
                    },
                ],
            },
        ];
    }
};

export default nextConfig;
