import { Box } from "../../../components/Box";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";

export function ProgressBar() {
  const { audioRef, progressBarRef, currentTime, setCurrentTime, duration } =
    useAudioPlayerContext();

  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      // if progress bar changes while audio is on pause
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(newTime / duration) * 100}%`
      );
    }
  };

  const currentTimeDisplay = formatTime(currentTime);
  const durationDisplay = formatTime(duration);

  return (
    <Box alignItems="center" gap={8} style={{ minWidth: "100%" }}>
      {currentTimeDisplay}
      <Box flex={1} style={{ position: "relative" }}>
        <input
          ref={progressBarRef}
          type="range"
          onChange={handleProgressChange}
          value={currentTime.toString()}
          style={{ flex: 1, cursor: "pointer" }}
        />
      </Box>
      {durationDisplay}
    </Box>
  );
}

function formatTime(time: number) {
  return `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(time % 60)
    .toString()
    .padStart(2, "0")}`;
}
