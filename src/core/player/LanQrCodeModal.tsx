"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone, Copy, Check, Wifi, ExternalLink } from "lucide-react";

interface LanQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export function LanQrCodeModal({
  isOpen,
  onClose,
  campaignId,
}: LanQrCodeModalProps) {
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<number>(3000);
  const [allIps, setAllIps] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/network-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) setIp(data.ip);
        if (window.location.port) {
          setPort(Number(window.location.port));
        } else if (data.port) {
          setPort(data.port);
        }
        if (data.allIps?.length) setAllIps(data.allIps);
      })
      .catch((err) => console.error("Erro ao carregar IP de rede:", err));
  }, [isOpen]);

  if (!isOpen) return null;

  const resolvedIp = ip || (typeof window !== "undefined" ? window.location.hostname : "localhost");
  const playerUrl = `http://${resolvedIp}:${port}/jogador/${campaignId}`;

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(playerUrl);
      } else if (typeof document !== "undefined") {
        // Fallback para HTTP inseguro na LAN
        const textarea = document.createElement("textarea");
        textarea.value = playerUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Falha ao copiar link:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Conectar Celulares (Wi-Fi)</h3>
              <p className="text-xs text-[var(--text-muted)]">Portal Mobile dos Jogadores</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-md border-4 border-blue-500/30">
            <QRCodeSVG value={playerUrl} size={190} level="M" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-400 flex items-center justify-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" /> Mesma Rede Wi-Fi Necessária
            </span>
            <p className="text-xs text-[var(--text-muted)] max-w-xs">
              Os jogadores devem estar no mesmo Wi-Fi do computador do Mestre. Aponte a câmera para escanear!
            </p>
          </div>

          {/* Link Box */}
          <div className="w-full p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[11px] text-[var(--text-primary)] truncate">
              {playerUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shrink-0 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>

          {/* Seletor de IP alternativo se houver mais de uma interface */}
          {allIps.length > 1 && (
            <div className="w-full flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">IP da Placa de Rede:</span>
              <select
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-semibold"
              >
                {allIps.map((cand) => (
                  <option key={cand} value={cand}>
                    {cand}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <a
            href={playerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Abrir neste PC
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
