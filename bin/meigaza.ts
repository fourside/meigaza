#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { MeigazaStack } from "../lib/meigaza-stack";
import { setUpLambdaLayer } from "../lib/setup-lambda-layer";

if (!process.env.SLACK_INCOMING_WEBHOOK_URL) {
  throw new Error("not set environment. execute `. .env.sh` before cdk command.");
}

setUpLambdaLayer();

const app = new cdk.App();
new MeigazaStack(app, "MeigazaStack");
