/**
 * Utilitário seguro para geração de identificadores únicos.
 * Funciona de forma resiliente tanto em ambientes seguros (HTTPS / localhost)
 * quanto em redes locais inseguras (HTTP LAN / 192.168.x.x), evitando o erro
 * crítico "crypto.randomUUID is not a function / undefined" que quebra a hidratação do React.
 */
export function generateId(prefix = ""): string {
  // 1. Tenta crypto.randomUUID (apenas se existir e for função)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    try {
      const uuid = crypto.randomUUID();
      return prefix ? `${prefix}-${uuid}` : uuid;
    } catch {
      // Ignora erro e recorre aos fallbacks
    }
  }

  // 2. Tenta crypto.getRandomValues (geralmente suportado em HTTP)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    try {
      const bytes = new Uint8Array(8);
      crypto.getRandomValues(bytes);
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      const id = `${Date.now().toString(36)}-${hex}`;
      return prefix ? `${prefix}-${id}` : id;
    } catch {
      // Ignora e recorre ao fallback universal
    }
  }

  // 3. Fallback universal garantido (Math.random + Date.now)
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  const id = `${time}-${rand}`;
  return prefix ? `${prefix}-${id}` : id;
}
