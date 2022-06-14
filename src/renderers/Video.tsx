import * as React from "react";
import Spinner from "../components/Spinner";
import { Renderer, Tester } from "./../interfaces";
import WithHeader from "./wrappers/withHeader";
import WithSeeMore from "./wrappers/withSeeMore";

export const renderer: Renderer = ({
  story,
  action,
  isPaused,
  config,
  messageHandler,
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const { width, height, loader, storyStyles, isMuted } = config;

  let computedStyles = {
    ...styles.storyContent,
    ...(storyStyles || {}),
  };

  let vid = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (vid.current) {
      if (isPaused) {
        vid.current.pause();
      } else {
        vid.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  const onWaiting = () => {
    action("pause", true);
  };

  const onPlaying = () => {
    action("play", true);
  };

  const videoLoaded = () => {
    messageHandler("UPDATE_VIDEO_DURATION", { duration: vid.current.duration });
    setLoaded(true);
    vid.current
      .play()
      .then(() => {
        action("play");
      })
      .catch((e) => {
        vid.current.play().finally(() => {
          action("play");
        });
      });
  };

  return (
    <WithHeader story={story} globalHeader={config.header}>
      <WithSeeMore story={story} action={action}>
        <div style={styles.videoContainer}>
          <video
            ref={vid}
            style={computedStyles}
            controls={false}
            onLoadedData={videoLoaded}
            playsInline
            onWaiting={onWaiting}
            onPlaying={onPlaying}
            muted={isMuted}
            autoPlay
            webkit-playsinline="true"
            src={story.url}
          />
          {!loaded && (
            <div
              style={{
                width: width,
                height: height,
                position: "absolute",
                left: 0,
                top: 0,
                background: "rgba(0, 0, 0, 0.9)",
                zIndex: 9,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ccc",
              }}
            >
              {loader || <Spinner />}
            </div>
          )}
        </div>
      </WithSeeMore>
    </WithHeader>
  );
};

const styles = {
  storyContent: {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    margin: "0",
  },
  videoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
};

export const tester: Tester = (story) => {
  return {
    condition: story.type === "video",
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
