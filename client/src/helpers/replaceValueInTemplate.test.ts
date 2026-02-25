import { describe, it, expect } from 'vitest';
import { replaceValueInTemplate } from './replaceValueInTemplate';

describe('replaceValueInTemplate', () => {
  describe('basic replacement with default delimiter @@@', () => {
    it('replaces a single placeholder', () => {
      expect(replaceValueInTemplate('Hello, @@@name@@@!', { name: 'World' })).toBe('Hello, World!');
    });

    it('replaces multiple different placeholders', () => {
      expect(
        replaceValueInTemplate('Dear @@@firstName@@@ @@@lastName@@@,', {
          firstName: 'John',
          lastName: 'Doe',
        })
      ).toBe('Dear John Doe,');
    });

    it('replaces the same placeholder appearing multiple times', () => {
      expect(
        replaceValueInTemplate('@@@word@@@ is @@@word@@@', { word: 'test' })
      ).toBe('test is test');
    });

    it('returns the template unchanged when mapping is empty', () => {
      expect(replaceValueInTemplate('Hello, @@@name@@@!', {})).toBe('Hello, @@@name@@@!');
    });

    it('returns the template unchanged when no placeholders are present', () => {
      expect(replaceValueInTemplate('No placeholders here.', { name: 'World' })).toBe(
        'No placeholders here.'
      );
    });

    it('handles an empty template string', () => {
      expect(replaceValueInTemplate('', { name: 'World' })).toBe('');
    });

    it('handles a template with only the placeholder', () => {
      expect(replaceValueInTemplate('@@@value@@@', { value: '42' })).toBe('42');
    });

    it('ignores mapping keys that have no matching placeholder', () => {
      expect(replaceValueInTemplate('Hello, @@@name@@@!', { name: 'Alice', unused: 'x' })).toBe(
        'Hello, Alice!'
      );
    });
  });

  describe('custom delimiter', () => {
    it('replaces placeholder with a custom delimiter', () => {
      expect(
        replaceValueInTemplate('Hello, {{name}}!', { name: 'World' }, '{{}}')
      ).toBe('Hello, World!');
    });

    it('replaces placeholder with a single-character delimiter', () => {
      expect(replaceValueInTemplate('Hi %name%!', { name: 'Bob' }, '%')).toBe('Hi Bob!');
    });

    it('replaces placeholder with a multi-character custom delimiter', () => {
      expect(
        replaceValueInTemplate('Price: __price__ USD', { price: '100' }, '__')
      ).toBe('Price: 100 USD');
    });
  });

  describe('edge cases', () => {
    it('replaces placeholder with an empty string value', () => {
      expect(replaceValueInTemplate('Hello, @@@name@@@!', { name: '' })).toBe('Hello, !');
    });

    it('handles special regex characters in the template text (not in delimiters)', () => {
      expect(
        replaceValueInTemplate('Cost: $5 + @@@extra@@@', { extra: '10' })
      ).toBe('Cost: $5 + 10');
    });

    it('matches @@@name@@@ inside @@@@@ wrapper, leaving surrounding @@ intact', () => {
      // @@@@@name@@@@@ = @@ + @@@name@@@ + @@
      // The regex @@@name@@@ matches at index 2, so the remaining @@ on each side are preserved
      expect(replaceValueInTemplate('@@@@@name@@@@@', { name: 'World' })).toBe('@@World@@');
    });

    it('does not replace when placeholder is wrapped with only @@ (less than delimiter length)', () => {
      // @@name@@ has only 2 @ signs on each side, delimiter needs 3 — no match
      expect(replaceValueInTemplate('@@name@@', { name: 'World' })).toBe('@@name@@');
    });
  });
});