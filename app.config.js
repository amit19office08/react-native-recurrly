module.exports = function ({ config }) {
  return {
    ...config,
    extra: {
      ...config.extra,
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
      eas: {
        projectId: "e40e0100-0500-4658-8b2f-4c7f704ab4ea",
      },
    },
  };
};