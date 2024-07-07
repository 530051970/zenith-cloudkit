import { Code, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";
import path = require("path");

export const creatAuthLayer = (scope: Construct) => {
    const LambdaEmbeddingLayer = new LayerVersion(
      scope,
      "APILambdaAuthLayer",
      {
        code: Code.fromAsset(
          path.join(__dirname, "../source/api/auth"),
          {
            bundling: {
              image: Runtime.PYTHON_3_9.bundlingImage,
              command: [
                "bash",
                "-c",
                `pip install -r requirements.txt ${BuildConfig.LAYER_PIP_OPTION} -t /asset-output/python`,
              ],
            },
          },
        ),
        compatibleRuntimes: [Runtime.PYTHON_3_9],
        description: `LLM Bot - API layer`,
      },
    );
    return LambdaEmbeddingLayer;
  }