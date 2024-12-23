import { useMemo, useRef, useState } from "react";
import { Document, Outline, Page, pdfjs } from "react-pdf";
import {
  ApplicationComponent,
  PDFViewerApplication,
} from "../../types/application";

import { css } from "@emotion/css";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageCallback } from "react-pdf/dist/esm/shared/types.js";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Box } from "../../components/Box";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PDFViewer: ApplicationComponent<PDFViewerApplication> = ({
  params: { src },
  widget,
}) => {
  const [, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const initializedRef = useRef(false);
  function onPageLoadSuccess({ height, width }: PageCallback) {
    if (!initializedRef.current) {
      initializedRef.current = true;
      widget.resize({ height, width });
    }
  }

  const loadingEl = useMemo(
    () => (
      <Box flex={1} minWidth={400} alignItems="center" justifyContent="center">
        Loading PDF...
      </Box>
    ),
    []
  );

  return (
    <div className={containerCss}>
      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={loadingEl}
      >
        <Outline />
        <Page
          pageNumber={pageNumber}
          onLoadSuccess={onPageLoadSuccess}
          height={widget.dimensions?.height}
        />
      </Document>
      <button
        title="Download"
        className={downloadButtonCss}
        onClick={() => window.open(src)}
      >
        <FontAwesomeIcon
          size="xl"
          title="Download"
          icon={faDownload}
          color="white"
        />
      </button>
    </div>
  );
};

const containerCss = css`
  position: relative;

  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  background: #aaa;

  overflow: hidden;
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
`;
