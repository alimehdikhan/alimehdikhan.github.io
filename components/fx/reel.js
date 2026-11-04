/* The project reel's timing, shared by Projects.js (how far the section
   scrolls) and fx/ReelMotion.js (what the scroll does). Each scene holds
   still for HOLD while it is read, and the next one takes MOVE to slide in.
   One unit is UNIT_VW of the screen's width in scrolling. */
export const HOLD = 0.3;
export const MOVE = 0.85;
export const UNIT_VW = 80;

/* the whole reel, in units, for n scenes */
export const reelLength = (n) => n * HOLD + (n - 1) * MOVE;
