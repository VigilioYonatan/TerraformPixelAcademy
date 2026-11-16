/** Minimal TypeScript declarations for the bundled MIT Preact ESM runtime. */
export type VNode = unknown;
export function h<P extends object>(type: string | ((props: P)=>VNode), props: P | null, ...children: unknown[]): VNode;
export function render(node: VNode, container: Element): void;
