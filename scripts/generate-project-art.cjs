// Deterministic, decorative artwork; no fabricated product screens or data.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '../public/assets/images');
const n = value => Number(value.toFixed(2));
const defs = `<defs>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#666775"/><stop offset=".22" stop-color="#f2efe7"/><stop offset=".4" stop-color="#a5a4ac"/><stop offset=".67" stop-color="#f8e1ae"/><stop offset="1" stop-color="#614726"/></linearGradient>
  <linearGradient id="amber" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1c8"/><stop offset=".5" stop-color="#edb956"/><stop offset="1" stop-color="#795123"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d4d1ec" stop-opacity=".13"/><stop offset=".5" stop-color="#9c8bc9" stop-opacity=".035"/><stop offset="1" stop-color="#9c8bc9" stop-opacity=".17"/></linearGradient>
  <radialGradient id="haze"><stop stop-color="#af8137" stop-opacity=".14"/><stop offset="1" stop-color="#af8137" stop-opacity="0"/></radialGradient>
  <radialGradient id="violet"><stop stop-color="#8570b8" stop-opacity=".17"/><stop offset="1" stop-color="#8570b8" stop-opacity="0"/></radialGradient>
</defs>`;
const frame = body => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">${defs}${body}</svg>`;

let speech = '<ellipse cx="410" cy="475" rx="340" ry="270" fill="url(#haze)"/>';
speech += '<g fill="none" stroke="#c5c1cc" stroke-opacity=".09"><ellipse cx="400" cy="490" rx="308" ry="160" transform="rotate(-22 400 490)"/><ellipse cx="400" cy="490" rx="260" ry="130" transform="rotate(-22 400 490)"/></g>';
speech += '<g transform="translate(0 -20) rotate(-22 400 400)">';
for (let i = 0; i < 66; i++) {
  const t = i / 65;
  const envelope = Math.exp(-Math.pow((t - .28) / .12, 2)) + .86 * Math.exp(-Math.pow((t - .68) / .17, 2));
  const height = 20 + 248 * envelope * (.66 + .34 * Math.pow(Math.sin(i * .72), 2));
  const x = 104 + i * 9.1, y = 397 - height / 2 + 24 * Math.sin(t * Math.PI * 2);
  speech += `<rect x="${n(x + 9)}" y="${n(y + 22)}" width="6" height="${n(height)}" rx="3" fill="#050609" opacity=".55"/>`;
  speech += `<rect x="${n(x)}" y="${n(y)}" width="6" height="${n(height)}" rx="3" fill="url(#${i > 35 ? 'amber' : 'metal'})"/>`;
  speech += `<path d="M${n(x + 1.3)} ${n(y + 4)}v${n(height - 8)}" stroke="#fff6df" stroke-width=".55" opacity=".55"/>`;
}
speech += '</g><g fill="#e3b663"><circle cx="146" cy="588" r="2"/><circle cx="681" cy="279" r="2"/></g>';
speech += '<g stroke="#d4ccba" stroke-opacity=".2" fill="none"><path d="M146 588h48m-24-5v10M633 279h48m-24-5v10"/><path d="M370 655h60m-30-6v12"/></g>';
fs.writeFileSync(path.join(root, 'project-1.svg'), frame(speech));

let medical = '<ellipse cx="410" cy="390" rx="310" ry="300" fill="url(#violet)"/>';
medical += '<g fill="none" stroke="#b9b0d0" stroke-opacity=".12"><ellipse cx="400" cy="620" rx="285" ry="108"/><ellipse cx="400" cy="620" rx="245" ry="82"/></g>';
// Four translucent cross-sections suggest an imaging volume, not a real scan.
for (let layer = 3; layer >= 0; layer--) {
  const shift = layer * 61;
  medical += `<g transform="translate(0 ${shift})"><path d="M400 142 656 286Q674 296 656 307L417 455Q400 465 383 455L144 307Q126 296 144 286L383 142Q400 132 417 142" fill="url(#glass)" stroke="#c5bdde" stroke-opacity="${layer === 0 ? '.5' : '.18'}" stroke-width="1.2"/>`;
  medical += '<g transform="translate(400 299) scale(1 .61) rotate(-2)">';
  for (let ring = 0; ring < 16; ring++) {
    const radius = 29 + ring * 8.3;
    const points = [];
    for (let step = 0; step <= 100; step++) {
      const a = step / 100 * Math.PI * 2;
      const r = radius * (1 + .06 * Math.sin(5 * a + ring * .16) + .07 * Math.cos(3 * a + layer * .5));
      points.push(`${step ? 'L' : 'M'}${n(Math.cos(a) * r)} ${n(Math.sin(a) * r)}`);
    }
    medical += `<path d="${points.join('')}Z" fill="none" stroke="${layer === 0 && ring < 4 ? '#f3bd62' : '#c8bddc'}" stroke-opacity="${layer === 0 ? '.58' : '.19'}" stroke-width="${ring % 4 === 0 ? '1.5' : '.7'}"/>`;
  }
  medical += '</g></g>';
}
medical += '<path d="M400 204v450" stroke="#eac27b" stroke-opacity=".36" stroke-dasharray="2 7"/><circle cx="400" cy="299" r="5" fill="#f4c475"/><circle cx="400" cy="299" r="15" fill="none" stroke="#f4c475" stroke-opacity=".5"/><path d="M400 299h126l34-34h58" fill="none" stroke="#f4c475" stroke-opacity=".5"/><circle cx="620" cy="265" r="3" fill="#f4c475"/>';
fs.writeFileSync(path.join(root, 'project-2.svg'), frame(medical));
