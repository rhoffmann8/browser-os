import { css } from "@emotion/css";
import cx from "classnames";
import { Box, BoxCol } from "../../../components/Box";
import {
  type Track,
  useAudioPlayerContext,
} from "../context/AudioPlayerContext";

import {
  faSortAlphaAsc,
  faSortAlphaDesc,
  faTrash,
  faUnsorted,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimateHeight } from "../../../components/Fade";
import { IconButton } from "../../../components/IconButton";
import { List, ListItem } from "../../../components/List";
import { setBackgroundOpacity } from "../../../utils/style";
import { getTrackTitle } from "../utils";

const SORT_COMPARATORS: Record<"asc" | "desc", (a: Track, b: Track) => number> =
  {
    asc: (a, b) =>
      a.author.replace(/\bThe\s+/, "") < b.author.replace(/\bThe\s+/, "")
        ? -1
        : 1,
    desc: (a, b) =>
      a.author.replace(/\bThe\s+/, "") < b.author.replace(/\bThe\s+/, "")
        ? 1
        : -1,
  };

export function TrackList() {
  const {
    trackList,
    showTrackList,
    currentTrack,
    setCurrentTrack,
    setIsPlaying,
    setTrackList,
  } = useAudioPlayerContext();

  const [query, setQuery] = useState("");

  // TODO lift sort and make sorted list a derived state
  const [sort, setSort] = useState<"asc" | "desc">();

  const onClearAll = useCallback(() => {
    setTrackList([]);
    setCurrentTrack(undefined);
  }, [setCurrentTrack, setTrackList]);

  const onListItemClick = useCallback(
    (item: ListItem<Track>, isKeyEvent: boolean) => {
      if (item.value === currentTrack && isKeyEvent) {
        setIsPlaying((prev) => !prev);
      } else {
        setCurrentTrack(item.value);
        setIsPlaying(true);
      }
    },
    [currentTrack, setCurrentTrack, setIsPlaying]
  );

  const listItems = useMemo(
    () =>
      trackList
        .filter((track) => {
          const queryLowerCase = query.toLowerCase();
          return (
            track.title.toLowerCase().includes(queryLowerCase) ||
            track.author.toLowerCase().includes(queryLowerCase)
          );
        })
        .map((track) => ({
          label: <Track key={track.src} track={track} />,
          value: track,
        })),
    [query, trackList]
  );

  return (
    <AnimateHeight show={showTrackList} fillWidth>
      <BoxCol fillWidth gap={4} className={trackListCss}>
        <Box alignItems="center" gap={4}>
          <input
            placeholder="Search"
            className={searchInputCss}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <IconButton
            icon={
              sort === "asc"
                ? faSortAlphaAsc
                : sort === "desc"
                ? faSortAlphaDesc
                : faUnsorted
            }
            iconProps={{ size: "lg" }}
            style={{ padding: "2px 4px", width: 28 }}
            title="Sort by artist"
            onClick={() => {
              const nextSort =
                sort === "asc" ? "desc" : sort === "desc" ? undefined : "asc";
              setSort(nextSort);
              setTrackList((prev) =>
                [...prev].sort(nextSort ? SORT_COMPARATORS[nextSort] : () => 0)
              );
            }}
          />
        </Box>
        <List
          listItemProps={{ style: { padding: 0 } }}
          contextMenuItems={[{ title: "Clear list", onClick: onClearAll }]}
          onItemClick={onListItemClick}
          items={listItems}
        />
      </BoxCol>
    </AnimateHeight>
  );
}

function Track({ track }: { track: Track }) {
  const { currentTrack, trackList, setTrackList, setCurrentTrack } =
    useAudioPlayerContext();

  const displayName = getTrackTitle(track);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTrack === track) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentTrack, track]);

  const onRemove: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      const isDeletedPlaying = track.src === currentTrack?.src;
      const newTrackList = trackList.filter((t) => t.src !== track.src);
      setTrackList(newTrackList);
      setCurrentTrack(
        isDeletedPlaying
          ? newTrackList[newTrackList.length - 1]
          : newTrackList.find((t) => t.src === currentTrack?.src)
      );
    },
    [currentTrack?.src, setCurrentTrack, setTrackList, track.src, trackList]
  );

  return (
    <div
      ref={ref}
      key={track.title}
      style={{ position: "relative" }}
      className={cx(trackCss, "track", { active: currentTrack === track })}
    >
      <span title={displayName}>{displayName}</span>
      <button title="Remove" className="trash" onClick={onRemove}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

const searchInputCss = css`
  color: white;
  background-color: var(--color-theme-secondary);
  border: none;
  border-radius: 0.2rem;
  height: 24px;
  padding-left: 4px;
  flex: 1;

  &:focus {
    outline: var(--color-theme-primary);
  }
`;

const trackCss = css`
  .trash {
    position: absolute;
    right: 0px;
    transform: translateY(-50%);
    top: 50%;
    height: 24px;

    background: var(--color-theme-red);
    transition: background 100ms ease-in-out;

    visibility: hidden;

    &:hover {
      background: rgba(var(--color-theme-red-raw), 0.75);
    }
  }

  &:hover .trash {
    visibility: visible;
  }
`;

const trackListCss = css`
  position: relative;
  border-top: 1px solid #aaa;
  margin-top: 8px;
  padding-top: 8px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    max-height: 300px;
    overflow-y: auto;
  }

  .track {
    padding: 2px 4px;
    margin: 2px 0;
    cursor: pointer;

    background: transparent;
    transition: background 100ms ease-in;

    span {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
    }
  }

  .track.active {
    background: ${setBackgroundOpacity("var(--color-theme-red)", 0.5)};
  }

  .track:hover {
    background: var(--color-theme-hover);
  }
`;
