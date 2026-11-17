import test from 'node:test';
import assert from 'node:assert/strict';
import { stripComments, balancedHcl, evaluateLesson } from '../app/engine.js';
import { getLesson } from '../app/curriculum.js';
test('HCL comments: quoted http URLs and # fragments are preserved', () => {
  const input = 'resource "terraform_data" "d" {\n input = "https://example.com/#path" // note\n}\n';
  assert.equal(balancedHcl(input), true);
  const cleaned = stripComments(input);
  assert.match(cleaned, /https:\/\/example.com\/#path/);
  assert.doesNotMatch(cleaned, /note/);
});
test('HCL comments: block comments cannot satisfy mandatory exercise patterns', () => {
  const l = getLesson('B01');
  assert.ok(l);
  const input = 'resource "terraform_data" "idea" {\n /* input = "infraestructura como codigo" */\n}\n';
  assert.equal(balancedHcl(input), true);
  assert.equal(evaluateLesson(l, input).ok, false);
  assert.doesNotMatch(stripComments(input), /infraestructura como codigo/);
});
test('HCL lexical: braces and comment tokens inside heredocs are not syntax', () => {
  const text = 'locals {\n sample = <<-EOT\n } } /* # //\n ${not_a_terraform_expression}\n EOT\n}\n';
  assert.equal(balancedHcl(text), true);
  assert.equal(balancedHcl(text.replace(' EOT', ' BAD')), false);
  assert.equal(balancedHcl('/* unterminated\n'), false);
  assert.equal(balancedHcl('resource "x" "y" { /* c */\n'), false);
});
test('HCL lexical: incomplete quoted strings and mismatched braces fail', () => {
  assert.equal(balancedHcl('variable "oops {'), false);
  assert.equal(balancedHcl('locals { key = [1, 2 }'), false);
});
