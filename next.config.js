module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
    ],
  },
};