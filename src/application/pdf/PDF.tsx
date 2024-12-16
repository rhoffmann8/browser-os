import { useState } from "react";
import { Document, Outline, Page, pdfjs } from "react-pdf";
import { ApplicationComponent } from "../../types/application";

import { css } from "@emotion/css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const containerCss = css`
  flex: 1;
  display: flex;
  justify-content: center;

  background: #aaa;
`;

export const PDF: ApplicationComponent<"pdf"> = ({
  params: { src },
  widget: window,
}) => {
  const [, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className={containerCss}>
      <Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
        <Outline />
        <Page pageNumber={pageNumber} height={window.dimensions.height} />
      </Document>
    </div>
  );
};
