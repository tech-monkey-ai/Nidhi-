// Generate Nidhi app icon PNGs from the source SVG.
// Run with: node scripts/generate-assets.js
// Produces: icon.png, adaptive-icon.png, adaptive-icon-bg.png, splash.png, notif-icon.png, favicon.png

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const SRC = fs.readFileSync(path.join(ASSETS, "nidhi-logo-source.svg"));

async function gen(name, size) {
  const out = path.join(ASSETS, name);
  await sharp(SRC, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png()
    .toFile(out);
  console.log("✓", name, size + "x" + size);
}

async function genSolid(name, size, color) {
  const out = path.join(ASSETS, name);
  await sharp({
    create: { width: size, height: size, channels: 4, background: color },
  })
    .png()
    .toFile(out);
  console.log("✓", name, size + "x" + size, "solid", color);
}

async function genSplash(name, w, h, bg) {
  const out = path.join(ASSETS, name);
  const side = Math.floor(Math.min(w, h) * 0.55);
  const logo = await sharp(SRC, { density: 384 })
    .resize(side, side, { fit: "contain" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: w, height: h, channels: 4, background: bg },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("✓", name, w + "x" + h);
}

async function genNotifIcon(name, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <text x="${size / 2}" y="${size * 0.78}" font-family="Arial" font-size="${size * 0.85}" font-weight="900" text-anchor="middle" fill="#FFFFFF">₹</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(ASSETS, name));
  console.log("✓", name, size + "x" + size);
}

(async () => {
  try {
    await gen("icon.png", 1024);
    await gen("adaptive-icon.png", 1024);
    await genSolid("adaptive-icon-bg.png", 1024, "#0F9D58");
    await genSplash("splash.png", 1242, 2436, "#FAF9F6");
    await genNotifIcon("notif-icon.png", 96);
    await gen("favicon.png", 48);
    console.log("\n✓ All assets generated in", ASSETS);
  } catch (e) {
    console.error("Asset generation failed:", e.message);
    process.exit(1);
  }
})();
