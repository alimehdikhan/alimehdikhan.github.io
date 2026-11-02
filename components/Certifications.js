import fs from 'node:fs';
import path from 'node:path';
import { SectionHead } from './ui/SectionHead';
import { CertificateGallery } from './CertificateGallery';
import { RESUME } from '../data/resume';

/* Certificate scans live in public/assets/certificates/<slug>.<ext>. The
   lookup runs at build time, so a credential without a scan yet shows its
   issuer mark instead of a broken image, and every scan ships with its real
   width and height (no layout shift, and the lightbox morph keeps its shape). */
const CERT_DIR = '/assets/certificates';
const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

/* pixel size from the file header: PNG, WebP (lossy, lossless, extended) and JPEG */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 1, 4) === 'PNG') return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i + 9 < b.length; i += 2 + b.readUInt16BE(i + 2)) {
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
    }
  }
  return { width: 1500, height: 1000 };
}

function certificateScan(slug) {
  if (!slug) return null;
  for (const ext of EXTENSIONS) {
    const file = path.join(process.cwd(), 'public', CERT_DIR, `${slug}.${ext}`);
    if (fs.existsSync(file)) return { src: `${CERT_DIR}/${slug}.${ext}`, ...imageSize(file) };
  }
  return null;
}

export function Certifications() {
  const items = RESUME.certifications.map((cert) => ({ ...cert, scan: certificateScan(cert.image) }));

  return (
    <section id="certifications" className="section-y" aria-labelledby="certifications-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Certificates I&apos;ve <em>earned</em>
            </>
          }
          titleId="certifications-title"
        />

        <CertificateGallery items={items} />
      </div>
    </section>
  );
}
