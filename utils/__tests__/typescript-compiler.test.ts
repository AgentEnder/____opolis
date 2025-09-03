import { describe, it, expect } from 'vitest';
import { compileTypeScript, validateCompiledCode } from '../typescript-compiler';

describe('TypeScript Compiler', () => {
  describe('compileTypeScript', () => {
    it('should compile valid TypeScript code', async () => {
      const source = `
        function calculateScore(context: ScoringContext): number {
          const { countZonesOfType } = context;
          return countZonesOfType('residential') * 2;
        }
      `;
      
      const result = await compileTypeScript(source);
      
      expect(result.success).toBe(true);
      expect(result.compiled).toContain('function calculateScore');
      expect(result.compiled).toContain('self.calculateScore');
      expect(result.error).toBeUndefined();
    });

    it('should handle TypeScript compilation errors', async () => {
      const source = `
        function calculateScore(context: ScoringContext): number {
          // This will cause a syntax error
          return "unclosed string literal
        }
      `;
      
      const result = await compileTypeScript(source);
      
      // Should fail due to syntax error
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.compiled).toBe('');
    });

    it('should require calculateScore function', async () => {
      const source = `
        function notTheRightFunction(): number {
          return 42;
        }
      `;
      
      const result = await compileTypeScript(source);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('calculateScore');
    });

    it('should handle empty input', async () => {
      const result = await compileTypeScript('');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('calculateScore');
    });

    it('should preserve comments in output', async () => {
      const source = `
        // This is a comment
        function calculateScore(context: ScoringContext): number {
          // Another comment
          return 5;
        }
      `;
      
      const result = await compileTypeScript(source);
      
      expect(result.success).toBe(true);
      expect(result.compiled).toContain('// This is a comment');
      expect(result.compiled).toContain('// Another comment');
    });
  });

  describe('validateCompiledCode', () => {
    it('should allow safe code', () => {
      const safeCode = `
        function calculateScore(context) {
          return context.countZonesOfType('residential') * 2;
        }
        self.calculateScore = calculateScore;
      `;
      
      const result = validateCompiledCode(safeCode);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject dangerous patterns', () => {
      const dangerousCodes = [
        'eval("malicious code")',
        'new Function("return window")()',
        'setTimeout(function() {}, 1000)',
        'fetch("http://evil.com")',
        'window.location = "http://evil.com"',
        'document.createElement("script")',
        'localStorage.setItem("key", "value")',
      ];

      for (const code of dangerousCodes) {
        const result = validateCompiledCode(code);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    it('should reject excessively large code', () => {
      const largeCode = 'var x = 1;\n'.repeat(1001);
      
      const result = validateCompiledCode(largeCode);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too complex');
    });
  });
});