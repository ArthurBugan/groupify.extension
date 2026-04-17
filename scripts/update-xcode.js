const fs = require("fs")
const path = require("path")

const pkg = JSON.parse(fs.readFileSync("package.json"))
const version = pkg.version
const name = "Groupify YT Organize"

const xcodepath = path.join(
  process.env.HOME,
  "Documents/groupify/safari-extension/groupify/groupify.xcodeproj/project.pbxproj"
)

let content = fs.readFileSync(xcodepath, "utf8")

content = content.replace(
  /MARKETING_VERSION = [0-9.]+;/g,
  `MARKETING_VERSION = ${version};`
)
content = content.replace(
  /CURRENT_PROJECT_VERSION = [0-9.]+;/g,
  `CURRENT_PROJECT_VERSION = ${version};`
)

content = content.replace(
  /PRODUCT_NAME = "[^"]*";/g,
  `PRODUCT_NAME = "${name}";`
)
content = content.replace(/PRODUCT_NAME = [^;]+;/g, `PRODUCT_NAME = "${name}";`)

fs.writeFileSync(xcodepath, content)

console.log(`Updated Xcode project: version=${version}, name=${name}`)
