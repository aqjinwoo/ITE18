/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode in development for faster renders
  reactStrictMode: process.env.NODE_ENV === 'production',
  swcMinify: true,
  
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ===== PERFORMANCE OPTIMIZATIONS =====

  // Reduce the number of modules compiled on startup
  modularizeImports: {
    // Optimize Radix UI imports
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },

  // Experimental features for faster dev
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
    ],
  },

  // Webpack optimizations for development
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Faster source maps in development
      config.devtool = 'eval-source-map';
      
      // Reduce file system calls on Windows
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay rebuild after first change
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };

      // Snapshot optimization for faster rebuilds
      config.snapshot = {
        managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      };
    }
    return config;
  },
}

module.exports = nextConfig

