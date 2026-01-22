#!/usr/bin/env node
/**
 * PostToolUse Hook: Update last_activity timestamp in workflow-status.yaml
 *
 * This script updates the project.last_activity field whenever
 * a file is edited or written.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const workflowStatusPath = path.join(projectRoot, '_consultant', 'workflow-status.yaml');

try {
  if (!fs.existsSync(workflowStatusPath)) {
    process.exit(0);
  }

  let content = fs.readFileSync(workflowStatusPath, 'utf8');
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Update last_activity
  if (content.includes('last_activity:')) {
    content = content.replace(
      /last_activity:\s*["']?[^"'\n]*["']?/,
      `last_activity: "${now}"`
    );
  }

  fs.writeFileSync(workflowStatusPath, content, 'utf8');

  console.log(JSON.stringify({
    systemMessage: `Activity updated: ${now}`
  }));

} catch (error) {
  // Silent failure - don't block on update errors
}

process.exit(0);
