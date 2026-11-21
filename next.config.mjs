import os from "os";

function getLocalIpAddresses() {
  const ips = ["localhost", "127.0.0.1", "localhost:3000", "127.0.0.1:3000"];
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          ips.push(iface.address);
          ips.push(`${iface.address}:3000`);
          ips.push(`${iface.address}:3001`);
        }
      }
    }
  } catch {
    // fallback se não conseguir ler interfaces
  }
  return Array.from(new Set(ips));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    ...getLocalIpAddresses(),
    "192.168.*",
    "10.*",
    "172.16.*",
    "*.local",
  ],
};

export default nextConfig;
