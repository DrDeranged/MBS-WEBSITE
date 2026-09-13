import { type RefObject, useEffect } from "react";

export function useAutoplayVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let retryAttached = false;

    const retryPlayback = () => {
      retryAttached = false;
      if (
        document.visibilityState === "visible" &&
        !motionQuery.matches
      ) {
        void video.play().catch(() => {
          // Autoplay is blocked; the branded poster remains visible.
        });
      }
    };

    const playWhenAllowed = () => {
      video.muted = true;
      if (
        document.visibilityState !== "visible" ||
        motionQuery.matches
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

    const handleMotionChange = () => playWhenAllowed();

    playWhenAllowed();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      motionQuery.removeEventListener("change", handleMotionChange);
      video.removeEventListener("canplay", retryPlayback);
      video.pause();
    };
  }, [ref]);
}