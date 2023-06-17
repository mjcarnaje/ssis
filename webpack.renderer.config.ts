import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push({
  test: /\.css$/,
  use: [
    {
      loader: "style-loader",
    },
    { loader: "css-loader" },
  ],
});

rules.push({
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        publicPath: "file://",
      },
    },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
