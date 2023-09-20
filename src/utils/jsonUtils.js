export async function readJSONFile() {
  const fs = require("fs-extra");
  const path = require("path");

  const filePath = path.join(process.cwd(), "temp.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

export async function writeJSONFile(data) {
  const fs = require("fs-extra");
  const path = require("path");

  const filePath = path.join(process.cwd(), "temp.json");

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("JSON file updated successfully.");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}
