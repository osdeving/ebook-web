declare module "katex/contrib/auto-render" {
  interface AutoRenderDelimiter {
    left: string;
    right: string;
    display: boolean;
  }

  interface AutoRenderOptions {
    delimiters?: AutoRenderDelimiter[];
    throwOnError?: boolean;
    strict?: boolean | string | ((errorCode: string, errorMsg: string, token?: unknown) => boolean | string);
    trust?: boolean | ((context: unknown) => boolean);
    ignoredTags?: string[];
    ignoredClasses?: string[];
  }

  const renderMathInElement: (element: HTMLElement, options?: AutoRenderOptions) => void;
  export default renderMathInElement;
}
