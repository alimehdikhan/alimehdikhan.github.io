import { ActivityGraph } from './ActivityGraph';
import { RESUME } from '../data/resume';

const LOGIN = RESUME.github.split('/').pop();
/* half a year of columns; narrow screens show the newest that fit */
const WEEKS = 26;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* The public contribution calendar, as GitHub's profile page shows it, from
   a free CORS-enabled mirror of it. Read once when the site is built and
   baked into the page, so visitors make no third-party request; if it is
   unreachable the build carries on without the graph. */
async function contributions() {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${LOGIN}?y=last`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.contributions) && data.contributions.length ? data : null;
  } catch {
    return null;
  }
}

export async function GithubActivity() {
  const data = await contributions();
  if (!data) return null;
  const days = data.contributions;

  /* shades from the quartiles of the active days, so a few very big days
     don't wash every other day out to the palest green */
  const active = days.map((d) => d.count).filter(Boolean).sort((a, b) => a - b);
  if (!active.length) return null;
  const cut = (p) => active[Math.min(active.length - 1, Math.floor(p * active.length))];
  const cuts = [cut(0.25), cut(0.5), cut(0.75)];
  const level = (n) => (!n ? 0 : n <= cuts[0] ? 1 : n <= cuts[1] ? 2 : n <= cuts[2] ? 3 : 4);

  /* GitHub's columns are weeks starting on Sunday */
  const lead = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded = [...Array(lead).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const best = days.reduce((a, d) => (d.count > a.count ? d : a));

  return (
    <ActivityGraph
      weeks={weeks.slice(-WEEKS).map((week) => {
        const first = week.find((d) => d?.date.endsWith('-01'));
        return {
          label: first ? MONTHS[Number(first.date.slice(5, 7)) - 1] : null,
          days: week.map((d) => (d ? [d.date, d.count, level(d.count)] : null)),
        };
      })}
      total={data.total?.lastYear ?? active.reduce((a, b) => a + b, 0)}
      best={{ date: best.date, count: best.count }}
      activeDays={active.length}
      profile={RESUME.github}
    />
  );
}
