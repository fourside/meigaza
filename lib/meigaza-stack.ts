import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { LayerVersion, AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import * as path from "path";

export class MeigazaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new LayerVersion(this, "chromeLayer", {
      code: AssetCode.fromAsset(""), // TODO
      compatibleRuntimes: [Runtime.NODEJS_12_X],
    });

    const meigazaFunction = new NodejsFunction(this, "meigaza", {
      entry: path.join(__dirname, "lambdas/meigaza/maigaza.ts"),
      runtime: Runtime.NODEJS_12_X,
      layers: [layer],
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
      runtime: Runtime.NODEJS_12_X,
      layers: [layer],
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
