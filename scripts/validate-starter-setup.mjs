#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const repoRoot = path.resolve(currentDirectoryPath, '..');
const localConfigPath = path.join(repoRoot, 'src/config/starterConfig.js');
const nodeModulesPath = path.join(repoRoot, 'node_modules');

function readCommandArgument() {
  return process.argv[2] || 'check';
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
      recoverySteps: ['Run npm install from the repository root.'],
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

function main() {
  const commandName = readCommandArgument();
  const validations = [
    validateNodeDependencies({ blockingCommand: commandName }),
    validateLocalConfig({ blockingCommand: commandName }),
  ].filter(Boolean);

  if (validations.length > 0) {
    validations.forEach(printFailure);
    process.exit(1);
  }

  console.log(`Starter preflight passed for '${commandName}'.`);
}

main();
