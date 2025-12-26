/* tslint:disable */
/* eslint-disable */

export class Emulator {
  free(): void;
  [Symbol.dispose](): void;
  get_errors(): string[];
  get_warnings(): string[];
  load_program(code: string): void;
  resolve_input(val: number): void;
  constructor(code: string);
  clock(): void;
  get_state(): any;
}

export function init_panic_hook(): void;
