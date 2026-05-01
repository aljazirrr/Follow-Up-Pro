export function log(
  src: string,
  msg: string,
  meta?: Record<string, unknown>
): void {
  console.log(JSON.stringify({ ts: new Date().toISOString(), src, msg, ...meta }));
}
