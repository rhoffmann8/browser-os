import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  title: string;
  icon: IconDefinition;
  onClick: () => void;
}

export function ControlButton({ icon, onClick, title }: Props) {
  return (
    <button title={title} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
