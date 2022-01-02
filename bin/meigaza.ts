#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { MeigazaStack } from "../lib/meigaza-stack";
import { setUpLambdaLayer } from "../lib/setup-lambda-layer";

if (!process.env.SLACK_INCOMING_WEBHOOK_URL) {
  throw new Error("not set environment. execute `. .env.sh` before cdk command.");
}

setUpLambdaLayer();

const app = new App();
new MeigazaStack(app, "MeigazaStack");
