import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage에 올린 사진을 next/image로 쓸 때 사용합니다.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
