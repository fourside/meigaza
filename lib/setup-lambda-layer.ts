import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as crypt from "crypto";
import * as rimraf from "rimraf";

export const LAMBDA_LAYER_DIR = `${process.cwd()}/layer`;
const LAMBDA_LAYER_RUNTIME_DIR = "nodejs";
const LAMBDA_DIR = path.join(__dirname, "lambdas");

export const PARCEL_CACHE_BASE_DIR = ".parcel-cache";

const PACKAGE_JSON = "package.json";
const PACKAGE_LOCK_JSON = "package-lock.json";

export function setUpLambdaLayer(): void {
  const targetDir = path.join(LAMBDA_LAYER_DIR, LAMBDA_LAYER_RUNTIME_DIR);
  fs.mkdirSync(targetDir, { recursive: true });

  if (isSameBefore(LAMBDA_DIR, targetDir)) {
    console.log("skip making lambda layer");
    return;
  }
  for (const fileName of [PACKAGE_JSON, PACKAGE_LOCK_JSON]) {
    fs.copyFileSync(path.join(LAMBDA_DIR, fileName), path.join(targetDir, fileName));
  }

  const command = `npm --prefix ${targetDir} install --production`;
  childProcess.execSync(command, {
    stdio: ["ignore", "inherit", "inherit"],
    env: { ...process.env },
  });
}

function isSameBefore(srcDir: string, destDir: string) {
  const destFile = path.join(destDir, PACKAGE_LOCK_JSON);
  if (!fs.existsSync(destFile)) {
    return false;
  }
  const srcFile = path.join(srcDir, PACKAGE_LOCK_JSON);
  return md5hash(srcFile) === md5hash(destFile);
}

function md5hash(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const hash = crypt.createHash("md5");
  hash.update(buffer);
  return hash.digest("base64");
}

export function lambdaDependencies(): string[] {
  const file = path.join(LAMBDA_DIR, PACKAGE_JSON);
  const packageJsonString = fs.readFileSync(file, "utf-8");
  const packageJson = JSON.parse(packageJsonString);
  const dependencies = packageJson["dependencies"];
  const devDependencies = packageJson["devDependencies"];
  const deps = Object.keys(dependencies).concat(Object.keys(devDependencies));
  return deps;
}

export function cleanParcelCacheDir(): void {
  rimraf.sync(PARCEL_CACHE_BASE_DIR);
}
