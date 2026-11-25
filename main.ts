import * as fs from "node:fs";
import * as path from "node:path";

const ENTRY =
  "My grandmother's rendang in Padang — beef so tender it fell apart, coconut gravy still steaming over rice, eaten cross-legged on the floor while rain drummed the tin roof.";

const OUTPUT_PATH = "/output/entry.txt";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space, and one sentence.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function validateEntry(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `Entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace");
  }
  if (!text.trim().endsWith(".")) {
    throw new Error("Entry must be a single sentence ending with a period");
  }
}

function main(): void {
  validateEntry(ENTRY);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  // Read back byte-for-byte to prove what was written is what we validated.
  const written = fs.readFileSync(OUTPUT_PATH);
  if (!written.equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("Read-back mismatch: file contents differ from entry");
  }
  console.log(
    `Wrote ${[...ENTRY].length} characters to ${OUTPUT_PATH} (verified byte-for-byte)`,
  );
}

main();
