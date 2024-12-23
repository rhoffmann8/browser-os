import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { CSSProperties } from "react";
import { IconButton } from "../../../../components/IconButton";

interface Props {
  title: string;
  icon: IconDefinition;
  onClick: () => void;
  style?: CSSProperties;
}

export function ControlButton({ icon, ...rest }: Props) {
  return <IconButton icon={icon} {...rest} />;
}
