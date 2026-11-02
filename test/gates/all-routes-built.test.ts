import { test } from "node:test";
import assert from "node:assert/strict";
import { LAUNCH_ROUTES } from "../../src/lib/launchRouteRegistry.ts";
import { builtPageExists } from "../helpers/dist.ts";

const required = process.env.REQUIRE_ALL_ROUTES === "1";

test(
  "every published route is built",
  {
    skip: required
      ? false
      : "REQUIRE_ALL_ROUTES is not 1, so pages other jobs have not built yet are allowed",
  },
  () => {
    const missing = LAUNCH_ROUTES.filter((route) => !builtPageExists(route.path)).map((route) => route.path);
    assert.deepEqual(missing, [], `missing from dist: ${missing.join(", ")}`);
  },
);
