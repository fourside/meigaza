#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MeigazaStack } from '../lib/meigaza-stack';
import { setUpLambdaLayer } from "../lib/setup-lambda-layer";

setUpLambdaLayer();

const app = new cdk.App();
new MeigazaStack(app, 'MeigazaStack');
