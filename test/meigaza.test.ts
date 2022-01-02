import { expect as expectCDK, matchTemplate, MatchStyle } from "@aws-cdk/assert";
import { App } from "aws-cdk-lib";
import * as Meigaza from "../lib/meigaza-stack";

test("Empty Stack", () => {
  const app = new App();
  // WHEN
  const stack = new Meigaza.MeigazaStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
