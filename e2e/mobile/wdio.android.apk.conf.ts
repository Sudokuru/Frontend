import type { Options } from "@wdio/types";
import { config as baseConfig } from "./wdio.conf.ts";
import { config as dotenvconfig } from "dotenv-safe";

dotenvconfig();
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
declare const process: {
  env: {
    DEVICE_NAME: string;
    PLATFORM_VERSION: string;
    APK: string;
  };
};

export const config: Options.Testrunner = {
  ...baseConfig,
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // of the configuration file being run.
  //
  // The specs are defined as an array of spec files (optionally using wildcards
  // that will be expanded). The test for each spec file will be run in a separate
  // worker process. In order to have a group of spec files run in the same worker
  // process simply enclose them in an array within the specs array.
  //
  // The path of the spec files will be resolved relative from the directory of
  // of the config file unless it's absolute.
  //
  specs: ["./test/specs/**/*.ts"],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,

  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://saucelabs.com/platform/platform-configurator
  //
  capabilities: [
    {
      // capabilities for local Appium web tests on an Android Emulator
      platformName: "Android",
      port: 4723,
      "appium:deviceName": process.env.DEVICE_NAME,
      "appium:platformVersion": process.env.PLATFORM_VERSION,
      "appium:automationName": "UiAutomator2",
      "appium:app": process.env.APK,
    },
  ],
};
