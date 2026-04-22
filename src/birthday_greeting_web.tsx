import { useEffect, useRef, useState } from "react";

type PageKey = "home" | "wish" | "gallery" | "surprise";

type WishItem = {
  title: string;
  text: string;
  emoji: string;
};

const WISHES: WishItem[] = [
  {
    title: "Hari Istimewa",
    text: "Selamat ulang tahun bocil. Semoga hari ini dipenuhi tawa, hadiah manis, dan momen yang selalu ingin kamu kenang.",
    emoji: "🎂",
  },
  {
    title: "Doa Baik",
    text: "Semoga setiap langkahmu dimudahkan, setiap rencanamu dilancarkan, dan setiap harimu dipenuhi kebahagiaan yang tulus.",
    emoji: "✨",
  },
  {
    title: "Untuk Nabila",
    text: "Terima kasih sudah bertahan sejauh ini. Semoga semua hal baik selalu menemukan jalan menuju kamu.",
    emoji: "💖",
  },
];

const PHOTO_SLIDES = [
  "/foto-1.jpeg",
  "/foto-2.jpeg",
  "/foto-3.jpeg",
  "/foto-4.jpeg",
  "/foto-5.jpeg",
  "/foto-6.jpeg"
];

const SPECIAL_MOMENTS: string[] = [
  "Semoga semua impianmu satu per satu jadi nyata.",
  "Semoga hatimu selalu tenang dan bahagiamu bertambah setiap hari.",
  "Semoga umur baru ini membawa banyak keberuntungan.",
  "Semoga kamu selalu dikelilingi orang-orang baik.",
];

function FloatingItems() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce opacity-60"
          style={{
            left: `${(i * 11) % 100}%`,
            top: `${(i * 19) % 100}%`,
            animationDelay: `${i * 0.18}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        >
          <span className="text-xl sm:text-2xl md:text-3xl">
            {i % 4 === 0 ? "🎈" : i % 4 === 1 ? "✨" : i % 4 === 2 ? "🌸" : "💝"}
          </span>
        </div>
      ))}
    </div>
  );
}

function AudioLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm text-center text-white">
        <div className="mb-4 animate-pulse text-5xl">🎧</div>
        <p className="mb-5 text-lg font-semibold sm:text-xl">Menyiapkan musik spesial...</p>
        <div className="mb-4 flex h-12 items-end justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="w-3 rounded-full bg-pink-300/90 animate-pulse"
              style={{
                height: `${20 + (i % 3) * 8}px`,
                animationDelay: `${i * 0.18}s`,
                animationDuration: `${0.8 + i * 0.12}s`,
              }}
            />
          ))}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-pink-300 via-rose-300 to-yellow-200" />
        </div>
        <p className="mt-3 text-sm text-white/80">Tunggu sebentar, suasananya lagi disiapkan ✨</p>
      </div>
    </div>
  );
}

export default function BirthdayGreetingWeb() {
  const [page, setPage] = useState<PageKey>("home");
  const [entered, setEntered] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [audioStartedMuted, setAudioStartedMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const popRef = useRef<HTMLAudioElement | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const startBackgroundMusic = async (preferMuted = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.6;
      audio.muted = preferMuted;
      await audio.play();
      setAudioUnlocked(!preferMuted);
      setAudioStartedMuted(preferMuted);
      setAudioFailed(false);
      setAudioReady(true);
    } catch {
      setAudioFailed(true);
      setAudioReady(true);
    }
  };

  const tryUnmuteAfterDelay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    window.setTimeout(() => {
      try {
        audio.muted = false;
        audio.volume = 0.6;
        setAudioUnlocked(true);
        setAudioStartedMuted(false);
      } catch {
        // browser bisa tetap menahan unmute tanpa gesture
      }
    }, 900);
  };

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setAudioReady(true);
    }, 1200);

    const initAutoPlay = async () => {
      try {
        await startBackgroundMusic(true);
        tryUnmuteAfterDelay();
      } catch {
        setAudioReady(true);
      }
    };

    initAutoPlay().catch(() => {});

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (page !== "surprise") return;

    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % PHOTO_SLIDES.length);
    }, 2500);

    return () => {
      window.clearInterval(timer);
    };
  }, [page]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % PHOTO_SLIDES.length);
    }, 2500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const handleClickEffect = (e: React.MouseEvent<HTMLDivElement>) => {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.style.position = "fixed";
    heart.style.left = `${e.clientX - 10}px`;
    heart.style.top = `${e.clientY - 10}px`;
    heart.style.fontSize = "22px";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "9999";
    heart.style.animation = "fadeUp 900ms ease-out forwards";
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 900);
  };

  const triggerConfetti = () => {
    const pop = popRef.current;
    if (pop) {
      pop.currentTime = 0;
      pop.play().catch(() => {});
    }

    for (let i = 0; i < 80; i += 1) {
      const piece = document.createElement("div");
      const useEmoji = i % 10 === 0;
      const emojiList = ["🎉", "✨", "🎊", "💖"];

      piece.style.position = "fixed";
      piece.style.top = "-20px";
      piece.style.left = `${Math.random() * window.innerWidth}px`;
      piece.style.pointerEvents = "none";
      piece.style.zIndex = "9999";
      piece.style.animation = `fall ${2 + Math.random() * 1.8}s linear forwards`;

      if (useEmoji) {
        piece.textContent = emojiList[i % emojiList.length];
        piece.style.fontSize = `${16 + Math.random() * 14}px`;
      } else {
        piece.style.width = `${6 + Math.random() * 10}px`;
        piece.style.height = `${10 + Math.random() * 14}px`;
        piece.style.borderRadius = "3px";
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.background = ["#f472b6", "#fb7185", "#facc15", "#60a5fa", "#34d399"][i % 5];
        piece.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
      }

      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4200);
    }
  };

  return (
    <div
      onClick={(e) => {
        handleClickEffect(e);
        if (!audioUnlocked) {
          startBackgroundMusic(false).catch(() => {});
        }
      }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-100 text-slate-800"
    >
      {!audioReady && <AudioLoadingOverlay />}

      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
        autoPlay
        muted
        className="hidden"
        src="/song.mp3"
      />

      <audio
        ref={popRef}
        preload="auto"
        src="https://actions.google.com/sounds/v1/impacts/balloon_pop.ogg"
      />

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0.95; }
        }
      `}</style>

      <FloatingItems />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-md backdrop-blur">
            <span>🎂</span>
            <span className="text-sm font-medium">Birthday Girl</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Selamat Ulang Tahun, <span className="text-pink-500">Nabila Avrilia</span>!
          </h1>
        </header>

        <main className="min-h-[65vh] rounded-[2rem] border border-white/80 bg-white/55 p-5 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10">
          {/* NOTE: Audio file must be placed in public folder */}
          {audioFailed && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 text-center">
              Lagu belum bisa dimuat dari sumber sekarang.
            </div>
          )}
          {audioStartedMuted && !audioUnlocked && !audioFailed && (
            <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              Musik sudah mulai dalam mode senyap dan sedang dicoba untuk dinyalakan otomatis.
            </div>
          )}
          {page === "home" && (
            <section className="grid items-center gap-8 lg:grid-cols-2">
              {!entered ? (
                <div className="col-span-full flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
                  <div className="mb-6 text-6xl sm:text-7xl animate-pulse">💌</div>
                  <h2 className="mb-4 text-3xl font-black leading-tight sm:text-5xl">
                    Sebuah pesan spesial untuk <span className="text-pink-500">Nabila Avrilia</span>
                  </h2>
                  <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                    Keisengan kecil untuk meramaikan hari ulang tahunmu.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEntered(true);
                      }}
                      className="rounded-2xl bg-pink-500 px-8 py-4 font-bold text-white shadow-xl transition-transform hover:scale-105"
                    >
                      Open ✨
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 font-semibold text-pink-700">
                    </div>
                    <h2 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                      Hari ini milik <span className="text-rose-500">Nabila Avrilia</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
                      Sebuah web kecil untuk merayakan ulang tahunmu. Dibuat dengan doa baik,
                      warna-warna manis, dan kejutan yang bikin senyum.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEntered(false);
                        }}
                        className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-800 shadow-lg transition-transform hover:scale-105"
                      >
                        Back
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPage("wish");
                        }}
                        className="rounded-2xl bg-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-64 w-64 rounded-full bg-pink-300/40 blur-3xl sm:h-80 sm:w-80" />
                    <div className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/80 p-6 text-center shadow-2xl sm:p-8">
                      <div className="mb-4 text-6xl sm:text-7xl">🎂</div>
                      <h3 className="text-2xl font-bold sm:text-3xl">Make a Wish</h3>
                      <p className="mt-3 leading-relaxed text-slate-600">
                        Semoga semua harapan baikmu datang satu per satu dengan cara yang paling indah.
                      </p>
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-rose-100 p-4 text-3xl shadow-sm">🕯️</div>
                        <div className="rounded-2xl bg-yellow-100 p-4 text-3xl shadow-sm">🎁</div>
                        <div className="rounded-2xl bg-pink-100 p-4 text-3xl shadow-sm">🌷</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {page === "wish" && (
            <section>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Ucapan Spesial</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {WISHES.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl transition-transform hover:-translate-y-2"
                  >
                    <div className="mb-4 text-4xl">{item.emoji}</div>
                    <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                    <p className="leading-relaxed text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage("home");
                  }}
                  className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-800 shadow-lg transition-transform hover:scale-105"
                >
                  Back
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage("gallery");
                  }}
                  className="rounded-2xl bg-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {page === "gallery" && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Halaman Spesial</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {SPECIAL_MOMENTS.map((text, idx) => (
                  <div
                    key={idx}
                    className="rounded-[2rem] border border-white/80 bg-gradient-to-br from-white to-pink-50 p-6 shadow-lg"
                  >
                    <div className="mb-3 text-3xl">{idx % 2 === 0 ? "🌸" : "💫"}</div>
                    <p className="text-lg leading-relaxed text-slate-700">{text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 p-8 text-center text-white shadow-2xl">
                <div className="mb-4 text-5xl">💖</div>
                <h3 className="mb-3 text-2xl font-black sm:text-4xl">Untuk Nabila Avrilia</h3>
                <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
                  Semoga senyummu selalu jadi alasan indah untuk hari-hari yang lebih cerah, dan semoga dunia semakin lembut kepadamu.
                </p>
              </div>

              <div className="mt-10 flex justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage("wish");
                  }}
                  className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-800 shadow-lg transition-transform hover:scale-105"
                >
                  Back
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage("surprise");
                    triggerConfetti();
                  }}
                  className="rounded-2xl bg-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {page === "surprise" && (
            <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="mb-6">
                <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56">
                  <img
                    src={PHOTO_SLIDES[slideIndex]}
                    alt={`Slide ${slideIndex + 1}`}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2 rounded-full bg-white/80 px-3 py-2 shadow-lg backdrop-blur">
                    {PHOTO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideIndex(idx);
                        }}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          slideIndex === idx ? "bg-pink-500 scale-110" : "bg-slate-300"
                        }`}
                        aria-label={`Pilih foto ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-4 text-6xl sm:text-7xl">🎉</div>
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                Semoga selalu diberi kesehatan, keberuntungan, cinta,
                dan banyak alasan untuk bahagia setiap hari.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerConfetti();
                  }}
                  className="rounded-2xl bg-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Pencet 100x 🎊
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage("gallery");
                  }}
                  className="rounded-2xl bg-white px-6 py-3 font-bold text-slate-800 shadow-lg transition-transform hover:scale-105"
                >
                  Back
                </button>
              </div>
            </section>
          )}
        </main>

        

        <footer className="pt-8 text-center text-slate-600">
          <p className="text-sm sm:text-base">
            Andy@2026 ✨
          </p>
        </footer>
      </div>

      {/*
        Manual test cases:
        1. Halaman harus bisa dirender tanpa syntax error.
        2. Tipe WishItem harus terdefinisi sebelum dipakai.
        3. State entered hanya boleh dideklarasikan sekali.
        4. Tombol lanjut dan kembali harus berpindah antar page dengan benar setelah lapisan pertama dibuka.
        5. Tombol "Buka Lapisan Kedua" harus pindah ke page wish.
        6. Tombol "Buka Lapisan Ketiga" harus pindah ke page gallery.
        7. Tombol "Buka Lapisan Terakhir" harus pindah ke surprise dan memicu confetti.
        8. Overlay loading audio tampil singkat lalu hilang walau browser belum mengizinkan audio.
        9. Musik harus mencoba autoplay saat halaman load.
        10. Jika browser blokir autoplay, musik harus mulai saat interaksi pertama di halaman.
        11. Klik pertama di area halaman harus memulai musik jika belum aktif dan memunculkan efek hati.
        12. Tombol Confetti harus tetap bekerja setelah pindah halaman beberapa kali.
        13. Klik di area halaman harus memunculkan efek hati tanpa merusak navigasi.
        14. Audio vokal Happy Birthday harus dipasang lewat elemen audio tanpa syntax error.
        15. Halaman home harus tampil sebagai lapisan pembuka sebelum konten utama muncul.
        16. Tombol "Buka Lapisan Pertama" harus membuka konten utama tanpa reload.
        17. Tidak boleh ada menu atau nav bar yang tampil di layout.
        18. Jika sumber audio gagal dimuat, pesan fallback harus tampil.
        19. Audio harus autoplay tanpa menampilkan kontrol di UI.
        20. Audio harus mulai dari mode muted lalu mencoba unmute otomatis setelah delay.
        21. Jika unmute otomatis gagal, klik pertama di halaman harus tetap menyalakan audio.
        22. File audio HARUS berada di folder public (bukan /mnt/data) agar bisa dimuat browser.
        23. Slideshow foto harus tampil di halaman surprise.
        24. Slideshow harus otomatis berganti setiap 2.5 detik.
        25. Dot indicator harus bisa dipakai untuk pindah foto manual.
        23. Slideshow foto harus otomatis berganti setiap 2.5 detik.
        24. Klik dot indicator harus memindahkan slideshow ke foto yang dipilih.
      */}
    </div>
  );
}
