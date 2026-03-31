import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

const envTestPath = join(process.cwd(), ".env.test");
if (existsSync(envTestPath)) {
  config({ path: envTestPath });
}
