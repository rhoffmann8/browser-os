import { useState } from "react";
import { Document, Outline, Page, pdfjs } from "react-pdf";
import { ApplicationComponent } from "../../types/application";

import { css } from "@emotion/css";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const containerCss = css`
  position: relative;

  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: #aaa;
`;

const downloadButtonCss = css`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;

  background: var(--color-theme-primary);
  opacity: 0.5;
  transition: opacity 50ms ease-in-out;

  padding: 8px;
  border: none;

  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  path {
    fill: white;
  }
`;

export const PDF: ApplicationComponent<"pdf"> = ({
  params: { src },
  widget,
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
        <Page pageNumber={pageNumber} height={widget.dimensions?.height} />
      </Document>
      <button
        className={downloadButtonCss}
        title="Download"
        onClick={() => window.open(src)}
      >
        <FontAwesomeIcon size="xl" title="Download" icon={faDownload} />
      </button>
    </div>
  );
};
