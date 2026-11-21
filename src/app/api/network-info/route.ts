import os from "os";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const interfaces = os.networkInterfaces();
    const candidates: string[] = [];

    for (const name of Object.keys(interfaces)) {
      const ifaceList = interfaces[name];
      if (!ifaceList) continue;

      for (const iface of ifaceList) {
        // Ignora IPv6 e loopback (127.0.0.1)
        if (iface.family === "IPv4" && !iface.internal) {
          // Filtra interfaces virtuais comuns (vEthernet, WSL, VirtualBox)
          const lowerName = name.toLowerCase();
          const isVirtual =
            lowerName.includes("vethernet") ||
            lowerName.includes("wsl") ||
            lowerName.includes("virtual") ||
            lowerName.includes("hyper-v") ||
            iface.address.startsWith("192.168.56.");

          if (!isVirtual) {
            candidates.push(iface.address);
          }
        }
      }
    }

    // Prioriza 192.168.x.x ou 10.x.x.x (redes Wi-Fi domésticas padrão)
    const preferredIp =
      candidates.find((ip) => ip.startsWith("192.168.")) ||
      candidates.find((ip) => ip.startsWith("10.")) ||
      candidates[0] ||
      "127.0.0.1";

    const port = Number(process.env.PORT) || 3000;

    return NextResponse.json({
      ip: preferredIp,
      port,
      allIps: candidates,
    });
  } catch (error) {
    console.error("Erro ao obter network-info:", error);
    return NextResponse.json(
      { ip: "127.0.0.1", port: 3000, allIps: ["127.0.0.1"] },
      { status: 200 }
    );
  }
}
