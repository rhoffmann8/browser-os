import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BoxCol } from "./components/Box";
import { css } from "@emotion/css";

const mobileCss = css`
  width: 100vw;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;

  text-align: center;
  font-size: 20px;
  text-shadow: 0px 1px 2px black;

  a:not(:first-child) {
    margin: 0 0 0 8px;
  }
`;

export function Mobile() {
  return (
    <BoxCol className={mobileCss}>
      <span>This site is best viewed through a desktop browser.</span>
      <span>
        In the meantime, here is a{" "}
        <a target="_blank" href="/Hoffmann_Resume.pdf">
          link
        </a>{" "}
        to my resume. You can also find me
        <a href="mailto:contact@robhoffmann.me">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        ,
        <a target="blank" href="https://linkedin.com/in/rhoffmann8">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        , and
        <a target="blank" href="https://github.com/rhoffmann8">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        .
      </span>
    </BoxCol>
  );
}
