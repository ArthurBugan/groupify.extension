const fs = require("fs")
const path = require("path")

const xcodepath = path.join(
  process.env.HOME,
  "Documents/groupify/safari-extension/groupify/groupify.xcodeproj/project.pbxproj"
)

let lines = fs.readFileSync(xcodepath, "utf8").split("\n")

const linesToRemove = []
const macOSTargetIDs = [
  "8EB5BC7F", // groupify (macOS)
  "8EB5BC94", // groupify Extension (macOS)
  "8EB5BC95", // Groupify YT Organize.appex (macOS)
  "8EB5BC96", // Groupify YT Organize.appex in Embed Foundation Extensions (macOS)
  "8EB5BC97", // PBXContainerItemProxy (macOS)
  "8EB5BCC4", // Build config list (macOS)
  "8EB5BCC8", // Build config list (macOS)
  "8EB5BCC9", // Build config (macOS)
  "8EB5BCDA", //
  "8EB5BCDB", //
  "8EB5BCE0", //
  "8EB5BCE4", //
  "8EB5BCE8", //
  "8EB5BCEC", //
  "8EB5BCF0", //
  "8EB5BCF4", //
  "8EB5BCF8", //
  "8EB5BCFC", //
  "8EB5BD00" //
]

let newLines = lines.filter((line) => {
  if (line.includes("macOS") && !line.includes("iOS")) return true
  const idMatch = line.match(/([0-9A-F]{8})[0-9A-F]{8}/)
  if (idMatch && macOSTargetIDs.some((id) => id === idMatch[1])) return true
  return false
})

fs.writeFileSync(xcodepath, newLines.join("\n"))

console.log("Cleaned up macOS references")
