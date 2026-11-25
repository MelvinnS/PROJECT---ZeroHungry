import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/server/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { InputAnalisisSchema, HasilAnalisisSchema } from "@/lib/schemas";
import { hitungSkor } from "@/server/services/skor";

const SimpanRiwayatBodySchema = z.object({
  input: InputAnalisisSchema,
  hasil: HasilAnalisisSchema,
  source: z.enum(["live", "fallback"]),
});

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Layanan penyimpanan riwayat belum terkonfigurasi." },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Silakan masuk terlebih dahulu untuk menyimpan riwayat." },
        { status: 401 }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Payload request tidak valid (bukan JSON)." },
        { status: 400 }
      );
    }

    const parseResult = SimpanRiwayatBodySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Format data riwayat tidak valid.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { input, hasil, source } = parseResult.data;

    // SKOR DIHITUNG DI SERVER dari hasil (jangan percaya angka dari klien)
    const skor = hitungSkor({
      jumlah: input.jumlah,
      satuan: input.satuan,
      kategori: hasil.bahan.kategori,
      keamanan: hasil.keamanan.aman_dikonsumsi,
      persenTerselamatkan: hasil.estimasi_dampak.persen_bahan_terselamatkan,
    });

    const { data: insertedData, error: dbError } = await supabase
      .from("riwayat_analisis")
      .insert({
        user_id: user.id,
        nama_bahan: input.nama,
        jumlah: input.jumlah,
        satuan: input.satuan,
        kondisi: input.kondisi,
        kategori: hasil.bahan.kategori,
        keamanan: hasil.keamanan.aman_dikonsumsi,
        hasil: hasil,
        kg_diselamatkan: skor.kg,
        rupiah_dihemat: skor.rupiah,
        porsi: skor.porsi,
        source: source,
      })
      .select("id")
      .single();

    if (dbError || !insertedData) {
      console.error("[API_RIWAYAT_POST_ERROR]", dbError);
      return NextResponse.json(
        { error: "Gagal menyimpan riwayat analisis. Silakan coba beberapa saat lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: insertedData.id }, { status: 201 });
  } catch (error) {
    console.error("[API_RIWAYAT_POST_UNEXPECTED]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Layanan penyimpanan riwayat belum terkonfigurasi." },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { error: "Parameter ID tidak valid." },
        { status: 400 }
      );
    }

    // Hapus milik sendiri menggunakan RLS (auth.uid() = user_id)
    const { error: deleteError } = await supabase
      .from("riwayat_analisis")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("[API_RIWAYAT_DELETE_ERROR]", deleteError);
      return NextResponse.json(
        { error: "Gagal menghapus riwayat analisis." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API_RIWAYAT_DELETE_UNEXPECTED]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
