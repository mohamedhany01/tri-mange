# check: https://docs.expo.dev/troubleshooting/clear-cache-macos-linux/

rm -rf node_modules                # Delete node_modules to ensure dependencies are reinstalled
npm cache clean --force            # Forcefully clear npm's cache
npm install                        # Reinstall dependencies
watchman watch-del-all             # Clear watchman watches (common issue with file tracking in React Native)
rm -fr $TMPDIR/haste-map-*         # Remove haste map cache (used by Metro bundler)
rm -rf $TMPDIR/metro-cache         # Remove Metro bundler cache
npx expo start --clear             # Clear Expo's bundler cache and restart the development server
