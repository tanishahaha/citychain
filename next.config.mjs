/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cnhddwdahnvmgusjrgpi.supabase.co",
                port:"",
            }
        ]
    }
};

export default nextConfig;
