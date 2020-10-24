export function getDocumentLinks(target: Document): HTMLLinkElement[] {
  const links = target.getElementsByTagName('link')
  return [].slice.call(links)
}

export function insertLink(target: Document, link: HTMLLinkElement): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const linkElement: HTMLLinkElement = target.createElement('link')
      linkElement.rel = link.rel
      linkElement.href = link.href
      linkElement.as = link.as
      linkElement.addEventListener('load', () => resolve(), { once: true })
      target.head.appendChild(linkElement)
    } catch (e) {
      reject(`unexpected error inserting style elements, error=${e.message}`)
    }
  })
}

export async function insertLinks(target: Document,
                                  links: HTMLLinkElement[]): Promise<void> {
  await Promise.all(links.map(link => insertLink(target, link)))
}
