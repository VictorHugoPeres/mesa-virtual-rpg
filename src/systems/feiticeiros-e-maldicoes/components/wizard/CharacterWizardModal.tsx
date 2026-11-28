"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowLeft, ArrowRight, Wand2, AlertCircle } from "lucide-react";
import { Portal } from "@/core/ui";
import { WizardProgressBar } from "./WizardProgressBar";
import { StepOrigin } from "./StepOrigin";
import { StepSpecialization } from "./StepSpecialization";
import { StepAttributes } from "./StepAttributes";
import { StepSkills } from "./StepSkills";
import { StepTechnique } from "./StepTechnique";
import { StepEquipment } from "./StepEquipment";
import { StepReview } from "./StepReview";
import { buildCharacterSheet } from "./wizardPayloadBuilder";
import { INITIAL_WIZARD_STATE, canAdvanceStep } from "./wizardValidation";

interface CharacterWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  redirectPrefix?: string;
}

export function CharacterWizardModal({
  isOpen,
  onClose,
  campaignId,
  redirectPrefix,
}: CharacterWizardModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState(INITIAL_WIZARD_STATE);

  const handleSetAttributeBonuses = useCallback((bonuses: Partial<Record<string, number>>) => {
    setState((prev) => ({ ...prev, attributeBonuses: bonuses as any }));
  }, []);

  if (!isOpen) return null;

  const isCurrentStepValid = canAdvanceStep(currentStep, state);

  async function handleFinalSubmit() {
    if (!state.name.trim()) {
      setError("Por favor, informe o nome do personagem.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const sheet = buildCharacterSheet(state);

      const res = await fetch(`/api/campaigns/${campaignId}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          type: state.type,
          specialization: state.specialization,
          origin: state.origin,
          data: sheet,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar personagem.");
      }

      const { character } = await res.json();
      onClose();
      router.refresh();
      const targetUrl = redirectPrefix
        ? `${redirectPrefix}/${character.id}`
        : `/mestre/${campaignId}/fichas/${character.id}`;
      router.push(targetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao criar personagem.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl h-[90vh] max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl flex flex-col min-h-0 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23272F] bg-[#0B0C0E] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Criador Guiado de Personagem</h2>
              <p className="text-xs text-zinc-400">Sistema Oficial Feiticeiros & Maldições (F&M v2.0)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <WizardProgressBar
          currentStep={currentStep}
          totalSteps={7}
          onStepClick={(step) => {
            if (step < currentStep || isCurrentStepValid) setCurrentStep(step);
          }}
        />

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y px-4 sm:px-6 py-4 pb-8">
          {currentStep === 1 && (
            <StepOrigin
              selectedOrigin={state.origin}
              onSelectOrigin={(orig) => {
                setState((prev) => {
                  const next = { ...prev, origin: orig };
                  if (orig === "Restringido") {
                    next.specialization = "Restringido";
                  } else if (prev.specialization === "Restringido") {
                    next.specialization = "Lutador";
                  }
                  if (orig === "Sem Técnica" && prev.specialization === "Especialista em Técnica") {
                    next.specialization = "Lutador";
                  }
                  return next;
                });
              }}
              selectedClan={state.clan}
              onSelectClan={(clan) => setState((prev) => ({ ...prev, clan }))}
              selectedAnatomy={state.anatomyTrait}
              onSelectAnatomy={(trait) => setState((prev) => ({ ...prev, anatomyTrait: trait }))}
            />
          )}

          {currentStep === 2 && (
            <StepSpecialization
              origin={state.origin}
              selectedSpec={state.specialization}
              onSelectSpec={(spec) => setState((prev) => ({ ...prev, specialization: spec }))}
              selectedKeyAttribute={state.keyAttribute}
              onSelectKeyAttribute={(attr) => setState((prev) => ({ ...prev, keyAttribute: attr }))}
              selectedLevel1Choice={state.level1Choice}
              onSelectLevel1Choice={(choice) => setState((prev) => ({ ...prev, level1Choice: choice }))}
            />
          )}

          {currentStep === 3 && (
            <StepAttributes
              origin={state.origin}
              clan={state.clan}
              specialization={state.specialization}
              method={state.attributeMethod}
              setMethod={(m) => setState((prev) => ({ ...prev, attributeMethod: m }))}
              baseAttributes={state.baseAttributes}
              setBaseAttributes={(attrs) => setState((prev) => ({ ...prev, baseAttributes: attrs }))}
              bonusPlus2={state.bonusPlus2}
              setBonusPlus2={(attr) => setState((prev) => ({ ...prev, bonusPlus2: attr }))}
              bonusPlus1={state.bonusPlus1}
              setBonusPlus1={(attr) => setState((prev) => ({ ...prev, bonusPlus1: attr }))}
              attributeBonuses={state.attributeBonuses}
              setAttributeBonuses={handleSetAttributeBonuses}
            />
          )}

          {currentStep === 4 && (
            <StepSkills
              specialization={state.specialization}
              origin={state.origin}
              clan={state.clan}
              attributes={state.baseAttributes}
              chosenTR={state.chosenSavingThrow}
              setChosenTR={(tr) => setState((prev) => ({ ...prev, chosenSavingThrow: tr }))}
              skillBonusAttribute={state.skillBonusAttribute || "INT"}
              setSkillBonusAttribute={(attr) => setState((prev) => ({ ...prev, skillBonusAttribute: attr }))}
              trainedSkills={state.trainedSkills}
              setTrainedSkills={(skills) => setState((prev) => ({ ...prev, trainedSkills: skills }))}
              expertSkills={state.expertSkills}
              setExpertSkills={(skills) => setState((prev) => ({ ...prev, expertSkills: skills }))}
              craftSkills={state.craftSkills}
              setCraftSkills={(crafts) => setState((prev) => ({ ...prev, craftSkills: crafts }))}
            />
          )}

          {currentStep === 5 && (
            <StepTechnique
              origin={state.origin}
              specialization={state.specialization}
              techniqueName={state.techniqueName}
              setTechniqueName={(tName) => setState((prev) => ({ ...prev, techniqueName: tName }))}
              techniqueDesc={state.techniqueDesc}
              setTechniqueDesc={(tDesc) => setState((prev) => ({ ...prev, techniqueDesc: tDesc }))}
              techniqueAttribute={state.techniqueAttribute}
              setTechniqueAttribute={(tAttr) => setState((prev) => ({ ...prev, techniqueAttribute: tAttr }))}
              spells={state.spells}
              setSpells={(sp) => setState((prev) => ({ ...prev, spells: sp }))}
              level1FeatId={state.level1FeatId}
              onSelectLevel1Feat={(id, name, type, desc) =>
                setState((prev) => ({
                  ...prev,
                  level1FeatId: id,
                  level1FeatName: name,
                  level1FeatType: type,
                  level1FeatDesc: desc,
                }))
              }
            />
          )}

          {currentStep === 6 && (
            <StepEquipment
              specialization={state.specialization}
              attributes={state.baseAttributes}
              selectedWeapons={state.selectedWeapons}
              setSelectedWeapons={(wpns) => setState((prev) => ({ ...prev, selectedWeapons: wpns }))}
              selectedUniform={state.selectedUniform}
              setSelectedUniform={(u) => setState((prev) => ({ ...prev, selectedUniform: u }))}
              selectedShield={state.selectedShield}
              setSelectedShield={(s) => setState((prev) => ({ ...prev, selectedShield: s }))}
              selectedToolKit={state.selectedToolKit}
              setSelectedToolKit={(kit) => setState((prev) => ({ ...prev, selectedToolKit: kit }))}
              selectedGear={state.selectedGear}
              setSelectedGear={(g) => setState((prev) => ({ ...prev, selectedGear: g }))}
            />
          )}

          {currentStep === 7 && (
            <StepReview
              state={state}
              setState={setState}
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#23272F] bg-[#0B0C0E] shrink-0">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) onClose();
              else setCurrentStep((prev) => prev - 1);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white hover:bg-[#1A1D24] transition-colors cursor-pointer"
          >
            {currentStep === 1 ? "Cancelar" : <><ArrowLeft className="w-3.5 h-3.5" /> Anterior</>}
          </button>

          {currentStep < 7 && (
            <div className="flex items-center gap-3">
              {!isCurrentStepValid && currentStep === 3 && (
                <span className="text-amber-400 text-xs flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Aloque todos os 6 atributos para avançar
                </span>
              )}
              <button
                type="button"
                disabled={!isCurrentStepValid}
                onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm shadow-rose-950/30 transition-all cursor-pointer active:scale-95"
              >
                Próximo Passo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
