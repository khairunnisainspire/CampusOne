import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry user-agent
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// 1. Campus AI Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history = [], userProfile } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
  }

  const studentContext = userProfile
    ? `Mahasiswa saat ini: ${userProfile.name}, Jurusan: ${userProfile.major}, Semester: ${userProfile.semester}, Minat: ${userProfile.interests?.join(', ')}, Mata Kuliah: ${userProfile.currentCourses?.join(', ')}.`
    : 'Mahasiswa: Nisa (S1 Informatika, Semester 5).';

  const systemInstruction = `Anda adalah "Campus AI", asisten pintar terpadu untuk platform super app kampus "CampusOne" (Tagline: "One Campus. Endless Possibilities.").
Tugas Anda adalah membantu mahasiswa dalam:
1. Menemukan peluang akademik & karier (Beasiswa, Magang, Kompetisi, Riset di Opportunity Central).
2. Membantu belajar, memahami konsep sulit, kuis, dan rencana studi di QuestLearn.
3. Memberikan rekomendasi study partner dan tips kolaborasi kelompok di PeerMatch.
4. Memberikan info reservasi fasilitas kampus (ruang diskusi, lab, studio multimedia) di SmartCampus.
5. Menjawab pertanyaan seputar kehidupan kampus dengan ramah, suportif, ringkas, dan actionable.

Gunakan bahasa Indonesia yang santun, hangat, profesional, dan menyemangati ala mahasiswa berprestasi.
Gunakan format markdown (bullet points, bolding) agar nyaman dibaca.
Selalu sertakan batasan bahwa jadwal dan data beasiswa merupakan informasi kurasi/demo dan sarankan untuk verifikasi ke unit kemahasiswaan atau sumber resmi terkait.
${studentContext}`;

  if (aiClient) {
    try {
      const contents = [
        ...history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || 'Maaf, saya tidak dapat merumuskan jawaban saat ini.';
      return res.json({ reply, source: 'gemini' });
    } catch (err: any) {
      console.error('Error generating AI chat response:', err);
      // Fallback seamlessly
    }
  }

  // Fallback intelligent simulation responses
  const lowerMsg = message.toLowerCase();
  let fallbackReply = `Halo! Saya Campus AI. Senang bisa mendampingimu di CampusOne. `;

  if (lowerMsg.includes('beasiswa') || lowerMsg.includes('peluang') || lowerMsg.includes('magang') || lowerMsg.includes('lomba') || lowerMsg.includes('kompetisi')) {
    fallbackReply += `Untuk semester ini, beberapa peluang menarik yang sedang hangat di **Opportunity Central**:\n\n` +
      `1. **Beasiswa Prestasi Djarum Plus 2026** (Dana pembinaan + Pelatihan Leadership). Cocok untuk mahasiswa semester 4-5.\n` +
      `2. **Tech Internship di GoTo / Tokopedia** (Posisi Software Engineer Intern & Data Intern).\n` +
      `3. **Gemastik 2026 — Divisi Data Mining & Software Development** (Kompetisi nasional bergengsi Puspresnas).\n\n` +
      `*Tips:* Buka menu **Opportunity Central** untuk melihat checklist berkas dan klik "Bookmark" untuk memasukkannya ke tracker pendaftaranmu!`;
  } else if (lowerMsg.includes('belajar') || lowerMsg.includes('struktur data') || lowerMsg.includes('materi') || lowerMsg.includes('questlearn') || lowerMsg.includes('algoritma')) {
    fallbackReply += `Di **QuestLearn**, kamu bisa mengasah pemahamanmu dengan modul interaktif & kuis berbasis XP!\n\n` +
      `Untuk topik Struktur Data & Algoritma:\n` +
      `- Pahami dulu konsep memori pointer & reference.\n` +
      `- Latih perbedaan Array vs Linked List (akses O(1) vs traversal O(n)).\n` +
      `- Kerjakan modul *"Dasar-Dasar Pemrograman"* di QuestLearn untuk mendapatkan +150 XP dan badge *"Algorithm Ace"*!`;
  } else if (lowerMsg.includes('partner') || lowerMsg.includes('teman') || lowerMsg.includes('kelompok') || lowerMsg.includes('peermatch')) {
    fallbackReply += `Mencari rekan belajar yang seirama? Coba fitur **PeerMatch**:\n\n` +
      `Sistem kami mencocokkan berdasarkan kesamaan mata kuliah (40%), kecocokan jadwal kosong (30%), dan preferensi belajar (30%).\n` +
      `Saat ini ada rekomendasi rekan seperti **Dimas Pratama** (94% match) dan **Rafi Fauzan** (88% match) yang sama-sama mengambil mata kuliah komputasi dan siap belajar kelompok!`;
  } else if (lowerMsg.includes('ruang') || lowerMsg.includes('fasilitas') || lowerMsg.includes('reservasi') || lowerMsg.includes('smartcampus') || lowerMsg.includes('lab')) {
    fallbackReply += `Untuk reservasi fasilitas di **SmartCampus**:\n\n` +
      `- **Ruang Diskusi Kolaboratif Lt. 2 Perpustakaan** (Kapasitas 8 orang, Smart TV + Whiteboard).\n` +
      `- **Lab AI & Komputasi Lanjut** (Gedung Sains & Teknologi Lt. 3).\n` +
      `- **Coworking Pods SC** untuk belajar fokus 1-2 orang.\n\n` +
      `Kamu bisa langsung pilih tanggal dan slot jam di menu **SmartCampus**. Slot otomatis diverifikasi agar tidak terjadi bentrok!`;
  } else {
    fallbackReply += `Bagaimana saya bisa membantumu hari ini? Kamu bisa menanyakan:\n\n` +
      `- Rekomendasi beasiswa dan magang yang cocok dengan profilmu\n` +
      `- Penjelasan konsep materi kuliah atau latihan soal di QuestLearn\n` +
      `- Rekomendasi teman belajar dan grup diskusi di PeerMatch\n` +
      `- Ketersediaan fasilitas dan ruang diskusi di SmartCampus`;
  }

  return res.json({ reply: fallbackReply, source: 'demo-fallback' });
});

// 2. Opportunity Assistant Endpoint
app.post('/api/ai/opportunity', async (req: Request, res: Response) => {
  const { action, opportunity, userProfile } = req.body;

  const oppTitle = opportunity?.title || 'Program Pengembangan Mahasiswa';
  const oppCategory = opportunity?.category || 'Peluang';

  const systemInstruction = `Anda adalah konsultan karier dan beasiswa mahasiswa di CampusOne. Tugas Anda adalah memberikan bimbingan praktis, actionable, terstruktur, dan memotivasi mahasiswa. Format output dalam markdown yang rapi.`;

  const prompt = `Aksi: ${action}
Judul Peluang: ${oppTitle}
Kategori: ${oppCategory}
Deskripsi/Syarat: ${JSON.stringify(opportunity?.requirements || opportunity?.description || '')}
Profil Mahasiswa: Nama ${userProfile?.name || 'Nisa'}, Prodi ${userProfile?.major || 'Informatika'}, Semester ${userProfile?.semester || '5'}, Minat: ${userProfile?.interests?.join(', ') || 'AI, Software'}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction },
      });
      return res.json({ result: response.text, source: 'gemini' });
    } catch (err: any) {
      console.error('Error in opportunity AI assistant:', err);
    }
  }

  // Fallback intelligent templates
  let result = '';
  if (action === 'requirements') {
    result = `### 📋 Bedah Persyaratan Sederhana untuk **${oppTitle}**\n\n` +
      `1. **Kualifikasi Akademik:** Mahasiswa aktif jenjang S1/D4 minimal semester 4 dengan IPK di atas batas rata-rata program.\n` +
      `2. **Portofolio & Rekam Jejak:** Lampirkan proyek perkuliahan terbaik atau sertifikat kepanitiaan/organisasi.\n` +
      `3. **Komitmen Waktu:** Pastikan tidak ada bentrok SKS dengan jam kegiatan/pelatihan resmi penyelenggara.\n` +
      `4. **Dokumen Inti:** Transkrip nilai legalisir terbaru, CV dengan format ATS-friendly, dan Surat Rekomendasi Fakultas.`;
  } else if (action === 'checklist') {
    result = `### ✅ Action Checklist Persiapan: **${oppTitle}**\n\n` +
      `- [ ] **H-14:** Ajukan Surat Keterangan Mahasiswa Aktif & Transkrip Akademik ke BAAK.\n` +
      `- [ ] **H-10:** Perbarui CV dengan proyek kuliah terbaru & portofolio GitHub/LinkedIn.\n` +
      `- [ ] **H-7:** Tulis draf Motivation Letter (300-500 kata) yang menonjolkan problem solving.\n` +
      `- [ ] **H-4:** Minta feedback proofreading ke dosen pembimbing atau rekan di PeerMatch.\n` +
      `- [ ] **H-2:** Kompres semua berkas PDF sesuai batas ukuran maksimum form pendaftaran.\n` +
      `- [ ] **H-1:** Submit pendaftaran dan simpan bukti konfirmasi submission!`;
  } else if (action === 'motivation_tips') {
    result = `### 💡 Formula Motivation Letter Juara untuk **${oppTitle}**\n\n` +
      `1. **The Hook (Paragraf 1):** Mulai dengan visi personalmu di bidang ${userProfile?.major || 'teknologi'} dan alasan spesifik mengapa program ini adalah akselerator utama bagi impianmu.\n` +
      `2. **Concrete Value (Paragraf 2):** Jangan hanya menyebut "saya pekerja keras". Ceritakan situasi nyata saat kamu menyelesaikan tantangan tim atau proyek berkesan.\n` +
      `3. **Mutual Benefit (Paragraf 3):** Jelaskan apa yang akan kamu sumbangkan kembali ke ekosistem kampus setelah menyelesaikan program ini.`;
  } else {
    result = `### 🎯 Analisis Keselarasan Profil & Peluang\n\n` +
      `Program **${oppTitle}** sangat relevan dengan profil ${userProfile?.major || 'Informatika'} semester ${userProfile?.semester || '5'}. ` +
      `Kombinasi minatmu di bidang ${userProfile?.interests?.join(', ') || 'pengembangan teknologi'} memberikan poin nilai tambah yang kuat bagi seleksi berkas.`;
  }

  return res.json({ result, source: 'demo-fallback' });
});

// 3. QuestLearn AI Tutor Endpoint
app.post('/api/ai/questlearn', async (req: Request, res: Response) => {
  const { action, topic, context, userProfile } = req.body;

  const systemInstruction = `Anda adalah "QuestLearn AI Tutor" di CampusOne. Tugas Anda adalah membantu mahasiswa belajar dengan cara yang interaktif, visual, menggunakan analogi sehari-hari yang mudah dipahami mahasiswa Indonesia, dan memberikan contoh kode yang bersih jika relevan.`;

  const prompt = `Aksi: ${action}
Topik: ${topic || 'Dasar Pemrograman'}
Konteks: ${context || ''}
Tingkat Mahasiswa: Semester ${userProfile?.semester || 5} prodi ${userProfile?.major || 'Informatika'}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction },
      });
      return res.json({ result: response.text, source: 'gemini' });
    } catch (err: any) {
      console.error('Error in QuestLearn AI tutor:', err);
    }
  }

  // Fallback interactive response
  let result = '';
  if (action === 'explain') {
    result = `### 🧠 Penjelasan Konsep: **${topic}**\n\n` +
      `Bayangkan **${topic}** seperti sistem antrean di kafetaria kampus:\n` +
      `- Setiap elemen memiliki nomor tiket dan prioritas tertentu.\n` +
      `- Efisiensi waktu (Time Complexity) ditentukan oleh seberapa cepat kamu menemukan pesanan tanpa harus memeriksa semua orang satu per satu.\n\n` +
      `**Inti Pemahaman:**\n` +
      `Dalam ilmu komputer, pemahaman struktur dasar ini memungkinkan aplikasi tetap cepat dan hemat memori meskipun memproses jutaan data pengguna sekaligus.`;
  } else if (action === 'quiz') {
    result = `### 🎯 Tantangan Cepat QuestLearn:\n\n` +
      `**Pertanyaan:** Dalam penanganan data skala besar, mengapa akses elemen pada Array umumnya berkecepatan $O(1)$ sedangkan Linked List memerlukan $O(n)$?\n\n` +
      `**Pilihan:**\n` +
      `A. Karena Array disimpan pada blok memori yang bersebelahan (contiguous memory)\n` +
      `B. Karena Linked List memiliki ukuran dinamis yang tak terbatas\n` +
      `C. Karena Array selalu diurutkan secara alfabetis\n` +
      `D. Karena Linked List tidak menggunakan memori RAM\n\n` +
      `*(Jawaban yang tepat adalah **A**! Alamat memori elemen ke-i dapat langsung dihitung dengan formula basis + i * size)*.`;
  } else {
    result = `### 📅 Rekomendasi Rencana Belajar Terstruktur (3 Sesi):\n\n` +
      `- **Sesi 1 (45 Menit):** Teori dasar & visualisasi diagram alur data.\n` +
      `- **Sesi 2 (60 Menit):** Implementasi kode latihan langsung & hands-on debugging.\n` +
      `- **Sesi 3 (30 Menit):** Kerjakan kuis interaktif di QuestLearn untuk mengunci XP dan badge pencapaian!`;
  }

  return res.json({ result, source: 'demo-fallback' });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusOne server running on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer();
