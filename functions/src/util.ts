import { format } from "date-fns";
import * as log from "./log";
import * as types from "./types";

export const FUNCTION_OPTS = {
  timeoutSeconds: 540,
  memory: "2GB" as "2GB"
};

export async function delay(seconds: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function DateSlug(date: Date): string {
  return format(date, "YY-MM-DD");
}

const timers: { [s: string]: number } = {};

function getTime(): number {
  return new Date().getTime();
}

export function setDiff<T>(a: T[], b: T[]) {
  return a.filter((x: T) => {
    return b.indexOf(x) < 0;
  });
}

export function startTimer(label: string) {
  timers[label] = getTime();
}

export function endTimer(label: string) {
  const start = timers[label];
  if (!start) {
    return;
  }

  const end = getTime();
  const diff = end - start;

  log.logData({
    event: "timer",
    label: label,
    val: diff,
    message: `Operation "${label}" took ${diff}ms`
  });

  delete timers[label];
}

export function samScore(open: number, closed: number): number {
  if (open === 0) {
    return 0;
  }

  const score = (open / (open + closed)) * Math.log(Math.E + open + closed);
  return Math.round(score * 1000) / 1000;
}

export function timeAgo(obj: types.internal.Timestamped): number {
  return Date.now() - Date.parse(obj.created_at);
}

export function split<T>(arr: T[], fn: (arg: T) => boolean) {
  const yes = arr.filter(fn);
  const no = arr.filter(x => !fn(x));

  return [yes, no];
}

export function compareTimestamps(
  a: types.internal.Timestamped,
  b: types.internal.Timestamped
) {
  const aTime = Date.parse(a.created_at);
  const bTime = Date.parse(b.created_at);

  if (aTime > bTime) {
    return 1;
  } else if (bTime > aTime) {
    return -1;
  } else {
    return 0;
  }
}
