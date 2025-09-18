declare module 'masonry-layout' {
  export default class Masonry {
    constructor(
      element: Element | string,
      options?: {
        itemSelector?: string;
        columnWidth?: string | Element;
        percentPosition?: boolean;
      }
    );
    layout(): void;
    destroy(): void;
  }
}

declare module 'imagesloaded' {
  interface ImagesLoaded {
    on(event: 'progress', callback: () => void): this;
  }

  function imagesLoaded(
    elem: Element | string,
    options?: unknown,
    onAlwaysCallback?: () => void
  ): ImagesLoaded;

  export default imagesLoaded;
}
