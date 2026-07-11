/**
 * Next.js Configuration Wrapper: withSkelly(nextConfig)
 */
export function withSkelly(nextConfig: any = {}) {
  return {
    ...nextConfig,
    env: {
      ...nextConfig.env,
      SKELLY_ENABLED: "true"
    },
    webpack(config: any, options: any) {
      // Custom Webpack configurations to handle server-side specs
      if (nextConfig.webpack) {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  };
}
