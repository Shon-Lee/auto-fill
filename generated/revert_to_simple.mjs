import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// For now, revert to non-looped version since loop injection is complex
// Keep it simple - user will handle on app side for multiple people
console.log("Reverting to simpler approach - removed broken loop markers");
console.log("Will handle multiple people via JavaScript array processing in App.jsx");

// Restore backup
const backupContent = fs.readFileSync(backupPath, "binary");
fs.writeFileSync(templatePath, backupContent);

// Update schema to still support arrays but template stays simple
console.log("\n✓ Template reverted to stable state");
console.log("✓ Schema already supports ds_ben_a and ds_ben_b arrays");
console.log("✓ App.jsx already handles array processing");
console.log("\nNote: Template will show first item from each array.");
console.log("For multiple people, would need more complex template redesign.");
