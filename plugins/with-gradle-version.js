// Nidhi config plugin — patches gradle.properties JVM memory for Kotlin compiler.

const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withGradleMemory(config) {
  return withDangerousMod(config, [
    "android",
    (modConfig) => {
      const projectRoot = modConfig._internal?.projectRoot || process.cwd();

      const gradlePropsPath = path.join(projectRoot, "android", "gradle.properties");
      if (fs.existsSync(gradlePropsPath)) {
        let content = fs.readFileSync(gradlePropsPath, "utf8");
        if (content.includes("org.gradle.jvmargs")) {
          content = content.replace(
            /org\.gradle\.jvmargs=.*/,
            "org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m",
          );
        } else {
          content += "\norg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m\n";
        }
        fs.writeFileSync(gradlePropsPath, content);
        console.log("[nidhi-plugin] Patched gradle.properties → 4GB JVM heap");
      }

      return modConfig;
    },
  ]);
};
