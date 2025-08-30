// Archivo temporal para verificar variables de entorno
const fs = require("fs");
const path = require("path");

try {
  const envPath = path.join(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    console.log("✅ .env.local encontrado:");
    console.log(content);

    // Verificar OpenAI API key
    if (content.includes("OPENAI_API_KEY=")) {
      console.log("\n🔑 OpenAI API Key: CONFIGURADA");
    } else {
      console.log("\n❌ OpenAI API Key: NO CONFIGURADA");
    }

    // Verificar Unsplash API key
    if (content.includes("UNSPLASH_ACCESS_KEY=")) {
      console.log("🖼️  Unsplash API Key: CONFIGURADA");
    } else {
      console.log("❌ Unsplash API Key: NO CONFIGURADA");
    }
  } else {
    console.log("❌ .env.local NO encontrado");
  }
} catch (error) {
  console.error("Error:", error.message);
}

