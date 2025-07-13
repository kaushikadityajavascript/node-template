module.exports = {
  apps: [
    {
      name: "Airbrush API",
      script: "./bin/www",
      env_development: {
        PORT: 8080,
        NODE_ENV: "development",
      },
      env_staging: {
        PORT: 8080,
        NODE_ENV: "staging",
      },
      env_production: {
        PORT: 8080,
        NODE_ENV: "production",
      },
    },
  ],
};
