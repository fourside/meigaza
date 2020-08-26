import { Stack, StackProps, Construct, Duration } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { LayerVersion, AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { RetentionDays } from "@aws-cdk/aws-logs";
import * as path from "path";
import { LAMBDA_LAYER_DIR, lambdaDependencies, PARCEL_CACHE_BASE_DIR } from "./setup-lambda-layer";

export class MeigazaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new LayerVersion(this, "chromeLayer", {
      code: AssetCode.fromAsset(LAMBDA_LAYER_DIR),
      compatibleRuntimes: [Runtime.NODEJS_12_X],
    });

    const npms = lambdaDependencies();
    const lambdaOptions = {
      runtime: Runtime.NODEJS_12_X,
      memorySize: 1600,
      logRetention: RetentionDays.SIX_MONTHS,
      layers: [layer],
      timeout: Duration.minutes(3),
      sourceMaps: true,
      externalModules: ["aws-sdk", ...npms],
    };

    const meigazaFunction = new NodejsFunction(this, "meigaza", {
      entry: path.join(__dirname, "lambdas/meigaza/meigaza.ts"),
      handler: "handler",
      environment: {
        SLACK_INCOMING_WEBHOOK_URL: process.env.SLACK_INCOMING_WEBHOOK_URL || "",
      },
      cacheDir: `./${PARCEL_CACHE_BASE_DIR}/meigaza`,
      ...lambdaOptions,
    });

    new Rule(this, "meigazaRule", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "22",
      }),
      targets: [new LambdaFunction(meigazaFunction)],
    });

    const mvtkFunction = new NodejsFunction(this, "mvtk", {
      entry: path.join(__dirname, "lambdas/mvtk/mvtk.ts"),
      handler: "handler",
      environment: {
        MVTK_USER: process.env.MVTK_USER || "",
        MVTK_PASSWORD: process.env.MVTK_PASSWORD || "",
        IFTTT_WEBHOOK_URL: process.env.IFTTT_WEBHOOK_URL || "",
        SLACK_INCOMING_WEBHOOK_URL: process.env.SLACK_INCOMING_WEBHOOK_URL || "",
      },
      cacheDir: `./${PARCEL_CACHE_BASE_DIR}/mvtk`,
      ...lambdaOptions,
    });

    new Rule(this, "mvtkRule", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "22",
        weekDay: "MON,WED",
      }),
      targets: [new LambdaFunction(mvtkFunction)],
    });
  }
}
