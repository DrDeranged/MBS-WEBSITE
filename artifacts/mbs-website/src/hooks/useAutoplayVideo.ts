import { type RefObject, useEffect } from "react";

export function useAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let retryAttached = false;
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");

    if (!enabled) {
      video.pause();
      return;
    }

    const retryPlayback = () => {
      retryAttached = false;
      if (
        document.visibilityState === "visible"
      ) {
        void video.play().catch(() => {
          // Autoplay is blocked; the branded poster remains visible.
        });
      }
    };

    const playWhenAllowed = () => {
      if (
        document.visibilityState !== "visible"
      ) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        if (!retryAttached) {
          retryAttached = true;
          video.addEventListener("canplay", retryPlayback, { once: true });
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        video.pause();
      } else {
        playWhenAllowed();
      }
    };

    playWhenAllowed();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      video.removeEventListener("canplay", retryPlayback);
      video.pause();
    };
  }, [enabled, ref]);
}