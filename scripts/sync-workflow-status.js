#!/usr/bin/env node
/**
 * SubagentStop Hook: Sync workflow status after subagent completes
 *
 * This script ensures workflow-status.yaml is updated after
 * a consultant subagent finishes its work.
 */

const fs = require('fs');
const path = require('path');

// Read input from stdin
let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    syncStatus(data);
  } catch (error) {
    // Silent failure
  }
  process.exit(0);
});

function syncStatus(data) {
  const projectRoot = process.cwd();
  const workflowStatusPath = path.join(projectRoot, '_consultant', 'workflow-status.yaml');

  if (!fs.existsSync(workflowStatusPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(workflowStatusPath, 'utf8');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update last_activity
    if (content.includes('last_activity:')) {
      content = content.replace(
        /last_activity:\s*["']?[^"'\n]*["']?/,
        `last_activity: "${now}"`
      );
    }

    // Add to history if we can detect the completed workflow
    // This is a simplified version - full implementation would parse the subagent result

    fs.writeFileSync(workflowStatusPath, content, 'utf8');

    console.log(JSON.stringify({
      systemMessage: `Workflow status synced at ${now}`
    }));

  } catch (error) {
    // Silent failure
  }
}

// Handle empty stdin
setTimeout(() => {
  if (input === '') {
    process.exit(0);
  }
}, 100);
