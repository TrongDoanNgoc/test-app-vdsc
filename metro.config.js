const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withRozenite} = require('@rozenite/metro');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  // Your existing Metro configuration
};

module.exports = withRozenite(mergeConfig(defaultConfig, customConfig), {
  enabled: process.env.WITH_ROZENITE === 'true',
  include: [
    '@rozenite/mmkv-plugin',
    '@rozenite/network-activity-plugin',
    '@rozenite/tanstack-query-plugin',
  ],
});
