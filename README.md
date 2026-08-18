# Noor Global — Sakinah

Qur'on pleyeri, ichida **Sakinah** rejimi bilan: foydalanuvchi qalb holatini
tanlaydi, unga mos parchalardan tanlangan davomiylikka navbat tuziladi va
tilovat boshlanadi. Sessiya tugagach pleyerdan chiqilmaydi — oddiy pleyerga
o'tadi, vibe esa burchakda bo'limcha bo'lib qoladi.

Dastlabki dizayn manbasi: Figma — **Noor Global → WEB** sahifasi.
Keyingi bosqichda oqim pleyer atrofida qayta yig'ildi.

## Nima ishlaydi

| Bo'lim | Holat |
| --- | --- |
| **Sakinah / Pleyer** | To'liq ishlaydi — quyidagi oqim |
| Qur'on, Pleyer, Hadis, AI suhbat, Tafsir, Daftar | «Tez orada» sahifasi |

### Oqim

Hammasi bitta manzilda — `/sakinah`. Navbat bo'sh bo'lsa uy sahifasi,
sessiya boshlangach o'sha yerda full-screen o'qish sahnasi ochiladi.

1. **Uy sahifasi** — hero, «Boshlash», standart qorini tanlash, so'nggi
   sessiyalar (qidiruv va «Takrorlash» bilan), tugallanmagan sessiya banneri.
2. **Onboarding** — «Boshlash» bosilgach avval yorug'lik ochilishi, so'ng
   to'rtta ketma-ket savol: kayfiyat (6 ta),
   davomiylik (10 / 30 / 45 daqiqa yoki cheksiz), format (tinglash yoki
   tinglash + o'qish), qori. «Kayfiyatsiz, oddiy pleyer» bilan o'tkazib
   yuborsa ham bo'ladi. Tanlangach full-screen pleyer ochiladi.
   Ikkinchi marta «Boshlash» bosilganda savollar so'ralmaydi — oxirgi
   kayfiyat bilan darhol davom etadi, sozlash esa burchakdagi vidjetdan.
3. **Navbat** — tanlangan daqiqaga qarab tuziladi: avval kayfiyat bo'yicha
   kuratsiya qilingan parchalar, vaqt yetmasa o'sha suralarning davomi
   bo'laklarga bo'linib qo'shiladi. Cheksiz rejimda navbat tugashiga yaqin
   o'zi uzayadi.
4. **Pleyer** — arabcha matn, tarjima, transliteratsiya; boshqaruv
   (⟵ · −10s · play · +10s · ⟶), tezlik, takrorlash (o'chiq / oyat / parcha),
   oyat ichida seek. Yon panel: **Navbat · Suralar · Sozlamalar**
   (114 sura + qidiruv, qori, tarjimon, yozuv, o'lcham, fon, yorqinlik).
5. **Sessiya yakuni** — «davom ettiramizmi?» so'raladi.
   *Ha* — navbat uzayadi va tilovat davom etadi.
   *Yo'q* — pleyerdan chiqilmaydi: oddiy rejimga o'tadi, sura ro'yxati ochiladi,
   vibe sessiyasi esa pastki chap burchakda bo'limcha bo'lib qoladi
   (qayta sozlash · qaytadan boshlash · chiqish).

### Karaoke rejimi

Tilovat davomida o'qilayotgan so'z yorqinlashadi, o'tganlari biroz so'nadi.
So'zma-so'z vaqt belgilari quran.com API'sidan keladi (`audio.segments`),
shuning uchun bu taqribiy emas — haqiqiy vaqt bo'yicha. Tipografika
popoveridan yoqib-o'chiriladi.

Shu sababli tilovat everyayah o'rniga quran.com CDN'idan olinadi va
qorilar ro'yxati so'z belgilari mavjud bo'lganlar bilan cheklandi:
As-Sudais · Alafasy · Ash-Shuraym · Al-Husary.

### Ohang fon bilan o'zgaradi

Har fonning o'z urg'u rangi bor va u butun interfeysga tarqaladi
(`--sk-accent`): Nūr — yashil-oq, Mushaf — oltin, Sakīnah — yashil,
Layl — ko'k. Tugmalar, progress, tanlangan holatlar shu rangda.

### Fonda ijro

O'qish sahnasidagi «fonda davom ettirish» tugmasi pleyerni yig'ib,
sayt interfeysini ochadi. Tilovat to'xtamaydi, o'ng pastki burchakda
esa pulsatsiya qiluvchi dumaloq **aura** vidjeti qoladi — bosilsa
pleyerga qaytaradi.

### Bismillah

Har yangi sura Bismillah bilan boshlanadi. An'anaviy qoidaga amal qilinadi:

- **Tavba (9-sura)** oldidan Bismillah aytilmaydi;
- **Fotiha**da Bismillah 1-oyatning o'zi, shuning uchun qo'shimcha aytilmaydi;
- kayfiyat bo'yicha tanlangan **har bir yangi parcha** Bismillah bilan boshlanadi;
- bir sura ichida ketma-ket oyatlar to'xtovsiz o'qiladi.

Audio sifatida o'sha qorining Fotiha 1-oyati ishlatiladi, matn esa ekranda
«Bismillah» belgisi bilan ko'rsatiladi. Qoida `needsBismillah()` da —
`lib/queue.ts`.

### O'qish fonlari

Figmadagi to'rt konsepsiya, sof CSS animatsiyasi bilan:
`Nūr` (tepadan tushuvchi nur) · `Mushaf` (kitobdan ko'tariluvchi halqa) ·
`Sakīnah` (kesishuvchi yo'llarda suzuvchi sharlar) · `Layl` (tungi osmon).
Yorqinlik slayderi va «Harakatni kamaytirish» tugmasi bor;
`prefers-reduced-motion` tizim sozlamasi ham hurmat qilinadi.

## Ma'lumot manbalari

- **Matn va tarjima** — [quran.com API v4](https://api-docs.quran.com/), server tomonda
  `/api/passage` va `/api/chapters` orqali (7 va 30 kun kesh).
  Har til uchun bir nechta tarjimon bor va pleyerdan almashtiriladi —
  standartlari: `uz` Muhammad Sodiq Muhammad Yusuf (lotin, id 55),
  `ru` Эльмир Кулиев (id 45), `en` Saheeh International (id 20);
  transliteratsiya — id 57.
- **Audio va so'z vaqtlari** — quran.com CDN, oyatma-oyat:
  As-Sudais · Alafasy · Ash-Shuraym · Al-Husary. Har bir oyat bilan
  birga so'zma-so'z vaqt belgilari ham keladi (karaoke uchun).
- **Parchalar tanlovi** — `lib/sakinah.ts` ichida qo'lda kuratsiya qilingan
  (kayfiyat → 3 parcha + nega aynan shu parcha izohi, uch tilda).
  Uzoqroq sessiyalar `lib/queue.ts` da o'sha suralarning davomi bilan to'ldiriladi.

## Texnologiyalar

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Inter + Scheherazade New.
Tashqi UI kutubxonasi yo'q — ikonkalar inline SVG.
Sozlamalar va sessiya tarixi `localStorage`da.

## Ishga tushirish

```bash
npm install
npm run dev
```

http://localhost:3000 — `/sakinah` ga yo'naltiradi.

## Tuzilma

```
app/
  sakinah/            uy sahifasi + o'qish sahnasi (bitta manzil)
  api/passage/        oyat matni · tarjima · audio · so'z vaqtlari
  api/chapters/       114 sura ro'yxati
  quran|hadith|...    'tez orada' sahifalari
components/
  player/             PlayerProvider · OnboardingFlow · ReadingScene ·
                      SurahModal · QueueModal · VibeChip · AuraWidget
  sakinah/            fon sahnasi · popover elementlari
  shell/              nav rail (desktop ustun / mobil panel)
  ui/                 ikonka · modal · select
lib/
  sakinah.ts          kayfiyatlar · parchalar · qorilar · tarjimalar · fonlar
  queue.ts            davomiylikka qarab navbat tuzish
  quran.ts            quran.com API
  useQuran.ts         mijoz tomonda kesh va oldindan yuklash
  i18n.ts             uz / ru / en lug'atlari
  session.ts          localStorage sozlamalari va tarix
```

## Eslatma

Sakinah zikrni taklif qiladi — u foydalanuvchi holatini sharhlamaydi va diniy hukm
chiqarmaydi. Bu mahsulot matnlarida ham aniq aytilgan.
