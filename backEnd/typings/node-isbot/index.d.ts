declare module 'node-isbot' {
  export = isbot;

  declare function isbot(ua: string): boolean;
}