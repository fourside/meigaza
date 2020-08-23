import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

export const LAMBDA_LAYER_DIR = `${process.cwd()}/layer`;
const LAMBDA_LAYER_RUNTIME_DIR = "nodejs";
const LAMBDA_DIR = path.join(__dirname, "lambdas");

export function setUpLambdaLayer() {
  const targetDir = path.join(LAMBDA_LAYER_DIR, LAMBDA_LAYER_RUNTIME_DIR);
  fs.mkdirSync(targetDir, { recursive: true });

  for (const fileName of ["package.json", "package-lock.json"]) {
    fs.copyFileSync(path.join(LAMBDA_DIR, fileName), path.join(targetDir, fileName));
  }

  const command = `npm --prefix ${targetDir} install --production`;
  childProcess.execSync(command, {
    stdio: ["ignore", "inherit", "inherit"],
    env: {...process.env},
  });
}
