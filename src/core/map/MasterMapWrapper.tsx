"use client";

import { useState, useEffect } from "react";
import { TacticalMapWorkspace } from "./TacticalMapWorkspace";

interface MasterMapWrapperProps {
  campaignId: string;
}

export function MasterMapWrapper({ campaignId }: MasterMapWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }
    window.addEventListener("open-tactical-map", handleOpen);
    return () => window.removeEventListener("open-tactical-map", handleOpen);
  }, []);

  return (
    <TacticalMapWorkspace
      campaignId={campaignId}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
