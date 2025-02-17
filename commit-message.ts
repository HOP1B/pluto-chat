import fs from "fs";

const commitMsgFile = process.argv[2];
const commitMsg = fs.readFileSync(commitMsgFile, "utf8").trim();

// Define the regex for conventional commits
const commitRegex = /^(feat|fix|docs|style|refactor|perf|test|chore|revert)(\(.+\))?!?: .{1,100}/;

if (!commitRegex.test(commitMsg)) {
  console.error("❌ Invalid commit message format!");
  console.error("🔹 Format should be: 'type(scope): description' (e.g., 'feat(auth): add login support')");
  process.exit(1);
}

console.log("✅ Commit message is valid!");
