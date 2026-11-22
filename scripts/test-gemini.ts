import { loadEnvConfig } from "@next/env";
import { SYSTEM_PROMPT, buildUserMessage } from "../lib/prompts";
import { HasilAnalisisSchema, type InputAnalisis } from "../lib/schemas";

// 1. Muat environment variable dari .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY tidak ditemukan di environment.");
  process.exit(1);
}

const inputContoh: InputAnalisis = {
  nama: "pisang kepok",
  jumlah: 1,
  satuan: "kg",
  kondisi: "Mulai layu atau matang berlebih, belum berjamur atau berbau busuk",
  tipe: "rumah_tangga",
  alat: ["kompor", "blender"],
};

const userMessage = buildUserMessage(inputContoh);

// Model yang diminta sesuai spesifikasi
const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

interface TestResult {
  model: string;
  durationMs: number;
  finishReason: string;
  textLength: number;
  jsonParseOk: boolean;
  zodOk: boolean;
  httpStatus: number;
  first3Errors?: string[];
}

async function testModel(model: string): Promise<TestResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
      maxOutputTokens: 6000,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  };

  const startTime = Date.now();
  let httpStatus = 0;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey!,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    httpStatus = res.status;
    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return {
        model,
        durationMs,
        finishReason: `HTTP_ERROR_${httpStatus}`,
        textLength: errBody.length,
        jsonParseOk: false,
        zodOk: false,
        httpStatus,
      };
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };

    const candidate = data.candidates?.[0];
    const finishReason = candidate?.finishReason || "UNKNOWN";
    const text = candidate?.content?.parts?.map((p) => p.text || "").join("") || "";
    const textLength = text.length;

    let jsonParseOk = false;
    let parsedJson: unknown = null;

    try {
      const cleaned = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        parsedJson = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        jsonParseOk = true;
      }
    } catch {
      jsonParseOk = false;
    }

    let zodOk = false;
    let first3Errors: string[] | undefined = undefined;

    if (jsonParseOk && parsedJson) {
      const zodRes = HasilAnalisisSchema.safeParse(parsedJson);
      zodOk = zodRes.success;
      if (!zodRes.success) {
        first3Errors = zodRes.error.issues.slice(0, 3).map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
      }
    }

    return {
      model,
      durationMs,
      finishReason,
      textLength,
      jsonParseOk,
      zodOk,
      httpStatus,
      first3Errors,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      model,
      durationMs,
      finishReason: `FETCH_FAILED: ${errMsg}`,
      textLength: 0,
      jsonParseOk: false,
      zodOk: false,
      httpStatus: 0,
    };
  }
}

async function run() {
  console.log("=== PENGUJIAN REST GEMINI API ===");
  const results: TestResult[] = [];

  for (const model of models) {
    console.log(`\nMenjalankan pengujian untuk model: ${model}...`);
    const result = await testModel(model);
    results.push(result);

    console.log(`- Model        : ${result.model}`);
    console.log(`- HTTP Status  : ${result.httpStatus}`);
    console.log(`- Durasi       : ${result.durationMs} ms`);
    console.log(`- finishReason : ${result.finishReason}`);
    console.log(`- Panjang Teks : ${result.textLength} karakter`);
    console.log(`- JSON.parse   : ${result.jsonParseOk ? "✅ Berhasil" : "❌ Gagal"}`);
    console.log(`- Zod Schema   : ${result.zodOk ? "✅ Lulus" : "❌ Gagal"}`);
    if (result.first3Errors && result.first3Errors.length > 0) {
      console.log(`  Detail Error Zod:`);
      result.first3Errors.forEach((e) => console.log(`   * ${e}`));
    }
  }

  console.log("\n=== TABEL HASIL PENGUJIAN ===");
  console.table(
    results.map((r) => ({
      Model: r.model,
      "Durasi (ms)": r.durationMs,
      finishReason: r.finishReason,
      "Panjang (char)": r.textLength,
      "JSON OK": r.jsonParseOk ? "Ya" : "Tidak",
      "Zod OK": r.zodOk ? "Ya" : "Tidak",
      HTTP: r.httpStatus,
    }))
  );
}

run();
