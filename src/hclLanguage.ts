/**
 * Stateful HCL / Terraform StreamParser for CodeMirror 6.
 * Supports `#` and `//` line comments, multi-line `/* ... * /` block comments,
 * heredocs (`<<EOF` / `<<-EOF`), double-quoted strings with `${...}` interpolations,
 * Terraform 1.6-1.10+ blocks (`moved`, `removed`, `import`, `check`, `run`, `mock_provider`),
 * primitive/collection types, built-in functions, and reference namespaces.
 * Educational syntax highlighter only — NOT the official HashiCorp HCL compiler.
 */
import type { StreamParser, StringStream } from './vendor/codemirror6.mjs';

export interface HclTokenizerState {
  inBlockComment: boolean;
  inString: boolean;
  interpBraceDepth: number;
  heredocMarker: string | null;
}

const HCL_KEYWORDS = new Set([
  'terraform',
  'resource',
  'data',
  'variable',
  'output',
  'locals',
  'module',
  'provider',
  'moved',
  'removed',
  'import',
  'check',
  'run',
  'assert',
  'mock_provider',
  'override_resource',
  'override_data',
  'override_module',
  'lifecycle',
  'precondition',
  'postcondition',
  'dynamic',
  'content',
  'provisioner',
  'connection',
  'backend',
  'cloud',
  'required_providers',
  'required_version',
  'for',
  'in',
  'if',
  'endif',
  'endfor',
  'for_each',
  'count',
  'depends_on',
  'source',
  'version',
  'from',
  'to',
  'id',
  'command',
  'condition',
  'error_message',
  'sensitive',
  'ephemeral',
  'nullable',
  'validation',
  'create_before_destroy',
  'prevent_destroy',
  'ignore_changes',
  'replace_triggered_by',
  'triggers_replace'
]);

const HCL_TYPES = new Set(['string', 'number', 'bool', 'list', 'map', 'set', 'object', 'tuple', 'any', 'optional']);

const HCL_ATOMS = new Set(['true', 'false', 'null', 'plan', 'apply']);

const HCL_NAMESPACES = new Set(['var', 'local', 'module', 'each', 'self', 'path', 'terraform_data']);

const HCL_BUILTINS = new Set([
  'abs',
  'can',
  'ceil',
  'chomp',
  'cidrhost',
  'cidrnetmask',
  'cidrsubnet',
  'cidrsubnets',
  'coalesce',
  'coalescelist',
  'compact',
  'concat',
  'contains',
  'distinct',
  'element',
  'endswith',
  'file',
  'fileexists',
  'fileset',
  'flatten',
  'floor',
  'format',
  'formatlist',
  'index',
  'join',
  'jsondecode',
  'jsonencode',
  'keys',
  'length',
  'lookup',
  'lower',
  'matchkeys',
  'max',
  'md5',
  'merge',
  'min',
  'nonsensitive',
  'one',
  'parseint',
  'regex',
  'regexall',
  'replace',
  'reverse',
  ' sensitive',
  'setintersection',
  'setproduct',
  'setsubtract',
  'setunion',
  'sha1',
  'sha256',
  'sha512',
  'slice',
  'sort',
  'split',
  'startswith',
  'strcontains',
  'substr',
  'sum',
  'templatefile',
  'tobool',
  'tolist',
  'tomap',
  'tonumber',
  'toset',
  'tostring',
  'trim',
  'trimprefix',
  'trimsuffix',
  'trimspace',
  'try',
  'upper',
  'uuid',
  'values',
  'yamldecode',
  'yamlencode',
  'zipmap'
]);

function readBlockComment(stream: StringStream, state: HclTokenizerState): string {
  while (!stream.eol()) {
    if (stream.match('*/')) {
      state.inBlockComment = false;
      return 'comment';
    }
    stream.next();
  }
  return 'comment';
}

function readDoubleQuotedString(stream: StringStream, state: HclTokenizerState): string {
  while (!stream.eol()) {
    if (stream.match('${')) {
      state.inString = false;
      state.interpBraceDepth = 1;
      return 'string';
    }
    const ch = stream.next();
    if (ch === '\\') {
      stream.next();
      continue;
    }
    if (ch === '"') {
      state.inString = false;
      return 'string';
    }
  }
  return 'string';
}

export const hclStreamParser: StreamParser<HclTokenizerState> = {
  name: 'hcl',
  startState(): HclTokenizerState {
    return {
      inBlockComment: false,
      inString: false,
      interpBraceDepth: 0,
      heredocMarker: null
    };
  },
  copyState(state: HclTokenizerState): HclTokenizerState {
    return {
      inBlockComment: state.inBlockComment,
      inString: state.inString,
      interpBraceDepth: state.interpBraceDepth,
      heredocMarker: state.heredocMarker
    };
  },
  token(stream: StringStream, state: HclTokenizerState): string | null {
    // Inside a multi-line heredoc body until standalone closing marker
    if (state.heredocMarker !== null) {
      if (stream.sol()) {
        const trimmed = stream.string.trim();
        if (trimmed === state.heredocMarker) {
          stream.skipToEnd();
          state.heredocMarker = null;
          return 'string';
        }
      }
      stream.skipToEnd();
      return 'string';
    }

    if (state.inBlockComment) {
      return readBlockComment(stream, state);
    }

    if (state.inString) {
      return readDoubleQuotedString(stream, state);
    }

    if (stream.eatSpace()) {
      return null;
    }

    // Track closing brace of string interpolation `${ ... }`
    if (state.interpBraceDepth > 0) {
      const peeked = stream.peek();
      if (peeked === '{') {
        stream.next();
        state.interpBraceDepth++;
        return 'punctuation';
      }
      if (peeked === '}') {
        stream.next();
        state.interpBraceDepth--;
        if (state.interpBraceDepth === 0) {
          state.inString = true;
        }
        return 'punctuation';
      }
    }

    // Comments: `#`, `//`, `/* ... */`
    if (stream.match('#') || stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }
    if (stream.match('/*')) {
      state.inBlockComment = true;
      return readBlockComment(stream, state);
    }

    // Heredoc start: `<<EOF` or `<<-EOF`
    const heredocMatch = stream.match(/^<<-?([A-Za-z_][A-Za-z0-9_]*)/);
    if (Array.isArray(heredocMatch) && typeof heredocMatch[1] === 'string') {
      state.heredocMarker = heredocMatch[1];
      return 'string';
    }

    // Double-quoted strings
    if (stream.eat('"')) {
      state.inString = true;
      return readDoubleQuotedString(stream, state);
    }

    // Numbers
    if (stream.match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/)) {
      return 'number';
    }

    // Operators and punctuation
    if (stream.match(/^(?:==|!=|<=|>=|&&|\|\||=>|\.\.\.)/)) {
      return 'operator';
    }
    if (stream.eat(/[=+\-*/%<>!?]/)) {
      return 'operator';
    }
    if (stream.eat(/[{}[\](),.:]/)) {
      return 'punctuation';
    }

    // Identifiers, keywords, types, namespaces, attributes
    if (stream.match(/^[A-Za-z_][A-Za-z0-9_-]*/)) {
      const word = stream.current();
      const rest = stream.string.slice(stream.pos);
      if (/^\s*=(?!=)/.test(rest)) {
        return HCL_KEYWORDS.has(word) ? 'keyword' : 'property';
      }
      if (HCL_ATOMS.has(word)) return 'atom';
      if (HCL_TYPES.has(word)) return 'type';
      if (HCL_KEYWORDS.has(word)) return 'keyword';
      if (/^\s*\(/.test(rest) && HCL_BUILTINS.has(word)) return 'builtin';
      if (HCL_NAMESPACES.has(word) && rest.startsWith('.')) return 'type';
      return 'variable';
    }

    stream.next();
    return null;
  },
  languageData: {
    commentTokens: { line: '#', block: { open: '/*', close: '*/' } },
    closeBrackets: { brackets: ['(', '[', '{', '"'] }
  }
};

/**
 * Pure Node-compatible tokenizer helper for unit/BDD verification of HCL rules
 * without requiring a browser DOM.
 */
export function tokenizeHclSource(source: string): Array<{ token: string | null; text: string; line: number }> {
  const state = hclStreamParser.startState
    ? hclStreamParser.startState(2)
    : {
        inBlockComment: false,
        inString: false,
        interpBraceDepth: 0,
        heredocMarker: null
      };
  const tokens: Array<{ token: string | null; text: string; line: number }> = [];
  const lines = source.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineText = lines[lineIndex];
    let pos = 0;
    let tokenStart = 0;

    const stream: StringStream = {
      pos: 0,
      string: lineText,
      eol: () => pos >= lineText.length,
      sol: () => pos === 0,
      peek: () => (pos < lineText.length ? lineText[pos] : undefined),
      next: () => (pos < lineText.length ? lineText[pos++] : undefined),
      eat(match) {
        const ch = lineText[pos];
        if (ch === undefined) return undefined;
        const ok = typeof match === 'string' ? ch === match : match instanceof RegExp ? match.test(ch) : match(ch);
        if (ok) {
          pos++;
          stream.pos = pos;
          return ch;
        }
        return undefined;
      },
      eatWhile(match) {
        const start = pos;
        while (pos < lineText.length) {
          const ch = lineText[pos];
          const ok = typeof match === 'string' ? ch === match : match instanceof RegExp ? match.test(ch) : match(ch);
          if (!ok) break;
          pos++;
        }
        stream.pos = pos;
        return pos > start;
      },
      eatSpace() {
        return stream.eatWhile(/\s/);
      },
      skipToEnd() {
        pos = lineText.length;
        stream.pos = pos;
      },
      skipTo(ch: string) {
        const idx = lineText.indexOf(ch, pos);
        if (idx >= 0) {
          pos = idx;
          stream.pos = pos;
          return true;
        }
        return undefined;
      },
      match(pattern, consume = true, caseFold = false) {
        if (typeof pattern === 'string') {
          const slice = lineText.slice(pos, pos + pattern.length);
          const hit = caseFold ? slice.toLowerCase() === pattern.toLowerCase() : slice === pattern;
          if (!hit) return false;
          if (consume !== false) {
            pos += pattern.length;
            stream.pos = pos;
          }
          return true;
        }
        const rest = lineText.slice(pos);
        const m = rest.match(pattern);
        if (m?.index !== 0) return null;
        if (consume !== false) {
          pos += m[0].length;
          stream.pos = pos;
        }
        return m;
      },
      current: () => lineText.slice(tokenStart, pos)
    };

    while (!stream.eol()) {
      tokenStart = pos;
      stream.pos = pos;
      const tok = hclStreamParser.token(stream, state);
      if (pos === tokenStart) {
        pos++;
        stream.pos = pos;
      }
      tokens.push({ token: tok, text: lineText.slice(tokenStart, pos), line: lineIndex + 1 });
    }
  }

  return tokens;
}
