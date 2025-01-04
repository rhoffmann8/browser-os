import { css } from "@emotion/css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ApplicationComponent } from "../../types/application";

const containerCss = css`
  height: 100%;
  width: 100%;
  padding: 4px;
`;

export const MarkdownViewer: ApplicationComponent = ({
  widget: {
    params: { content },
  },
}) => {
  return (
    <div className={containerCss}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: (props) => <p style={{ margin: 0 }} {...props} />,
          h1: (props) => <h1 style={{ margin: "4px 0" }} {...props} />,
          h2: (props) => <h2 style={{ margin: "4px 0" }} {...props} />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
