import { llmsIndex, plainText } from '../../lib/llms';

/* /llm.txt: the same index as /llms.txt, for the singular spelling people
   (and some tools) try first */
export const dynamic = 'force-static';

export function GET() {
  return plainText(llmsIndex());
}
