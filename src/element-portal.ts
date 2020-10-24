import { Portal } from './portal'
import { PortalOutlet } from './portal-outlet'

export class ElementPortal implements Portal {

  constructor(
    private readonly element: HTMLElement,
    private readonly outlet: PortalOutlet) {
  }

  async open(): Promise<void> {
    await this.outlet.attach(this)
  }

  async close(): Promise<void> {
    await this.outlet.release()
  }

  async getElement(): Promise<HTMLElement> {
    return Promise.resolve(this.element)
  }
}
