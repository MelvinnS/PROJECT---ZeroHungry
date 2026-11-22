/**
 * Helper rantai model Google Gemini via REST API.
 * Mendukung failover berurutan lintas model, deteksi error auth/quota/timeout,
 * retry otomatis tanpa thinkingConfig bila ditolak, dan validasi schema Zod.
 */

interface PanggilGeminiRantaiParams<T> {
  systemPrompt: string;
  userMessage: string;
  validasi: (json: unknown) => { success: boolean; data?: T; error?: unknown };
}

export async function panggilGeminiRantai<T>({
  systemPrompt,
  userMessage,
  validasi,
}: PanggilGeminiRantaiParams<T>): Promise<T | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "ISI_API_KEY_DI_SINI") {
    return null;
  }

  // Model dari env GEMINI_MODELS (dipisah koma, trim); jika kosong pakai GEMINI_MODEL; jika kosong "gemini-3.5-flash"
  const rawModels =
    process.env.GEMINI_MODELS ||
    process.env.GEMINI_MODEL ||
    "gemini-3.5-flash";

  const modelList = rawModels
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const models = modelList.length > 0 ? modelList : ["gemini-3.5-flash"];

  const MAX_TOTAL_MS = 55000;
  const totalStartTime = Date.now();

  for (const model of models) {
    // Periksa sisa total waktu
    const elapsedTotal = Date.now() - totalStartTime;
    const remainingTotalMs = MAX_TOTAL_MS - elapsedTotal;
    if (remainingTotalMs < 1000) {
      break;
    }

    // Tiap model punya kesempatan retry (misal jika 400 thinking error)
    let includeThinking = true;
    let modelAttempt = 0;

    while (modelAttempt < 2) {
      modelAttempt++;
      const attemptElapsed = Date.now() - totalStartTime;
      const attemptRemaining = MAX_TOTAL_MS - attemptElapsed;
      if (attemptRemaining < 1000) {
        return null;
      }

      const timeoutMs = Math.min(20000, attemptRemaining);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const payload = {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
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
          maxOutputTokens: 8000,
          ...(includeThinking
            ? {
                thinkingConfig: {
                  thinkingBudget: 0,
                },
              }
            : {}),
        },
      };

      const callStartTime = Date.now();

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(timeoutMs),
        });

        const durationMs = Date.now() - callStartTime;

        // 401 atau 403: auth error -> berhenti seluruh rantai
        if (res.status === 401 || res.status === 403) {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=auth_error_${res.status}`
          );
          return null;
        }

        // Status 400 yang menyebut "thinking": ulangi model SAMA sekali tanpa thinkingConfig
        if (res.status === 400) {
          const errText = await res.text().catch(() => "");
          if (includeThinking && errText.toLowerCase().includes("thinking")) {
            console.log(
              `[Gemini] model=${model} durasi=${durationMs}ms hasil=retry_without_thinking`
            );
            includeThinking = false;
            continue; // Ulangi model yang sama tanpa thinking
          }

          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=http_400`
          );
          break; // Lanjut ke model berikutnya
        }

        // Status 404/429/500/503 atau error HTTP lain
        if (!res.ok) {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=http_${res.status}`
          );
          break; // Lanjut ke model berikutnya
        }

        const data = (await res.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
            finishReason?: string;
          }>;
        };

        const candidate = data.candidates?.[0];
        const finishReason = candidate?.finishReason;

        if (finishReason === "MAX_TOKENS") {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=max_tokens`
          );
          break; // Lanjut ke model berikutnya
        }

        const textContent =
          candidate?.content?.parts?.map((p) => p.text || "").join("") || "";

        if (!textContent.trim()) {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=empty`
          );
          break;
        }

        // Bersihkan pagar kode markdown
        const cleaned = textContent
          .replace(/```(?:json)?/gi, "")
          .replace(/```/g, "")
          .trim();

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=parse`
          );
          break;
        }

        let parsedJson: unknown;
        try {
          const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
          parsedJson = JSON.parse(jsonString);
        } catch {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=parse`
          );
          break;
        }

        const validasiResult = validasi(parsedJson);
        if (!validasiResult.success || !validasiResult.data) {
          console.log(
            `[Gemini] model=${model} durasi=${durationMs}ms hasil=zod`
          );
          break;
        }

        // Sukses
        console.log(
          `[Gemini] model=${model} durasi=${durationMs}ms hasil=ok`
        );
        return validasiResult.data;
      } catch (err: unknown) {
        const durationMs = Date.now() - callStartTime;
        const errMsg = err instanceof Error ? err.message : String(err);
        const isTimeout =
          (err instanceof Error && err.name === "TimeoutError") ||
          errMsg.toLowerCase().includes("timeout") ||
          errMsg.toLowerCase().includes("aborted");

        const label = isTimeout ? "timeout" : "network_error";
        console.log(
          `[Gemini] model=${model} durasi=${durationMs}ms hasil=${label}`
        );
        break; // Lanjut ke model berikutnya
      }
    }
  }

  return null;
}
