declare module "katex/contrib/auto-render" {
  interface Delimiter {
    left: string;
    right: string;
    display: boolean;
  }

  interface AutoRenderOptions {
    delimiters?: Delimiter[];
    ignoredTags?: string[];
    ignoredClasses?: string[];
    throwOnError?: boolean;
    strict?: boolean | string;
    trust?: boolean;
  }

  export default function renderMathInElement(
    element: HTMLElement,
    options?: AutoRenderOptions,
  ): void;
}
