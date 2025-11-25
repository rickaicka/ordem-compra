const fs = require('fs');

const files = [
  './android/app/capacitor.build.gradle',
  './android/capacitor-cordova-android-plugins/build.gradle'
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    const updated = content.replace(/JavaVersion\.VERSION_\d+/g, 'JavaVersion.VERSION_17');
    if (updated !== content) {
      fs.writeFileSync(file, updated);
      console.log(`✔ ${file} corrigido para Java 17`);
    } else {
      console.log(`ℹ️ ${file} já está com Java 17`);
    }
  } else {
    console.warn(`⚠️ Arquivo não encontrado: ${file}`);
  }
});
