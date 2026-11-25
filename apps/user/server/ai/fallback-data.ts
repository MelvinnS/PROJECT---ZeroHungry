import { HasilAnalisis, InputAnalisis } from "@/lib/schemas";

export type FallbackKey = "pisang" | "nasi" | "tempe" | "sayur" | "singkong";

interface FallbackEntry {
  keywords: string[];
  data: HasilAnalisis;
}

export const FALLBACK_DATA: Record<FallbackKey, FallbackEntry> = {
  pisang: {
    keywords: ["pisang", "kepok", "raja", "ambon"],
    data: {
      bahan: {
        nama_standar: "Pisang",
        kategori: "buah",
        kondisi_input: "Terlalu matang (kulit berbintik cokelat atau kehitaman)",
      },
      keamanan: {
        aman_dikonsumsi: "aman",
        alasan:
          "Pisang yang terlalu matang berkulit kecokelatan masih sangat aman dan memiliki kadar gula alami yang manis, asalkan daging tidak busuk berair atau berjamur.",
        catatan:
          "Periksa bagian ujung buah; buang bagian yang memar parah bila ada.",
      },
      umur_simpan: {
        hari_min: 1,
        hari_maks: 3,
        urgensi: "segera_olah",
        tips_penyimpanan:
          "Kupas lalu simpan dalam wadah kedap di freezer, atau simpan di tempat sejuk terlindung dari lalat buah.",
      },
      pengawetan: [
        {
          metode: "Pembekuan (Freezing)",
          cocok_karena:
            "Menghentikan proses pematangan berlebih tanpa merusak rasa manis alami.",
          langkah_singkat: [
            "Kupas kulit pisang dan potong melintang sesuai selera.",
            "Masukkan ke dalam wadah kedap udara atau kantong plastik ziplock.",
            "Simpan di freezer hingga beku sempurna.",
          ],
          tambahan_umur_hari: 60,
          alat: ["freezer"],
        },
        {
          metode: "Pengeringan (Sale Pisang Tradisional)",
          cocok_karena:
            "Kadar gula tinggi sangat pas dibuat olahan sale yang legit dan awet lama.",
          langkah_singkat: [
            "Iris pisang tipis memanjang secara merata.",
            "Jemur di bawah terik matahari selama 2-3 hari atau gunakan oven/dehidrator.",
            "Simpan dalam toples rapat atau goreng dengan tepung renyah.",
          ],
          tambahan_umur_hari: 30,
          alat: ["kompor"],
        },
      ],
      ide_olahan: [
        {
          nama: "Pisang Goreng Kepok Renyah",
          deskripsi:
            "Camilan legendaris berbalut tepung renyah dengan aroma manis alami.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 20,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Tepung terigu & beras", jumlah: "150 gram" },
            { nama: "Minyak goreng", jumlah: "250 ml" },
            { nama: "Garam dan vanili", jumlah: "Secukupnya" },
          ],
          langkah: [
            "Belah pisang membentuk kipas atau potong melintang.",
            "Campurkan tepung terigu, tepung beras, air, sedikit garam, dan vanili hingga kental.",
            "Celupkan pisang ke dalam adonan tepung.",
            "Goreng dalam minyak panas hingga kuning keemasan, lalu tiriskan.",
          ],
          estimasi_biaya_rp: 12000,
          estimasi_porsi: 4,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 20000,
          tips: "Gunakan campuran tepung beras agar kulit gorengan tetap renyah tahan lama.",
        },
        {
          nama: "Bolu Pisang Kukus Sederhana (Banana Bread)",
          deskripsi:
            "Kue bolu lembut beraroma pisang manis alami tanpa memerlukan mixer rumit.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "sedang",
          durasi_menit: 45,
          alat_dibutuhkan: ["kompor", "kukusan"],
          bahan_tambahan: [
            { nama: "Tepung terigu", jumlah: "200 gram" },
            { nama: "Telur ayam", jumlah: "2 butir" },
            { nama: "Gula pasir", jumlah: "100 gram" },
            { nama: "Minyak sayur atau margarin", jumlah: "80 ml" },
            { nama: "Baking soda", jumlah: "1/2 sdt" },
          ],
          langkah: [
            "Lumatkan pisang matang dengan garpu hingga halus.",
            "Kocok telur dan gula hingga larut, lalu tuangkan lumatkan pisang.",
            "Ayak tepung terigu dan baking soda ke dalam adonan, aduk perlahan.",
            "Tambahkan minyak sayur, aduk rata lalu tuang ke loyang beralas margarin.",
            "Kukus selama 30-35 menit hingga matang saat ditusuk lidi.",
          ],
          estimasi_biaya_rp: 22000,
          estimasi_porsi: 8,
          umur_simpan_hasil_hari: 3,
          potensi_harga_jual_rp: 45000,
          tips: "Pastikan tutup kukusan dialasi kain bersih agar uap air tidak menetes ke atas adonan kue.",
        },
        {
          nama: "Es Pisang Cokelat Beku / Smoothie Segar",
          deskripsi:
            "Minuman dingin manis lembut atau camilan beku celup cokelat yang digemari anak-anak.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 15,
          alat_dibutuhkan: ["blender", "freezer"],
          bahan_tambahan: [
            { nama: "Susu cair / kental manis", jumlah: "150 ml" },
            { nama: "Bubuk cokelat", jumlah: "2 sdm" },
            { nama: "Es batu", jumlah: "Secukupnya" },
          ],
          langkah: [
            "Potong pisang beku menjadi bagian kecil.",
            "Masukkan potongan pisang, susu, dan bubuk cokelat ke dalam tabung blender.",
            "Haluskan hingga tekstur mengental menyerupai es krim lembut.",
            "Tuang ke gelas saji dan segera nikmati.",
          ],
          estimasi_biaya_rp: 10000,
          estimasi_porsi: 2,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 20000,
          tips: "Gunakan pisang yang telah dibekukan terlebih dahulu untuk menghasilkan tekstur smoothie yang creamy tanpa perlu banyak es batu.",
        },
      ],
      estimasi_dampak: {
        persen_bahan_terselamatkan: 95,
      },
    },
  },

  nasi: {
    keywords: ["nasi", "beras", "bubur"],
    data: {
      bahan: {
        nama_standar: "Nasi",
        kategori: "karbohidrat",
        kondisi_input: "Nasi sisa dingin semalam yang masih bersih dan tidak berlendir",
      },
      keamanan: {
        aman_dikonsumsi: "aman",
        alasan:
          "Nasi dingin yang belum berbau masam, berlendir, atau berubah warna kuning kemerahan masih aman dikonsumsi dengan pemanasan ulang secara sempurna.",
        catatan:
          "Pastikan nasi dipanaskan hingga panas mengepul merata sebelum disantap.",
      },
      umur_simpan: {
        hari_min: 1,
        hari_maks: 2,
        urgensi: "segera_olah",
        tips_penyimpanan:
          "Simpan nasi di chiller lemari pendingin tertutup rapat, jangan biarkan pada suhu ruang lebih dari 4 jam.",
      },
      pengawetan: [
        {
          metode: "Pembekuan Porsi Nasi",
          cocok_karena:
            "Mencegah pertumbuhan bakteri Bacillus cereus dan mengunci kelembapan alami nasi.",
          langkah_singkat: [
            "Bagi nasi ke dalam porsi sekali makan.",
            "Bungkus rapat dengan plastik food-grade atau wadah kedap.",
            "Simpan langsung di dalam freezer.",
          ],
          tambahan_umur_hari: 30,
          alat: ["freezer"],
        },
        {
          metode: "Penjemuran Nasi Kering (Aking / Karak Gurih)",
          cocok_karena:
            "Menghilangkan kadar air secara total sehingga nasi dapat bertahan berbulan-bulan.",
          langkah_singkat: [
            "Cuci nasi sisa sebentar agar butirannya terurai.",
            "Ratakan di atas tampah bersih dan jemur di bawah terik matahari hingga kering garing.",
            "Simpan dalam toples rapat, siap digoreng sewaktu-waktu.",
          ],
          tambahan_umur_hari: 90,
          alat: ["tanpa_alat"],
        },
      ],
      ide_olahan: [
        {
          nama: "Nasi Goreng Kampung Spesial",
          deskripsi:
            "Olahan klasik gurih beraroma bawang dan kecap, sangat pas memakai tekstur nasi dingin yang perak.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 15,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Bawang merah & putih", jumlah: "5 siung" },
            { nama: "Telur ayam", jumlah: "1-2 butir" },
            { nama: "Kecap manis & garam", jumlah: "Secukupnya" },
            { nama: "Cabai rawit", jumlah: "3 buah" },
          ],
          langkah: [
            "Haluskan bawang merah, bawang putih, dan cabai rawit.",
            "Tumis bumbu halus dengan sedikit minyak hingga harum.",
            "Sisihkan bumbu di tepi wajan, masukkan telur lalu buat orak-arik.",
            "Masukkan nasi dingin, bumbui kecap manis dan garam, aduk cepat dengan api besar hingga bumbu meresap sempurna.",
          ],
          estimasi_biaya_rp: 10000,
          estimasi_porsi: 2,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 25000,
          tips: "Nasi dingin dari kulkas menghasilkan tekstur nasi goreng yang tidak lembek dan butirannya terpisah sempurna.",
        },
        {
          nama: "Rengginang / Kerupuk Nasi Gurih",
          deskripsi:
            "Camilan tradisional renyah dengan citarasa gurih bawang dan terasi yang bernilai ekonomis tinggi.",
          asal_daerah: "Jawa Barat & Jawa Tengah",
          tingkat_kesulitan: "sedang",
          durasi_menit: 40,
          alat_dibutuhkan: ["kompor", "kukusan"],
          bahan_tambahan: [
            { nama: "Bawang putih & ketumbar", jumlah: "4 siung" },
            { nama: "Garam & kaldu bubuk", jumlah: "1 sdt" },
            { nama: "Minyak goreng", jumlah: "300 ml" },
          ],
          langkah: [
            "Haluskan bumbu bawang putih, garam, dan ketumbar, campur merata ke dalam nasi.",
            "Kukus nasi sebentar selama 10 menit agar pulen dan menyatu.",
            "Bentuk pipih bulat kecil di atas tampah.",
            "Jemur hingga kering total (1-2 hari terik), lalu goreng dalam minyak panas terendam hingga mekar meletup.",
          ],
          estimasi_biaya_rp: 12000,
          estimasi_porsi: 5,
          umur_simpan_hasil_hari: 30,
          potensi_harga_jual_rp: 30000,
          tips: "Pastikan rengginang benar-benar kering sebelum digoreng agar dapat mengembang sempurna dan renyah.",
        },
        {
          nama: "Bubur Gurih Sederhana",
          deskripsi:
            "Sarapan lembut dan hangat dengan kuah kaldu sederhana dari nasi sisa.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 25,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Air kaldu / air matang", jumlah: "600 ml" },
            { nama: "Garam & daun salam", jumlah: "1 sdt & 2 lembar" },
            { nama: "Kecap asin & bawang goreng", jumlah: "Secukupnya" },
          ],
          langkah: [
            "Didihkan air atau kaldu bersama daun salam dan garam.",
            "Masukkan nasi dingin, aduk berkala dengan api sedang.",
            "Gunakan sendok sayur untuk menekan butiran nasi hingga lumat dan mengental lembut.",
            "Sajikan hangat dengan taburan bawang goreng dan kecap asin.",
          ],
          estimasi_biaya_rp: 6000,
          estimasi_porsi: 2,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 16000,
          tips: "Aduk terus bagian dasar panci saat bubur mulai mengental agar tidak gosong.",
        },
      ],
      estimasi_dampak: {
        persen_bahan_terselamatkan: 90,
      },
    },
  },

  tempe: {
    keywords: ["tempe"],
    data: {
      bahan: {
        nama_standar: "Tempe",
        kategori: "protein_nabati",
        kondisi_input: "Mulai bau tajam agak semangit atau berbintik hitam wajar miselium, belum berlendir",
      },
      keamanan: {
        aman_dikonsumsi: "waspada",
        alasan:
          "Tempe yang mulai semangit masih aman diolah untuk masakan bercitarasa gurih pekat jika tidak berlendir basah dan tidak berbau busuk bangkai.",
        catatan:
          "Wajib dimasak hingga matang sempurna (suhu didih/goreng panas). Bila ada lendir licin tebal, segera buang.",
      },
      umur_simpan: {
        hari_min: 1,
        hari_maks: 2,
        urgensi: "segera_olah",
        tips_penyimpanan:
          "Kukus sebentar untuk menonaktifkan ragi jamur, lalu dinginkan dan simpan dalam wadah kedap di kulkas.",
      },
      pengawetan: [
        {
          metode: "Pengukusan lalu Pembekuan (Blanch & Freeze)",
          cocok_karena:
            "Mematikan aktivitas kapang Rhizopus sehingga tempe tidak terus membusuk atau berubah kehitaman.",
          langkah_singkat: [
            "Potong tempe sesuai porsi masakan.",
            "Kukus selama 7-10 menit di atas air mendidih.",
            "Tiriskan hingga dingin, masukkan ke wadah kedap, lalu bekukan di freezer.",
          ],
          tambahan_umur_hari: 30,
          alat: ["kukusan", "freezer"],
        },
        {
          metode: "Goreng Setengah Matang Beku",
          cocok_karena:
            "Mengurangi kadar air permukaan tempe sehingga bakteri pembusuk tidak berkembang.",
          langkah_singkat: [
            "Goreng tempe dalam minyak panas sebentar saja (1-2 menit) tanpa bumbu.",
            "Tiriskan minyak dan biarkan mencapai suhu ruang.",
            "Kemas rapat dalam kantong kedap dan simpan di kulkas/freezer.",
          ],
          tambahan_umur_hari: 14,
          alat: ["kompor", "freezer"],
        },
      ],
      ide_olahan: [
        {
          nama: "Tempe Orek Kering Manis Pedas",
          deskripsi:
            "Potongan tempe garing berbalut karamel gula merah dan aroma bumbu gurih pedas tahan lama.",
          asal_daerah: "Jawa",
          tingkat_kesulitan: "mudah",
          durasi_menit: 25,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Gula merah / kecap", jumlah: "50 gram" },
            { nama: "Bawang merah, bawang putih, cabai", jumlah: "6 butir" },
            { nama: "Daun salam & lengkuas", jumlah: "Secukupnya" },
            { nama: "Minyak goreng", jumlah: "200 ml" },
          ],
          langkah: [
            "Potong tempe ukuran korek api tipis.",
            "Goreng dalam minyak panas hingga kering dan garing kecokelatan, tiriskan.",
            "Tumis bumbu iris dan daun salam hingga harum, masukkan gula merah dan sedikit air asam hingga berkaramel berserabut.",
            "Matikan api, masukkan tempe goreng, lalu aduk cepat hingga seluruh tempe terbalut rata.",
          ],
          estimasi_biaya_rp: 12000,
          estimasi_porsi: 4,
          umur_simpan_hasil_hari: 7,
          potensi_harga_jual_rp: 28000,
          tips: "Masukkan tempe saat bumbu gula sudah berserabut kental dan gunakan api kecil agar hasil orek tetap garing renyah berhari-hari.",
        },
        {
          nama: "Keripik Tempe Renyah Gurih",
          deskripsi:
            "Irisan tempe super tipis dengan balutan tepung beras berbumbu ketumbar renyah bernilai jual tinggi.",
          asal_daerah: "Jawa Tengah (Ngawi / Malang)",
          tingkat_kesulitan: "sedang",
          durasi_menit: 30,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Tepung beras & tapioka", jumlah: "120 gram" },
            { nama: "Bawang putih, ketumbar, garam", jumlah: "Secukupnya" },
            { nama: "Daun jeruk iris halus", jumlah: "3 lembar" },
            { nama: "Minyak goreng", jumlah: "350 ml" },
          ],
          langkah: [
            "Iris tempe setipis mungkin menggunakan pisau tajam.",
            "Campur tepung beras, tapioka, bumbu halus, daun jeruk, dan air hingga adonan encer pas.",
            "Celupkan tempe satu per satu ke dalam adonan.",
            "Goreng dalam minyak banyak dan panas sedang hingga renyah kering tidak berminyak.",
          ],
          estimasi_biaya_rp: 15000,
          estimasi_porsi: 4,
          umur_simpan_hasil_hari: 14,
          potensi_harga_jual_rp: 35000,
          tips: "Tambahkan sedikit tepung tapioka ke tepung beras agar tekstur keripik tidak keras melainkan renyah rekah.",
        },
        {
          nama: "Tempe Mendoan Hangat",
          deskripsi:
            "Tempe berbalut adonan tepung daun bawang yang digoreng setengah matang disajikan dengan sambal kecap.",
          asal_daerah: "Banyumas, Jawa Tengah",
          tingkat_kesulitan: "mudah",
          durasi_menit: 15,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Tepung terigu & beras", jumlah: "100 gram" },
            { nama: "Daun bawang iris", jumlah: "2 batang" },
            { nama: "Kunyit, bawang putih, ketumbar", jumlah: "Secukupnya" },
            { nama: "Minyak goreng", jumlah: "200 ml" },
          ],
          langkah: [
            "Iris tempe tipis melebar.",
            "Buat adonan tepung gurih bersama bumbu halus dan irisan daun bawang segar.",
            "Celup tempe ke dalam adonan tepung.",
            "Goreng sebentar dalam minyak panas hingga adonan mengembang matang namun tetap basah lembut khas mendoan.",
          ],
          estimasi_biaya_rp: 10000,
          estimasi_porsi: 3,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 20000,
          tips: "Minyak harus cukup panas saat tempe dimasukkan agar tepung cepat matang tanpa menyerap minyak berlebihan.",
        },
      ],
      estimasi_dampak: {
        persen_bahan_terselamatkan: 95,
      },
    },
  },

  sayur: {
    keywords: [
      "bayam",
      "kangkung",
      "sawi",
      "selada",
      "sayur",
      "pakcoy",
      "kol",
      "brokoli",
    ],
    data: {
      bahan: {
        nama_standar: "Sayuran Hijau",
        kategori: "sayur",
        kondisi_input: "Mulai layu dan kehilangan kesegaran air, belum busuk berlendir",
      },
      keamanan: {
        aman_dikonsumsi: "aman",
        alasan:
          "Sayuran hijau yang layu hanya mengalami dehidrasi/kehilangan air dan masih sangat kaya serat serta nutrisi jika diolah matang.",
        catatan:
          "Pilah daun yang sudah menguning atau kecokelatan busuk. Cuci bersih dengan air mengalir sebelum dimasak.",
      },
      umur_simpan: {
        hari_min: 1,
        hari_maks: 2,
        urgensi: "segera_olah",
        tips_penyimpanan:
          "Potong pangkal batang lalu rendam sebentar di air dingin es selama 10-15 menit agar daun kembali segar tegak.",
      },
      pengawetan: [
        {
          metode: "Blansir dan Bekukan (Blanching & Freezing)",
          cocok_karena:
            "Menghentikan kerja enzim pembusuk serta mengunci warna hijau segar daun dan vitamin.",
          langkah_singkat: [
            "Rebus sayur dalam air mendidih selama 30-60 detik.",
            "Segera angkat dan rendam ke dalam air es untuk menghentikan pemanasan.",
            "Peras sisa air berlebih, bagi ke wadah kedap porsi, lalu bekukan.",
          ],
          tambahan_umur_hari: 30,
          alat: ["kompor", "freezer"],
        },
      ],
      ide_olahan: [
        {
          nama: "Bakwan Sayur Renyah (Bala-Bala)",
          deskripsi:
            "Gorengan renyah berpadu irisan sayuran hijau dan bumbu gurih yang selalu diminati pasar.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 20,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Tepung terigu & maizena", jumlah: "150 gram" },
            { nama: "Bawang putih & ketumbar", jumlah: "Secukupnya" },
            { nama: "Wortel parut (opsional)", jumlah: "1 buah" },
            { nama: "Minyak goreng", jumlah: "300 ml" },
          ],
          langkah: [
            "Iris kasar sayuran hijau yang telah dicuci bersih.",
            "Campur tepung, bumbu halus, garam, merica, dan sedikit air hingga adonan pekat kental.",
            "Masukkan sayuran ke dalam adonan, aduk rata.",
            "Sendokkan ke dalam minyak panas dan goreng hingga kuning kecokelatan renyah.",
          ],
          estimasi_biaya_rp: 10000,
          estimasi_porsi: 4,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 24000,
          tips: "Tambahkan sedikit tepung maizena pada adonan terigu agar bakwan tetap garing meski sudah dingin.",
        },
        {
          nama: "Tumis Sayur Hijau Bawang Gurih",
          deskripsi:
            "Olahan cepat saji dengan aroma harum bawang putih dan saus tiram yang sedap.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 10,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Bawang putih cincang", jumlah: "3 siung" },
            { nama: "Saus tiram & kecap asin", jumlah: "1 sdm" },
            { nama: "Minyak untuk menumis", jumlah: "2 sdm" },
          ],
          langkah: [
            "Panaskan minyak, tumis bawang putih cincang hingga harum kekuningan.",
            "Masukkan sayuran hijau, aduk cepat dengan api besar.",
            "Beri saus tiram, sedikit garam, dan sedikit air.",
            "Masak sebentar sekitar 2-3 menit agar sayuran tetap renyah bernutrisi.",
          ],
          estimasi_biaya_rp: 7000,
          estimasi_porsi: 2,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 18000,
          tips: "Masak dengan api besar dalam waktu singkat agar warna sayur tetap hijau cantik dan tidak layu berair berlebihan.",
        },
        {
          nama: "Pepes Sayur Hijau Tahu Gurih",
          deskripsi:
            "Olahan kukus harum daun pisang berpadu rempah tradisional yang sehat rendah minyak.",
          asal_daerah: "Sunda / Jawa",
          tingkat_kesulitan: "sedang",
          durasi_menit: 35,
          alat_dibutuhkan: ["kompor", "kukusan"],
          bahan_tambahan: [
            { nama: "Tahu putih lumat", jumlah: "2 kotak" },
            { nama: "Telur ayam", jumlah: "1 butir" },
            { nama: "Bawang merah, bawang putih, cabai, kemiri", jumlah: "Secukupnya" },
            { nama: "Daun pisang pembungkus", jumlah: "Secukupnya" },
          ],
          langkah: [
            "Campur sayuran hijau iris bersama tahu putih yang dilumatkan dan bumbu halus.",
            "Tambahkan kocokan telur, garam, dan kaldu bubuk, aduk merata.",
            "Bungkus adonan dengan daun pisang dan semat kedua ujungnya dengan lidi.",
            "Kukus selama 20-25 menit hingga matang padat beraroma wangi.",
          ],
          estimasi_biaya_rp: 14000,
          estimasi_porsi: 4,
          umur_simpan_hasil_hari: 2,
          potensi_harga_jual_rp: 32000,
          tips: "Bakar sebentar pepes yang telah dikukus di atas wajan tanpa minyak untuk mengeluarkan aroma asap harum daun pisang.",
        },
      ],
      estimasi_dampak: {
        persen_bahan_terselamatkan: 90,
      },
    },
  },

  singkong: {
    keywords: ["singkong", "ubi kayu", "cassava"],
    data: {
      bahan: {
        nama_standar: "Singkong",
        kategori: "karbohidrat",
        kondisi_input: "Segar atau berlebih pasca panen, kulit mulai mengering",
      },
      keamanan: {
        aman_dikonsumsi: "aman",
        alasan:
          "Singkong masih aman diolah selama dagingnya tidak memiliki garis biru kehitaman tebal tanda asam sianida atau busuk basah.",
        catatan:
          "Kupas tebal kulitnya dan rendam dalam air bersih selama 30 menit sebelum dimasak untuk menghilangkan residu getah alami.",
      },
      umur_simpan: {
        hari_min: 2,
        hari_maks: 5,
        urgensi: "segera_olah",
        tips_penyimpanan:
          "Kupas dan rendam seluruh umbi dalam wadah berisi air bersih, atau kukus terlebih dahulu sebelum disimpan dingin.",
      },
      pengawetan: [
        {
          metode: "Pengeringan Gaplek / Pembuatan Tepung Mocaf",
          cocok_karena:
            "Menurunkan kadar air hingga di bawah 12% sehingga awet disimpan berbulan-bulan untuk bahan baku UMKM.",
          langkah_singkat: [
            "Kupas dan cuci bersih singkong lalu potong tipis-tipis.",
            "Jemur di bawah sinar matahari selama 3-4 hari hingga keras kering.",
            "Giling menjadi tepung mocaf atau simpan dalam karung kering kedap.",
          ],
          tambahan_umur_hari: 180,
          alat: ["tanpa_alat"],
        },
        {
          metode: "Fermentasi Alami (Tape Singkong)",
          cocok_karena:
            "Aktivitas ragi menghasilkan asam dan alkohol alami yang mengawetkan umbi dan menambah citarasa manis probiotik.",
          langkah_singkat: [
            "Kukus singkong hingga matang empuk, lalu dinginkan sempurna.",
            "Taburkan ragi tape halus secara merata.",
            "Tutup rapat dalam wadah bersih beralas daun pisang selama 2-3 hari.",
          ],
          tambahan_umur_hari: 10,
          alat: ["kukusan"],
        },
      ],
      ide_olahan: [
        {
          nama: "Keripik Singkong Renyah Balado",
          deskripsi:
            "Camilan favorit bernilai ekonomi tinggi dengan kerenyahan rekah dan taburan bumbu balado gurih pedas.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "sedang",
          durasi_menit: 35,
          alat_dibutuhkan: ["kompor"],
          bahan_tambahan: [
            { nama: "Baking soda & garam (untuk rendaman)", jumlah: "1 sdt" },
            { nama: "Bumbu balado bubuk / bumbu tabur", jumlah: "50 gram" },
            { nama: "Minyak goreng", jumlah: "500 ml" },
          ],
          langkah: [
            "Iris tipis singkong menggunakan pisau pengiris tipis.",
            "Rendam irisan singkong dalam air hangat bergaram dan sedikit baking soda selama 15 menit, tiriskan.",
            "Goreng dalam minyak panas berlimpah dengan api sedang hingga kering kekuningan.",
            "Tiriskan minyak lalu aduk rata bersama bumbu balado tabur.",
          ],
          estimasi_biaya_rp: 15000,
          estimasi_porsi: 6,
          umur_simpan_hasil_hari: 30,
          potensi_harga_jual_rp: 45000,
          tips: "Perendaman air hangat ber-baking soda membuat keripik singkong renyah empuk dan tidak keras saat digigit.",
        },
        {
          nama: "Getuk Lindri Singkong Manis",
          deskripsi:
            "Jajanan pasar tradisional bertekstur lembut legit dengan taburan kelapa parut gurih.",
          asal_daerah: "Jawa Tengah",
          tingkat_kesulitan: "sedang",
          durasi_menit: 45,
          alat_dibutuhkan: ["kompor", "kukusan"],
          bahan_tambahan: [
            { nama: "Gula pasir", jumlah: "100 gram" },
            { nama: "Margarin", jumlah: "2 sdm" },
            { nama: "Kelapa parut kukus gurih", jumlah: "100 gram" },
          ],
          langkah: [
            "Kukus potongan singkong hingga empuk merekah.",
            "Tumbuk selagi panas bersama gula dan margarin hingga halus kalis.",
            "Cetak memanjang berserat menggunakan cetakan getuk lindri.",
            "Sajikan dengan taburan kelapa parut yang telah dikukus dengan sedikit garam.",
          ],
          estimasi_biaya_rp: 12000,
          estimasi_porsi: 5,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 30000,
          tips: "Tumbuk singkong saat masih panas agar teksturnya mudah halus dan gula larut menyatu sempurna.",
        },
        {
          nama: "Singkong Goreng Merekah Gurih Bawang",
          deskripsi:
            "Singkong goreng empuk dengan bagian luar renyah mekar dan aroma bawang putih gurih sedap.",
          asal_daerah: "Nusantara",
          tingkat_kesulitan: "mudah",
          durasi_menit: 30,
          alat_dibutuhkan: ["kompor", "kukusan"],
          bahan_tambahan: [
            { nama: "Bawang putih geprek", jumlah: "4 siung" },
            { nama: "Garam & ketumbar", jumlah: "1 sdm" },
            { nama: "Air es dingin", jumlah: "500 ml" },
            { nama: "Minyak goreng", jumlah: "350 ml" },
          ],
          langkah: [
            "Kukus singkong hingga empuk matang.",
            "Segera celupkan singkong panas ke dalam wadah berisi air es berbumbu bawang putih dan ketumbar hingga merekah.",
            "Tiriskan singkong, lalu goreng dalam minyak panas hingga berkulit renyah keemasan.",
            "Angkat dan sajikan selagi hangat.",
          ],
          estimasi_biaya_rp: 10000,
          estimasi_porsi: 4,
          umur_simpan_hasil_hari: 1,
          potensi_harga_jual_rp: 25000,
          tips: "Perbedaan suhu drastis antara singkong panas yang masuk ke air es membuat serat singkong merekah meletup sempurna.",
        },
      ],
      estimasi_dampak: {
        persen_bahan_terselamatkan: 95,
      },
    },
  },
};

// 6. Template TIDAK_AMAN
export function buatTidakAman(
  input: InputAnalisis,
  alasanTambahan?: string
): HasilAnalisis {
  const namaBahan =
    input.nama.trim().charAt(0).toUpperCase() + input.nama.trim().slice(1);
  return {
    bahan: {
      nama_standar: namaBahan,
      kategori: "lainnya",
      kondisi_input: input.kondisi,
    },
    keamanan: {
      aman_dikonsumsi: "tidak_aman",
      alasan:
        alasanTambahan ||
        `Bahan ${namaBahan} menunjukkan tanda pembusukan, jamur berbahaya, lendir, atau bau menyengat yang mengindikasikan adanya mikroorganisme patogen dan racun. Mengonsumsi bahan ini berisiko tinggi menyebabkan keracunan makanan.`,
      catatan:
        "JANGAN dikonsumsi ataupun diolah agar tersamarkan. Segera bungkus rapat dan buang ke tempat sampah organik atau jadikan kompos non-pangan. Cuci tangan dan peralatan yang sempat kontak dengan sabun dan air mengalir.",
    },
    umur_simpan: {
      hari_min: 0,
      hari_maks: 0,
      urgensi: "kritis",
      tips_penyimpanan:
        "Bahan sudah rusak total dan tidak layak disimpan lagi. Segera musnahkan dari dapur agar tidak mencemari bahan pangan lain.",
    },
    pengawetan: [],
    ide_olahan: [],
    estimasi_dampak: {
      persen_bahan_terselamatkan: 0,
    },
  };
}

// 7. Template BUKAN_PANGAN
export function buatBukanPangan(input: InputAnalisis): HasilAnalisis {
  const namaBahan =
    input.nama.trim().charAt(0).toUpperCase() + input.nama.trim().slice(1);
  return {
    bahan: {
      nama_standar: namaBahan,
      kategori: "lainnya",
      kondisi_input: input.kondisi,
    },
    keamanan: {
      aman_dikonsumsi: "tidak_aman",
      alasan: `Item "${namaBahan}" BUKAN merupakan bahan pangan yang dapat dikonsumsi manusia. Bahan non-pangan tidak memiliki nilai gizi dan berbahaya bagi kesehatan jika tertelan.`,
      catatan:
        "Hindarkan dari jangkauan anak-anak dan simpan terpisah dari persediaan makanan rumah tangga. Gunakan atau daur ulang sesuai peruntukan non-pangan.",
    },
    umur_simpan: {
      hari_min: 0,
      hari_maks: 0,
      urgensi: "kritis",
      tips_penyimpanan:
        "Bahan ini bukan makanan, tidak berlaku masa simpan pangan konsumsi.",
    },
    pengawetan: [],
    ide_olahan: [],
    estimasi_dampak: {
      persen_bahan_terselamatkan: 0,
    },
  };
}

// 8. Template GENERIK
export function buatGenerik(input: InputAnalisis): HasilAnalisis {
  const namaBahan =
    input.nama.trim().charAt(0).toUpperCase() + input.nama.trim().slice(1);
  return {
    bahan: {
      nama_standar: namaBahan,
      kategori: "lainnya",
      kondisi_input: input.kondisi,
    },
    keamanan: {
      aman_dikonsumsi: "waspada",
      alasan: `Hasil analisis untuk ${namaBahan} menggunakan estimasi cerdas umum (mode contoh offline). Pastikan bahan tidak berlendir, tidak berbau busuk tajam, dan tidak berjamur sebelum diolah.`,
      catatan:
        "Lakukan pemeriksaan visual dan aroma sebelum memasak. Jika aroma masam/busuk menyengat atau berlendir, jangan dikonsumsi.",
    },
    umur_simpan: {
      hari_min: 1,
      hari_maks: 3,
      urgensi: "segera_olah",
      tips_penyimpanan:
        "Simpan dalam wadah kedap udara di lemari pendingin (chiller) atau tempat kering sejuk terlindung dari sinar matahari langsung.",
    },
    pengawetan: [
      {
        metode: "Pembekuan Bersih (Freezing)",
        cocok_karena:
          "Metode paling aman dan serbaguna untuk memperlambat pembusukan hampir semua jenis bahan pangan.",
        langkah_singkat: [
          "Bersihkan bahan dari kotoran dan potong sesuai ukuran masak.",
          "Kemas dalam wadah kedap atau kantong plastik ziplock kedap udara.",
          "Simpan dalam freezer pada suhu di bawah -18°C.",
        ],
        tambahan_umur_hari: 30,
        alat: ["freezer"],
      },
      {
        metode: "Pengeringan atau Penjemuran (Dehydration)",
        cocok_karena:
          "Mengurangi kadar air bahan sehingga bakteri dan jamur tidak dapat berkembang biak.",
        langkah_singkat: [
          "Iris bahan tipis-tipis secara merata.",
          "Jemur di bawah sinar matahari langsung beralas bersih atau gunakan oven suhu rendah (60°C).",
          "Simpan dalam toples rapat setelah dingin sempurna.",
        ],
        tambahan_umur_hari: 45,
        alat: ["tanpa_alat"],
      },
      {
        metode: "Pengasinan atau Marinasi Bumbu Gurih",
        cocok_karena:
          "Garam berfungsi sebagai pengawet alami yang menarik cairan keluar dan menghambat mikroba perusak.",
        langkah_singkat: [
          "Taburkan garam secukupnya pada permukaan bahan secara merata.",
          "Simpan dalam wadah tertutup di lemari es.",
          "Cuci atau bilas sedikit saat hendak diolah agar rasa tidak terlalu asin.",
        ],
        tambahan_umur_hari: 7,
        alat: ["tanpa_alat"],
      },
    ],
    ide_olahan: [
      {
        nama: `Tumis Gurih Aneka Bumbu ${namaBahan}`,
        deskripsi:
          "Olahan tumisan cepat saji dengan paduan bawang merah, bawang putih, dan kecap yang gurih nikmat.",
        asal_daerah: "Nusantara",
        tingkat_kesulitan: "mudah",
        durasi_menit: 15,
        alat_dibutuhkan: ["kompor"],
        bahan_tambahan: [
          { nama: "Bawang merah & putih", jumlah: "4 siung" },
          { nama: "Garam, gula, dan merica", jumlah: "Secukupnya" },
          { nama: "Minyak goreng", jumlah: "2 sdm" },
        ],
        langkah: [
          "Cuci bersih bahan dan potong sesuai selera.",
          "Tumis irisan bawang hingga harum di wajan.",
          "Masukkan bahan pangan, bumbui dengan garam, gula, dan merica.",
          "Aduk merata hingga matang dan sajikan hangat.",
        ],
        estimasi_biaya_rp: 8000,
        estimasi_porsi: 3,
        umur_simpan_hasil_hari: 1,
        potensi_harga_jual_rp: 18000,
        tips: "Pastikan bahan dipanaskan sampai matang merata untuk menjamin keamanan pangan.",
      },
      {
        nama: `Gorengan Krispi Tepung Bumbu ${namaBahan}`,
        deskripsi:
          "Camilan goreng renyah berbalut adonan tepung berbumbu gurih yang disukai keluarga.",
        asal_daerah: "Nusantara",
        tingkat_kesulitan: "mudah",
        durasi_menit: 20,
        alat_dibutuhkan: ["kompor"],
        bahan_tambahan: [
          { nama: "Tepung bumbu serbaguna", jumlah: "100 gram" },
          { nama: "Air es", jumlah: "Secukupnya" },
          { nama: "Minyak goreng", jumlah: "250 ml" },
        ],
        langkah: [
          "Potong bahan dalam ukuran pas untuk gorengan.",
          "Celupkan bahan ke dalam larutan tepung bumbu.",
          "Goreng dalam minyak panas hingga kuning keemasan dan renyah.",
          "Angkat dan tiriskan minyak sebelum dihidangkan.",
        ],
        estimasi_biaya_rp: 10000,
        estimasi_porsi: 4,
        umur_simpan_hasil_hari: 1,
        potensi_harga_jual_rp: 22000,
        tips: "Gunakan minyak yang cukup panas agar gorengan tidak menyerap minyak berlebihan.",
      },
      {
        nama: `Keripik Renyah Kering ${namaBahan}`,
        deskripsi:
          "Olahan kering garing yang tahan simpan lebih lama dan memiliki potensi nilai jual camilan.",
        asal_daerah: "Nusantara",
        tingkat_kesulitan: "sedang",
        durasi_menit: 30,
        alat_dibutuhkan: ["kompor"],
        bahan_tambahan: [
          { nama: "Bumbu tabur gurih / garam", jumlah: "Secukupnya" },
          { nama: "Minyak goreng", jumlah: "300 ml" },
        ],
        langkah: [
          "Iris bahan tipis-tipis secara seragam.",
          "Goreng perlahan dalam minyak panas sedang hingga kadar air hilang dan kering garing.",
          "Tiriskan dan taburkan bumbu gurih merata setelah dingin.",
          "Simpan dalam toples rapat.",
        ],
        estimasi_biaya_rp: 12000,
        estimasi_porsi: 4,
        umur_simpan_hasil_hari: 14,
        potensi_harga_jual_rp: 28000,
        tips: "Simpan dalam toples kedap udara segera setelah dingin agar kerenyahannya terjaga.",
      },
    ],
    estimasi_dampak: {
      persen_bahan_terselamatkan: 85,
    },
  };
}
