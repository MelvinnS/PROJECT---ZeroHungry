export type KategoriOlahan = "pisang" | "nasi" | "tempe" | "singkong";

export type TingkatKesulitan = "Sangat Mudah" | "Mudah" | "Sedang";

export interface Olahan {
  slug: string;
  nama: string;
  bahanSumber: string;
  kategori: KategoriOlahan;
  deskripsi: string;
  durasiLabel: string;
  kesulitan: TingkatKesulitan;
  porsi: number;
  bahan: string[];
  langkah: string[];
  gambar: string;
}

export const KATEGORI_FILTER = [
  "Semua",
  "Pisang",
  "Nasi",
  "Tempe",
  "Singkong",
] as const;

export type KategoriFilter = (typeof KATEGORI_FILTER)[number];

export const OLAHAN: Olahan[] = [
  {
    slug: "pisang-goreng-madu-krispi",
    nama: "Pisang Goreng Madu Krispi",
    bahanSumber: "Pisang kepok sisa",
    kategori: "pisang",
    deskripsi:
      "Camilan manis renyah berlapis karamel madu alami dari pisang kepok yang terlalu matang.",
    durasiLabel: "20 menit",
    kesulitan: "Sangat Mudah",
    porsi: 4,
    bahan: [
      "6 buah pisang kepok sisa matang",
      "100 gram tepung beras",
      "30 gram tepung terigu",
      "2 sdm madu murni",
      "1/2 sdt garam",
      "150 ml air dingin",
      "Minyak goreng secukupnya",
    ],
    langkah: [
      "Kupas pisang kepok lalu belah membentuk kipas atau potong serong sesuai selera.",
      "Campurkan tepung beras, terigu, garam, madu, dan air dingin hingga membentuk adonan celup yang kental.",
      "Celupkan potongan pisang ke dalam adonan tepung hingga terlumuri merata.",
      "Goreng dalam minyak panas sedang sampai kuning keemasan dan renyah, lalu tiriskan.",
    ],
    gambar: "/images/katalog/pisang-goreng-madu-krispi.jpg",
  },
  {
    slug: "kerupuk-nasi-renyah",
    nama: "Kerupuk Nasi Renyah",
    bahanSumber: "Nasi putih semalam",
    kategori: "nasi",
    deskripsi:
      "Olahan kerupuk gurih mekar berbumbu ketumbar dan bawang dari nasi putih sisa semalam.",
    durasiLabel: "35 menit",
    kesulitan: "Mudah",
    porsi: 6,
    bahan: [
      "2 mangkuk nasi putih sisa semalam",
      "150 gram tepung tapioka",
      "4 siung bawang putih (haluskan)",
      "1 sdt ketumbar bubuk",
      "1 sdt garam dan kaldu bubuk",
      "1 batang daun bawang (iris halus)",
      "Minyak untuk menggoreng",
    ],
    langkah: [
      "Lumatkan nasi putih sisa bersama bawang putih halus, ketumbar, garam, dan sedikit air hangat.",
      "Campurkan tepung tapioka dan irisan daun bawang ke dalam adonan nasi hingga kalis dapat dibentuk.",
      "Bentuk adonan menjadi lonjongan silinder, kukus selama 20 menit hingga matang kenyal, lalu dinginkan di kulkas.",
      "Iris tipis adonan yang mengeras, jemur di bawah sinar matahari hingga kering garing.",
      "Goreng kerupuk kering dalam minyak panas melimpah hingga mekar renyah.",
    ],
    gambar: "/images/katalog/kerupuk-nasi-renyah.jpg",
  },
  {
    slug: "mendol-tempe-gurih-daun",
    nama: "Mendol Tempe Gurih Daun",
    bahanSumber: "Tempe semangit",
    kategori: "tempe",
    deskripsi:
      "Lauk tradisional khas Jawa Timur beraroma daun jeruk dan kencur dari tempe yang mulai semangit.",
    durasiLabel: "25 menit",
    kesulitan: "Sangat Mudah",
    porsi: 4,
    bahan: [
      "1 papan tempe semangit (sekitar 300 gram)",
      "4 lembar daun jeruk purut (buang tulang, iris halus)",
      "3 siung bawang putih",
      "2 cm kencur segar",
      "3 buah cabai rawit merah",
      "1 sdt garam dan 1/2 sdt gula pasir",
      "Minyak goreng secukupnya",
    ],
    langkah: [
      "Kukus tempe semangit sebentar selama 5 menit untuk memastikan higienitasnya, lalu tiriskan.",
      "Ulek halus bawang putih, kencur, cabai rawit, garam, dan gula.",
      "Masukkan tempe ke dalam cobek, tumbuk kasar bersama bumbu halus dan irisan daun jeruk hingga tercampur rata.",
      "Kepal-kepal adonan membentuk lonjong padat agar tidak hancur saat digoreng.",
      "Goreng dalam minyak panas dengan api sedang hingga bagian luar berkulit kecokelatan renyah.",
    ],
    gambar: "/images/katalog/mendol-tempe-gurih-daun.jpg",
  },
  {
    slug: "tepung-singkong-gurih",
    nama: "Tepung Singkong Gurih",
    bahanSumber: "Singkong sisa panen",
    kategori: "singkong",
    deskripsi:
      "Tepung singkong berbumbu siap pakai untuk aneka baluran gorengan renyah tahan lama.",
    durasiLabel: "40 menit",
    kesulitan: "Sedang",
    porsi: 8,
    bahan: [
      "1 kg singkong sisa panen (kupas bersih)",
      "2 sdm bawang putih bubuk",
      "1 sdt ketumbar bubuk",
      "1 sdm garam halus",
      "1 sdt kaldu jamur",
    ],
    langkah: [
      "Parut halus singkong yang telah dicuci bersih menggunakan parutan kelapa atau food processor.",
      "Peras air singkong menggunakan kain bersih, endapkan saripatinya dan buang air getahnya.",
      "Sangrai ampas singkong bersama pati dan bumbu halus di wajan kering dengan api sangat kecil hingga kering remah.",
      "Blender singkong kering hingga menjadi butiran tepung halus, lalu ayak merata.",
      "Simpan dalam toples kaca kedap udara untuk bahan baluran gorengan krispi.",
    ],
    gambar: "/images/katalog/tepung-singkong-gurih.jpg",
  },
  {
    slug: "bolu-pisang-kukus-lembut",
    nama: "Bolu Pisang Kukus Lembut",
    bahanSumber: "Pisang sangat matang",
    kategori: "pisang",
    deskripsi:
      "Bolu harum legit bertekstur lembut tanpa mixer, memanfaatkan rasa manis pekat pisang kematangan.",
    durasiLabel: "40 menit",
    kesulitan: "Mudah",
    porsi: 8,
    bahan: [
      "4 buah pisang sangat matang (lumatkan)",
      "2 butir telur ayam",
      "6 sdm gula pasir",
      "11 sdm tepung terigu serbaguna",
      "1/2 sdt baking powder",
      "1/2 sdt baking soda",
      "6 sdm minyak sayur",
      "1/4 sdt garam dan vanili bubuk",
    ],
    langkah: [
      "Lumatkan pisang menggunakan garpu hingga halus merata.",
      "Kocok telur dan gula pasir menggunakan whisk hingga gula larut.",
      "Masukkan lumatkan pisang, tepung terigu, baking powder, baking soda, dan vanili yang sudah diayak.",
      "Tambahkan minyak sayur, aduk lipat perlahan sampai adonan tercampur rata tanpa gelembung.",
      "Tuang adonan ke dalam loyang beralas margarin, kukus selama 30 menit hingga matang saat dites tusuk.",
    ],
    gambar: "/images/katalog/bolu-pisang-kukus-lembut.jpg",
  },
  {
    slug: "nasi-bakar-jamur-kemangi",
    nama: "Nasi Bakar Jamur Kemangi",
    bahanSumber: "Nasi dingin kemarin",
    kategori: "nasi",
    deskripsi:
      "Nasi gurih berbalut daun pisang dengan isian tumis jamur pedas wangi kemangi yang menggugah selera.",
    durasiLabel: "30 menit",
    kesulitan: "Mudah",
    porsi: 3,
    bahan: [
      "3 porsi nasi dingin kemarin",
      "150 gram jamur tiram (suwir bersih)",
      "1 ikat daun kemangi segar",
      "4 siung bawang merah & 2 siung bawang putih (iris)",
      "5 buah cabai rawit merah",
      "1 batang serai & 2 lembar daun salam",
      "Garam, gula, dan kaldu bubuk secukupnya",
      "Daun pisang dan lidi penyemat",
    ],
    langkah: [
      "Tumis bawang merah, bawang putih, cabai, serai, dan daun salam hingga harum.",
      "Masukkan suwiran jamur tiram, bumbui dengan garam, gula, dan kaldu bubuk, masak hingga jamur layu.",
      "Matikan api, masukkan daun kemangi dan nasi dingin, aduk rata hingga bumbu meresap ke nasi.",
      "Bungkus porsi nasi di atas daun pisang, gulung padat dan semat kedua ujungnya dengan lidi.",
      "Bakar di atas teflon atau wajan datar bolak-balik hingga aroma daun pisang wangi terbakar.",
    ],
    gambar: "/images/katalog/nasi-bakar-jamur-kemangi.jpg",
  },
  {
    slug: "nugget-tempe-sayur",
    nama: "Nugget Tempe Sayur",
    bahanSumber: "Tempe potongan sisa",
    kategori: "tempe",
    deskripsi:
      "Nugget sehat bernutrisi tinggi ramah anak dari potongan tempe sisa dipadu serutan wortel dan daun bawang.",
    durasiLabel: "35 menit",
    kesulitan: "Sangat Mudah",
    porsi: 5,
    bahan: [
      "250 gram tempe potongan sisa (kukus dan lumatkan)",
      "1 buah wortel (serut halus)",
      "1 batang daun bawang (iris halus)",
      "1 butir telur ayam",
      "3 sdm tepung terigu & 2 sdm tepung tapioka",
      "3 siung bawang putih halus",
      "1 sdt garam, merica, dan kaldu bubuk",
      "Tepung panir secukupnya untuk baluran",
    ],
    langkah: [
      "Campurkan tempe lumat, wortel serut, daun bawang, telur, tepung, dan bumbu halus hingga kalis.",
      "Ratakan adonan ke dalam loyang tahan panas, kukus selama 20 menit hingga matang padat.",
      "Setelah dingin, potong-potong adonan nugget sesuai ukuran selera.",
      "Celupkan potongan nugget ke larutan terigu cair, lalu gulingkan ke tepung panir sampai tertutup rata.",
      "Goreng dalam minyak panas sampai kuning keemasan atau simpan di freezer sebagai frozen food.",
    ],
    gambar: "/images/katalog/nugget-tempe-sayur.jpg",
  },
  {
    slug: "keripik-singkong-balado",
    nama: "Keripik Singkong Balado",
    bahanSumber: "Singkong kupas",
    kategori: "singkong",
    deskripsi:
      "Keripik singkong renyah berbalut bumbu balado pedas manis basah karamel yang lezat.",
    durasiLabel: "30 menit",
    kesulitan: "Mudah",
    porsi: 5,
    bahan: [
      "500 gram singkong kupas (iris tipis mandoline)",
      "5 buah cabai merah keriting & 3 cabai rawit (blender halus)",
      "4 siung bawang merah & 2 siung bawang putih (haluskan)",
      "50 gram gula merah sisir",
      "1 sdm air asam jawa",
      "1/2 sdt garam",
      "Minyak goreng secukupnya",
    ],
    langkah: [
      "Goreng irisan singkong dalam minyak panas terendam hingga kering garing renyah, lalu tiriskan.",
      "Tumis cabai halus dan bawang hingga harum dan matang sempurna.",
      "Tambahkan gula merah, air asam jawa, dan garam, masak dengan api kecil hingga bumbu mengental berkaramel berserabut.",
      "Matikan api, biarkan uap panas bumbu sedikit turun.",
      "Masukkan keripik singkong goreng, aduk cepat dan rata hingga seluruh keripik terselimuti bumbu balado.",
    ],
    gambar: "/images/katalog/keripik-singkong-balado.jpg",
  },
  {
    slug: "keripik-singkong-renyah",
    nama: "Keripik Singkong Renyah",
    bahanSumber: "Singkong sisa panen atau dapur",
    kategori: "singkong",
    deskripsi:
      "Olahan renyah gurih dari singkong sisa panen atau dapur yang mudah dibuat dan tahan lama.",
    durasiLabel: "45 menit",
    kesulitan: "Mudah",
    porsi: 6,
    bahan: [
      "1 kg singkong sisa (kupas dan cuci bersih)",
      "1 sdt garam dapur",
      "1/2 sdt ketumbar bubuk",
      "3 siung bawang putih (haluskan)",
      "500 ml air es untuk merendam",
      "Minyak goreng secukupnya",
    ],
    langkah: [
      "Iris singkong tipis-tipis merata menggunakan pisau tajam atau mandoline.",
      "Rendam irisan singkong dalam air es yang dicampur bawang putih, garam, dan ketumbar selama 15 menit.",
      "Tiriskan singkong hingga benar-benar kering dari sisa air rendaman.",
      "Panaskan minyak di wajan dengan api sedang, goreng irisan singkong sedikit demi sedikit sampai kuning keemasan.",
      "Angkat dan tiriskan minyak, biarkan dingin sebelum disimpan dalam toples kedap udara.",
    ],
    gambar: "/images/katalog/keripik-singkong-renyah.jpg",
  },
  {
    slug: "keripik-kulit-pisang-krispi",
    nama: "Keripik Kulit Pisang Krispi",
    bahanSumber: "Kulit pisang sisa",
    kategori: "pisang",
    deskripsi:
      "Camilan inovatif zero-waste memanfaatkan kulit pisang kepok bersih yang direbus dan digoreng renyah kaya serat.",
    durasiLabel: "35 menit",
    kesulitan: "Mudah",
    porsi: 4,
    bahan: [
      "Kulit dari 6 buah pisang kepok bersih (cuci rendam air garam)",
      "100 gram tepung beras",
      "30 gram tepung tapioka",
      "2 siung bawang putih & 1/2 sdt ketumbar (haluskan)",
      "1/2 sdt garam dan kaldu bubuk",
      "Minyak goreng secukupnya",
    ],
    langkah: [
      "Cuci bersih kulit pisang kepok, kerik bagian dalam putihnya sedikit, lalu potong memanjang ukuran korek api.",
      "Rebus irisan kulit pisang selama 5 menit dengan sedikit garam untuk menghilangkan getah dan rasa getir, lalu tiriskan.",
      "Campurkan tepung beras, tepung tapioka, bumbu halus, dan air hingga menjadi adonan tepung cair pas.",
      "Celupkan kulit pisang rebus ke dalam adonan tepung.",
      "Goreng dalam minyak panas sedang sampai kering renyah keemasan, tiriskan dan simpan di wadah kedap.",
    ],
    gambar: "/images/katalog/keripik-kulit-pisang-krispi.jpg",
  },
  {
    slug: "tepung-singkong-serbaguna",
    nama: "Tepung Singkong Serbaguna",
    bahanSumber: "Singkong sisa panen",
    kategori: "singkong",
    deskripsi:
      "Tepung mocaf bebas gluten bernilai jual tinggi melalui fermentasi alami dan penjemuran singkong sisa.",
    durasiLabel: "2 hari",
    kesulitan: "Sedang",
    porsi: 10,
    bahan: [
      "2 kg singkong sisa panen (kupas dan cuci bersih)",
      "Air bersih secukupnya untuk perendaman fermentasi",
    ],
    langkah: [
      "Iris tipis singkong kupas menggunakan pisau atau alat perajang umbi.",
      "Rendam irisan singkong dalam air bersih tertutup selama 24-36 jam agar terjadi fermentasi alami pelunakan serat.",
      "Bilas singkong fermentasi dengan air mengalir hingga aroma asam berkurang, lalu tiriskan.",
      "Jemur irisan singkong (chips) di bawah terik matahari selama 1-2 hari hingga kering getas patah.",
      "Giling chips singkong kering menggunakan blender kering atau mesin penepung, lalu ayak hingga didapat tepung mocaf halus.",
    ],
    gambar: "/images/katalog/tepung-singkong-serbaguna.jpg",
  },
  {
    slug: "nugget-batang-bayam-tempe",
    nama: "Nugget Batang Bayam & Tempe",
    bahanSumber: "Batang bayam dan tempe sisa",
    kategori: "tempe",
    deskripsi:
      "Pemanfaatan batang bayam yang kerap terbuang dicincang renyah bersama tempe gurih bergizi.",
    durasiLabel: "40 menit",
    kesulitan: "Mudah",
    porsi: 4,
    bahan: [
      "100 gram batang bayam sisa (cuci bersih dan cincang halus)",
      "200 gram tempe sisa (kukus lalu haluskan)",
      "1 butir telur ayam",
      "4 sdm tepung terigu & 2 sdm maizena",
      "3 siung bawang putih & 2 butir bawang merah (haluskan)",
      "1 sdt garam, gula, dan merica bubuk",
      "Tepung panir untuk baluran luar",
    ],
    langkah: [
      "Campurkan tempe halus bersama cincangan batang bayam, telur, tepung, dan bumbu halus hingga rata.",
      "Tuang adonan ke loyang tahan panas yang diolesi minyak, kukus selama 20 menit hingga matang kokoh.",
      "Biarkan adonan dingin, potong kotak-kotak seukuran nugget.",
      "Celupkan potongan nugget ke larutan tepung terigu encer, lalu balurkan merata ke tepung panir.",
      "Goreng dalam minyak panas api sedang sampai renyah garing keemasan.",
    ],
    gambar: "/images/katalog/nugget-batang-bayam-tempe.jpg",
  },
];

export function getOlahanBySlug(slug: string): Olahan | undefined {
  return OLAHAN.find((item) => item.slug === slug);
}
