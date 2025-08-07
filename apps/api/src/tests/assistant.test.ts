import { assistantRouter } from "../trpc/routes/assistant.js";
import { testUser1 } from "./test-data/users.js";
const user = testUser1;
const caller = assistantRouter.createCaller({ user: user });

describe("Assistant Router", () => {});
