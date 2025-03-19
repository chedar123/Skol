// strato-config.js
module.exports = {
  apps: [
    {
      name: 'slotskolan',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        // Se till att alla nödvändiga miljövariabler från .env.production finns här
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_URL: 'https://slotskolan.com',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        // Lägg till fler miljövariabler efter behov
      },
    },
  ],
}; 