import { Construct } from "constructs";
import {
  Stack,
  StackProps,
  Duration,
  aws_lambda,
  aws_lambda_nodejs,
  aws_events,
  aws_events_targets,
  aws_logs,
} from "aws-cdk-lib";
import * as path from "path";
import { LAMBDA_LAYER_DIR, lambdaDependencies } from "./setup-lambda-layer";

export class MeigazaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { LayerVersion, AssetCode, Runtime } = aws_lambda;
    const { Rule, Schedule } = aws_events;
    const { LambdaFunction } = aws_events_targets;
    const { RetentionDays } = aws_logs;
    const { NodejsFunction } = aws_lambda_nodejs;

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
