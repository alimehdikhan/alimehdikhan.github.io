import { llmsIndex, plainText } from '../../lib/llms';

/* /llms.txt: the short index for AI tools (lib/llms.js) */
export const dynamic = 'force-static';

export function GET() {
  return plainText(llmsIndex());
}
