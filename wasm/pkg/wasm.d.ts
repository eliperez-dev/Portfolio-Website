/* tslint:disable */
/* eslint-disable */

export class Cpu {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  tick(): void;
  reset(): void;
  get_pc(): number;
  get_reg_a(): number;
  get_reg_b(): number;
  get_reg_c(): number;
  get_reg_d(): number;
}

export function add(a: number, b: number): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_cpu_free: (a: number, b: number) => void;
  readonly add: (a: number, b: number) => number;
  readonly cpu_get_pc: (a: number) => number;
  readonly cpu_get_reg_a: (a: number) => number;
  readonly cpu_get_reg_b: (a: number) => number;
  readonly cpu_get_reg_c: (a: number) => number;
  readonly cpu_get_reg_d: (a: number) => number;
  readonly cpu_new: () => number;
  readonly cpu_reset: (a: number) => void;
  readonly cpu_tick: (a: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
