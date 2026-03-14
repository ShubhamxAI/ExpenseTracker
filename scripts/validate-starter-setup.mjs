#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const repoRoot = path.resolve(currentDirectoryPath, '..');
const localConfigPath = path.join(repoRoot, 'src/config/starterConfig.js');
const nodeModulesPath = path.join(repoRoot, 'node_modules');
const androidProjectPath = path.join(repoRoot, 'android');
const gradleWrapperPath = path.join(androidProjectPath, 'gradlew');
const defaultAndroidSdkPath = path.join(os.homedir(), 'Android', 'Sdk');

function readCommandArgument() {
  return process.argv[2] || 'check';
}

function commandRequiresAndroidSdk(commandName) {
  return ['android', 'apk'].includes(commandName);
}

function commandRequiresDevice(commandName) {
  return commandName === 'android';
}

function resolveAndroidSdkPath() {
  const candidatePaths = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    defaultAndroidSdkPath,
  ].filter(Boolean);

  return (
    candidatePaths.find((candidatePath) => fs.existsSync(candidatePath)) || null
  );
}

function resolveAdbPath(androidSdkPath) {
  if (!androidSdkPath) {
    return null;
  }

  const adbExecutableName = process.platform === 'win32' ? 'adb.exe' : 'adb';
  const adbPath = path.join(
    androidSdkPath,
    'platform-tools',
    adbExecutableName,
  );

  return fs.existsSync(adbPath) ? adbPath : null;
}

function createFailure({ code, message, recoverySteps, blockingCommand } = {}) {
  return {
    code,
    message,
    recoverySteps,
    blockingCommand,
  };
}

function printFailure({ code, message, recoverySteps, blockingCommand } = {}) {
  console.error(`[${code}] ${message}`);
  console.error(`Blocked command: ${blockingCommand}`);
  recoverySteps.forEach((recoveryStep, recoveryIndex) => {
    console.error(`${recoveryIndex + 1}. ${recoveryStep}`);
  });
}

function validateNodeDependencies({ blockingCommand } = {}) {
  if (!fs.existsSync(nodeModulesPath)) {
    return createFailure({
      code: 'MISSING_NODE_DEPENDENCIES',
      message: 'Project dependencies are not installed.',
      recoverySteps: ['Run yarn from the repository root.'],
      blockingCommand,
    });
  }

  return null;
}

function validateLocalConfig({ blockingCommand } = {}) {
  if (!fs.existsSync(localConfigPath)) {
    return createFailure({
      code: 'MISSING_LOCAL_CONFIG',
      message: 'The local starter configuration file is missing.',
      recoverySteps: [
        'Copy src/config/starterConfig.example.js to src/config/starterConfig.js.',
        'Edit greetingMessage and baselineLabel before retrying the starter command.',
      ],
      blockingCommand,
    });
  }

  return null;
}

function validateAndroidSdk({ blockingCommand, androidSdkPath } = {}) {
  if (!commandRequiresAndroidSdk(blockingCommand)) {
    return null;
  }

  if (!androidSdkPath) {
    return createFailure({
      code: 'MISSING_ANDROID_SDK',
      message: 'Android SDK was not found for the requested Android command.',
      recoverySteps: [
        'Install Android Studio and the Android SDK command-line tools.',
        'Set ANDROID_HOME or ANDROID_SDK_ROOT to your SDK path, or install the SDK at ~/Android/Sdk.',
        `Retry the blocked command after the SDK is available: yarn starter:${blockingCommand}`,
      ],
      blockingCommand,
    });
  }

  return null;
}

function validateAndroidPlatformTools({
  blockingCommand,
  androidSdkPath,
} = {}) {
  if (!commandRequiresAndroidSdk(blockingCommand)) {
    return null;
  }

  if (!androidSdkPath) {
    return null;
  }

  const adbPath = resolveAdbPath(androidSdkPath);

  if (!adbPath) {
    return createFailure({
      code: 'MISSING_ANDROID_PLATFORM_TOOLS',
      message: 'Android platform-tools were not found, so adb is unavailable.',
      recoverySteps: [
        'Install Android platform-tools from Android Studio SDK Manager.',
        'Confirm that the SDK path contains platform-tools/adb.',
        `Retry the blocked command after adb is available: yarn starter:${blockingCommand}`,
      ],
      blockingCommand,
    });
  }

  return null;
}

function validateAndroidProject({ blockingCommand } = {}) {
  if (blockingCommand !== 'apk') {
    return null;
  }

  if (!fs.existsSync(androidProjectPath) || !fs.existsSync(gradleWrapperPath)) {
    return createFailure({
      code: 'MISSING_ANDROID_PROJECT',
      message:
        'The native Android project files required for debug APK generation are missing.',
      recoverySteps: [
        'Generate the Android project with Expo prebuild or Expo run:android before building the APK.',
        'Confirm that android/gradlew exists in the repository root.',
        'Retry the APK build with yarn starter:apk once the Android project is available.',
      ],
      blockingCommand,
    });
  }

  return null;
}

function validateConnectedDevice({ blockingCommand, androidSdkPath } = {}) {
  if (!commandRequiresDevice(blockingCommand)) {
    return null;
  }

  const adbPath = resolveAdbPath(androidSdkPath);

  if (!adbPath) {
    return null;
  }

  try {
    const adbOutput = execFileSync(adbPath, ['devices'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const connectedDevices = adbOutput
      .split('\n')
      .slice(1)
      .map((line) => line.trim())
      .filter((line) => line.endsWith('\tdevice'));

    if (connectedDevices.length === 0) {
      return createFailure({
        code: 'MISSING_DEVICE',
        message:
          'No Android emulator or physical device is available for the requested run command.',
        recoverySteps: [
          'Start an Android emulator from Android Studio Device Manager, or connect a phone with USB debugging enabled.',
          'Run adb devices and confirm at least one entry is listed with the device state.',
          'Retry the Android launch with yarn starter:android once a device is ready.',
        ],
        blockingCommand,
      });
    }
  } catch {
    return createFailure({
      code: 'MISSING_DEVICE',
      message:
        'adb could not verify an Android emulator or physical device for the requested run command.',
      recoverySteps: [
        'Start an Android emulator from Android Studio Device Manager, or connect a phone with USB debugging enabled.',
        'Run adb devices and confirm at least one entry is listed with the device state.',
        'Retry the Android launch with yarn starter:android once a device is ready.',
      ],
      blockingCommand,
    });
  }

  return null;
}

function main() {
  const commandName = readCommandArgument();
  const androidSdkPath = resolveAndroidSdkPath();
  const validations = [
    validateNodeDependencies({ blockingCommand: commandName }),
    validateLocalConfig({ blockingCommand: commandName }),
    validateAndroidSdk({ blockingCommand: commandName, androidSdkPath }),
    validateAndroidPlatformTools({
      blockingCommand: commandName,
      androidSdkPath,
    }),
    validateAndroidProject({ blockingCommand: commandName }),
    validateConnectedDevice({ blockingCommand: commandName, androidSdkPath }),
  ].filter(Boolean);

  if (validations.length > 0) {
    validations.forEach(printFailure);
    process.exit(1);
  }

  console.log(`Starter preflight passed for '${commandName}'.`);
}

main();
