import { PortalOutlet } from './portal-outlet'
import { Portal } from './portal'
import { DeferredPromise } from './cdk/deferred-promise'
import { getDocumentLinks, insertLinks } from './cdk/styles-helper'

export class WindowPortalOutlet implements PortalOutlet {

  private attached: DeferredPromise<void> | undefined | null
  private readonly windowFactory: (transferElement: HTMLElement) => Promise<Window>

  constructor(windowFactory?: (transferElement: HTMLElement) => Promise<Window>) {
    this.windowFactory = windowFactory || this.defaultWindowFactory
  }

  async attach(portal: Portal): Promise<void> {
    if (this.hasAttached()) {
      throw new Error('[WindowPortalOutlet] already attached')
    }
    try {
      this.attached = new DeferredPromise<void>()
      const element = await portal.getElement()
      const targetWindow = await this.windowFactory(element)
      const originalParent = element.parentElement
      if (originalParent) {
        const originalPosition = Array.from(originalParent.children).indexOf(element)
        const unloadHandler = () => this.release()
        targetWindow.addEventListener('beforeunload', unloadHandler)
        this.attached.then(() => {
          targetWindow.removeEventListener('beforeunload', unloadHandler)
          this.transferElement(element, originalParent, originalPosition)
        })
      }
      this.transferElement(element, targetWindow.document.body)
    } catch (error) {
      throw new Error(`[WindowPortalOutlet] failed to attach`)
    }
  }

  private transferElement(element: HTMLElement,
                          targetParent: HTMLElement,
                          index = -1): void {
    const targetDocument = targetParent.ownerDocument
    const currentParent = element.parentElement
    if (currentParent) {
      currentParent.removeChild(element)
    }
    if (targetDocument) {
      targetDocument.adoptNode(element)
    }
    if (index === -1) {
      targetParent.appendChild(element)
    } else {
      targetParent.insertBefore(element, targetParent.children[index])
    }
  }

  hasAttached(): boolean {
    return !!this.attached
  }

  async release(): Promise<void> {
    if (this.attached) {
      this.attached.resolve()
      this.attached = null
    }
  }

  private async defaultWindowFactory(transferElement: HTMLElement): Promise<Window> {
    const { width, height, left } = transferElement.getBoundingClientRect()
    const features = `top=${window.screenY}, left=${window.screenY + screenX + left}, width=${width}, height=${height}`
    const win = window.open('about:blank', '_blank', features)
    if (!win) {
      return Promise.reject()
    }
    // TODO(TN) enable synchronization of styles to new window
    // await insertLinks(win.document, getDocumentLinks(transferElement.ownerDocument || window.document))
    return win
  }

}
