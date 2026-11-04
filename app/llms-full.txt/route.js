import { llmsFull, plainText } from '../../lib/llms';

/* /llms-full.txt: everything about Ali in one Markdown page (lib/llms.js);
   Byte, the site's assistant, answers from it */
export const dynamic = 'force-static';

export async function GET() {
  return plainText(await llmsFull());
}
