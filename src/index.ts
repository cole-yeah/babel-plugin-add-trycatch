import * as babel from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import generator from "@babel/generator";
import type { StringLiteral } from "@babel/types";
import { stringLiteral } from "@babel/types";

export interface Options {
  preTip?: string;
  splitBy?: string;
  endLine?: boolean;
}

export default declare<Options, babel.PluginObj>((api, options, dirname) => {
  return {
    name: "console-log",
    visitor: {
      CallExpression(path) {
        console.log("xxxxx", path.node, path.find);
      },
    },
  };
});
