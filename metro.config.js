const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const { assetExts, sourceExts } = defaultConfig.resolver;

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-css-transformer'),
      // assetPlugins: ['react-native-asset-plugin'],
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts],
      sourceExts: [...sourceExts],
    },
  };
})();
