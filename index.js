// This file is to help deployment platforms locate the correct entry point
// The actual entry point is in server/index.ts, which is built to dist/index.js

// Just require the built server file
import('./dist/index.js').catch(err => {
  console.error('Failed to load application:', err);
  process.exit(1);
});