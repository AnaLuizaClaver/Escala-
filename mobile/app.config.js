module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, baseUrl: process.env.ESCALAE_PWA_BASE || '' },
});
