/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com','cdn.example.org', 'avatars.githubusercontent.com'], // <-- replace with actual image domain
  },
};

module.exports = nextConfig;
