import "./src/env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  redirects: async () => {
    return [
      {
        source: "/forms",
        destination: "/dashboard",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
