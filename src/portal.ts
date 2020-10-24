export interface Portal {
  open(): Promise<void>;

  close(): Promise<void>;

  getElement(): Promise<HTMLElement>;
}
