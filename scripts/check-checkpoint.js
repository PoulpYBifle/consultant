#!/usr/bin/env node
/**
 * PreToolUse Hook: Check if a checkpoint approval is required
 *
 * This script reads the workflow-status.yaml and project-path.yaml
 * to determine if the current action requires checkpoint approval.
 *
 * Input (stdin): JSON with tool_name and tool_input
 * Output (stdout): JSON with decision (approve/block) and reason
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
    const result = checkCheckpoint(data);
    console.log(JSON.stringify(result));
    process.exit(result.decision === 'block' ? 2 : 0);
  } catch (error) {
    // On error, allow the action to proceed
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
});

function checkCheckpoint(data) {
  const projectRoot = process.cwd();
  const workflowStatusPath = path.join(projectRoot, '_consultant', 'workflow-status.yaml');
  const projectPathPath = path.join(projectRoot, '_consultant', 'project-path.yaml');

  // If files don't exist, allow action
  if (!fs.existsSync(workflowStatusPath) || !fs.existsSync(projectPathPath)) {
    return { decision: 'approve' };
  }

  try {
    const workflowStatus = fs.readFileSync(workflowStatusPath, 'utf8');
    const projectPath = fs.readFileSync(projectPathPath, 'utf8');

    // Simple YAML parsing for checkpoint detection
    // Look for pending checkpoints that haven't been passed

    // Extract current phase
    const phaseMatch = workflowStatus.match(/phase:\s*["']?(\w+)["']?/);
    const currentPhase = phaseMatch ? phaseMatch[1] : 'discovery';

    // Extract checkpoints_passed
    const checkpointsPassed = [];
    const passedMatch = workflowStatus.match(/checkpoints_passed:([\s\S]*?)(?=\n\w|\n$|$)/);
    if (passedMatch) {
      const passedSection = passedMatch[1];
      const checkpointMatches = passedSection.matchAll(/(\w+):\s*["']?([^"'\n]+)["']?/g);
      for (const match of checkpointMatches) {
        checkpointsPassed.push(match[1]);
      }
    }

    // Check for blocking checkpoints in project-path.yaml
    const blockingCheckpoints = {
      'quotation': 'quotation_approval',
      'delivery': 'final_delivery'
    };

    const requiredCheckpoint = blockingCheckpoints[currentPhase];

    if (requiredCheckpoint && !checkpointsPassed.includes(requiredCheckpoint)) {
      // Check if we're trying to write to output files (which would mean completing the phase)
      const filePath = data.tool_input?.file_path || '';

      if (filePath.includes('/output/') || filePath.includes('\\output\\')) {
        return {
          decision: 'block',
          stopReason: `Checkpoint '${requiredCheckpoint}' required before proceeding.`,
          additionalContext: `This action requires approval. Please review and approve the ${currentPhase} phase deliverables before continuing.`
        };
      }
    }

    return { decision: 'approve' };

  } catch (error) {
    // On parse error, allow action
    return { decision: 'approve' };
  }
}

// Handle case where stdin is empty or immediate
setTimeout(() => {
  if (input === '') {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
}, 100);
