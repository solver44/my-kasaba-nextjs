export async function readJSONFile() {
  try {
    const fs = require("fs-extra");
    const path = require("path");

    const filePath = path.join(process.cwd(), "temp.json");

    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

export async function writeJSONFile(data) {
  try {
    const fs = require("fs-extra");
    const path = require("path");
  
    const filePath = path.join(process.cwd(), "temp.json");

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("JSON file updated successfully.");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}
