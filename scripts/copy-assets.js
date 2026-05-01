const fs = require("fs")
const path = require("path")
const srcDir = path.join(__dirname, "../build/safari-mv3-prod")
const destDirs = [
  path.join(
    process.env.HOME,
    "Documents/groupify/safari-extension/groupify/iOS (Extension)/Resources"
  )
]

for (const destDir of destDirs) {
  const destParent = path.dirname(destDir)
  if (!fs.existsSync(destParent)) {
    console.log(`Skipped (parent not found): ${destParent}`)
    continue
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
    console.log(`Created: ${destDir}`)
  }
  fs.cpSync(srcDir, destDir, { recursive: true })
  console.log(`Copied to: ${destDir}`)
}
