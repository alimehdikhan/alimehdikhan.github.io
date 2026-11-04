import * as P from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

/* The site's icon set: Phosphor's duotone family (MIT), wrapped so every icon
   shares one treatment.
   - weight: duotone, so each icon has a solid outline and a soft second layer;
     CSS (.icon-duo in globals.css) tints that layer with --icon-accent
     (lime on dark, olive on light, ink on the lime panel).
   - motion: icons that point somewhere get a hook class (ico-ur, ico-down,
     ico-up, ico-send, ico-next, ico-spin) which buttons and links animate on
     hover; see globals.css. Nothing moves under reduced motion.
   - aria-hidden: all of these are decorative; controls carry their own labels.
   Exported under the names the components already used, so a component only
   changes its import path. */
function make(Icon, { hook, weight = 'duotone' } = {}) {
  function SiteIcon({ className, ...props }) {
    return <Icon weight={weight} aria-hidden="true" className={cn('icon-duo shrink-0', hook, className)} {...props} />;
  }
  SiteIcon.displayName = Icon.displayName || 'SiteIcon';
  return SiteIcon;
}

export const Download = make(P.DownloadSimple, { hook: 'ico-down' });
export const ArrowDown = make(P.ArrowDown, { hook: 'ico-down' });
export const ArrowUp = make(P.ArrowUp, { hook: 'ico-up' });
export const ArrowUpRight = make(P.ArrowUpRight, { hook: 'ico-ur' });
export const ChevronRight = make(P.CaretRight, { hook: 'ico-next' });
export const Code = make(P.CodeBlock);
export const Server = make(P.HardDrives);
export const Brain = make(P.Brain);
export const Users = make(P.UsersThree);
export const Mail = make(P.EnvelopeSimple);
export const Phone = make(P.Phone);
export const MapPin = make(P.MapPin);
export const Copy = make(P.Copy);
export const Check = make(P.Check, { weight: 'bold' });
export const Send = make(P.PaperPlaneTilt, { hook: 'ico-send' });
export const Menu = make(P.List, { weight: 'bold' });
export const X = make(P.X, { weight: 'bold' });
export const Sun = make(P.Sun);
export const Moon = make(P.MoonStars);
export const Play = make(P.Play, { weight: 'fill' });
export const Pause = make(P.Pause, { weight: 'fill' });
export const CircleAlert = make(P.WarningCircle);
export const LoaderCircle = make(P.SpinnerGap, { weight: 'bold', hook: 'ico-spin' });
export const BadgeCheck = make(P.SealCheck);
export const GraduationCap = make(P.GraduationCap);
export const RotateCcw = make(P.ArrowCounterClockwise, { hook: 'ico-ccw' });
export const Stop = make(P.Stop, { weight: 'fill' });
/* a case study page */
export const Article = make(P.Article);

/* glyphs for skills that have no brand mark (SQL, REST, RAG, soft skills) */
export const Database = make(P.Database);
export const Exchange = make(P.ArrowsLeftRight);
export const Prompt = make(P.ChatCircleDots);
export const Evaluate = make(P.ListChecks);
export const Language = make(P.Translate);
export const Pipeline = make(P.FlowArrow);
export const Search = make(P.MagnifyingGlass);
export const Chat = make(P.ChatsCircle);
export const Puzzle = make(P.PuzzlePiece);
export const Adapt = make(P.ArrowsClockwise);
export const Timer = make(P.Timer);
export const Waveform = make(P.Waveform);
export const Repo = make(P.GitBranch);
export const Layers = make(P.Stack);
export const Browser = make(P.Browser);
export const Cloud = make(P.Cloud);
export const Bolt = make(P.Lightning);
export const Sparkle = make(P.Sparkle);
export const Expand = make(P.ArrowsOutSimple);
export const Star = make(P.Star);
export const GitFork = make(P.GitFork);
export const Bookmark = make(P.BookmarkSimple);
export const TrendUp = make(P.TrendUp);
export const Heart = make(P.HeartStraight);
/* the starring walkthrough: GitHub's starred star and its page furniture */
export const StarFill = make(P.Star, { weight: 'fill' });
export const Bell = make(P.BellSimple);
export const Lock = make(P.LockSimple);
/* the command palette: its key, Enter, and a glyph per section */
export const Command = make(P.Command);
export const CornerDownLeft = make(P.ArrowElbowDownLeft);
export const Home = make(P.House);
export const User = make(P.User);
export const Briefcase = make(P.Briefcase);
export const Pulse = make(P.Pulse);
/* pull requests to other projects: merged, or still open */
export const GitMerge = make(P.GitMerge);
export const GitPullRequest = make(P.GitPullRequest);

/* brand marks are monochrome so they sit in the black-and-lime palette */
export const GithubMark = make(P.GithubLogo, { weight: 'fill' });
export const LinkedinMark = make(P.LinkedinLogo, { weight: 'fill' });
export const XMark = make(P.XLogo, { weight: 'fill' });
