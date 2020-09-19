const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              dark: true,
              compact: true,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
