/**
 * Access `process.env` in an environment helper
 * Usage: `EnvHelper.env`
 */
export class EnvHelper {
  /**
   * @returns `process.env`
   */
  static env = process.env!;
  static URI = EnvHelper.env.REACT_APP_RPC_HTTP_URL;
  static INFURA_PROJECT_ID = EnvHelper.env.REACT_APP_INFURA_PROJECT_ID;
  static INFURA_PROJECT_SECRET = EnvHelper.env.REACT_APP_INFURA_PROJECT_SECRET;
  static localhostURI = "http://localhost:8545";
  static whitespaceRegex = /\s+/;
}
