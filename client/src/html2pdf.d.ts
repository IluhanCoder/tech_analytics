declare module 'html2pdf.js' {
  const html2pdf: {
    (): {
      from: (element: HTMLElement) => {
        set: (options: object) => {
          outputPdf: (callback: (pdf: Uint8Array) => void) => void;
        };
      };
    };
  };
  export default html2pdf;
}

declare module "moment"


