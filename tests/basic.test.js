// Basic tests for QuestBase
const { describe, it, expect } = require('@jest/globals');

describe('QuestBase', () => {
  it('should have a valid manifest', () => {
    const manifest = require('../frontend/public/manifest.json');
    expect(manifest.name).toBe('QuestBase');
    expect(manifest.display).toBe('standalone');
  });

  it('should have a service worker', () => {
    const fs = require('fs');
    const path = require('path');
    const swPath = path.join(__dirname, '../frontend/public/sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
  });

  it('should have dark mode CSS', () => {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../frontend/src/dark-mode.css');
    expect(fs.existsSync(cssPath)).toBe(true);
  });
});
