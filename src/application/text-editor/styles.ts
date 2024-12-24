import { css } from "@emotion/css";

export const editorCss = css`
  height: 100%;
  width: 100%;

  outline: none;

  font-size: 1rem;
  line-height: 1.2;

  border: none;
  resize: none;

  background: transparent;
  color: black;

  flex: 1;
`;

export const saveIconCss = css`
  -webkit-filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.5));
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.5));

  path {
    fill: #1265ff;
  }
`;
export const openIconCss = css`
  -webkit-filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.5));
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.5));

  path {
    fill: #e6c928;
  }
`;

export const toolbarCss = css`
  background: linear-gradient(#ccc, #aaa);
  border-bottom: 1px solid #aaa;
  box-shadow: 0px 2px 2px 0px #ddd;

  > button,
  > div > button {
    border-right: 1px solid #888;
    position: relative;
    padding: 4px 8px;
    background: linear-gradient(#ccc, #aaa);

    &:hover {
      background: linear-gradient(#aaa, #ccc);
    }
  }
`;

export const buttonMenuCss = css`
  position: absolute;
  left: 2px;
  top: 24px;
  z-index: 1;

  border: 1px solid #888;
  background: #eee;
  box-shadow: 0px 1px 4px 0px #aaa;
  color: black;

  min-width: 100px;
`;

export const saveMenuCss = css`
  ${buttonMenuCss};

  list-style: none;
  padding: 0;

  white-space: nowrap;
  text-align: left;

  li {
    padding: 4px 4px 4px 12px;
    text-align: left;
    cursor: pointer;
  }

  li:hover {
    background: #ccc;
  }
`;

export const saveInputContainerCss = css`
  ${buttonMenuCss}
  top: 24px;
  z-index: 1;

  padding: 4px;
  gap: 2px;

  button {
    border: 1px solid #aaa;
    background: transparent;

    &:hover {
      background: #aaa;
    }
  }

  input {
    background: #fff;
    color: black;
    border: 1px solid var(--color-theme-primary);
    border-radius: 0;
    outline: none;
  }
`;

export const openFileMenuCss = css`
  ${buttonMenuCss}

  z-index: 1;
  list-style: none;
  padding: 0;
  text-align: left;

  max-height: 150px;
  overflow-y: auto;
  overflow-x: hidden;

  li {
    cursor: pointer;
  }

  li:hover {
    background: #ccc;
  }
`;

export const deleteButtonCss = css`
  background: transparent;

  &:hover {
    background: var(--color-theme-red);
    path {
      fill: white;
    }
  }
`;
