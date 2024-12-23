import { faVolumeOff, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";
import { Box } from "../../../../components/Box";
import { useId } from "react";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";

export function Volume() {
  const { volume, setVolume } = useAudioPlayerContext();
  const tooltipId = useId();

  return (
    <Box fillWidth gap={4} padding="8px 0 0 0" alignItems="center">
      <FontAwesomeIcon icon={faVolumeOff} />
      <Tooltip id={tooltipId} opacity={1} />
      <a
        data-tooltip-id={tooltipId}
        data-tooltip-content={`Volume ${volume}%`}
        data-tooltip-place="top"
        style={{ display: "flex", alignItems: "center", flex: 1 }}
      >
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.currentTarget.value))}
        />
      </a>
      <FontAwesomeIcon icon={faVolumeUp} />
    </Box>
  );
}
