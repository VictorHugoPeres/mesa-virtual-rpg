"use client";

import { useEffect } from "react";
import { AudioProvider, useAudio } from "./AudioContext";
import { AudioPlayerBar } from "./AudioPlayerBar";
import { AudioDeskDrawer } from "./AudioDeskDrawer";

function MasterAudioContent({ campaignId }: { campaignId: string }) {
  const { openDrawer } = useAudio();

  useEffect(() => {
    function handleOpen() {
      openDrawer();
    }
    window.addEventListener("open-audio-desk", handleOpen);
    return () => window.removeEventListener("open-audio-desk", handleOpen);
  }, [openDrawer]);

  return (
    <>
      <AudioPlayerBar />
      <AudioDeskDrawer campaignId={campaignId} />
    </>
  );
}

export function MasterAudioSection({ campaignId }: { campaignId: string }) {
  return (
    <AudioProvider campaignId={campaignId}>
      <MasterAudioContent campaignId={campaignId} />
    </AudioProvider>
  );
}
