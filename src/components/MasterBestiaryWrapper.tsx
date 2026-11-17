"use client";

import { useState, useEffect } from "react";
import { BestiaryDrawer } from "@/systems/feiticeiros-e-maldicoes/components/bestiary/BestiaryDrawer";
import { useRouter } from "next/navigation";

interface CharacterSummary {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface MasterBestiaryWrapperProps {
  campaignId: string;
  characters: CharacterSummary[];
}

export function MasterBestiaryWrapper({
  campaignId,
  characters,
}: MasterBestiaryWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }
    window.addEventListener("open-bestiary", handleOpen);
    return () => window.removeEventListener("open-bestiary", handleOpen);
  }, []);

  return (
    <BestiaryDrawer
      campaignId={campaignId}
      characters={characters}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onReloadCampaign={() => router.refresh()}
    />
  );
}
