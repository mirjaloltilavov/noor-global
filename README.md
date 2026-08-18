# Noor Global — Sakinah

Sakinah — Qur'ondan olimlar ko'rib chiqqan **eslatmalar** beruvchi sokin sessiya rejimi.
Foydalanuvchi qalb holatini tanlaydi, uchta parcha oladi, tilovat bilan o'qiydi va sessiyani yakunlaydi.

Dizayn manbasi: Figma — **Noor Global → WEB** sahifasi (Sakinah v1 to'liq oqimi va v2 Composer
bitta yaxlit oqimga birlashtirilgan).

## Nima ishlaydi

| Bo'lim | Holat |
| --- | --- |
| **Sakinah** | To'liq ishlaydi — quyidagi oqim |
| Qur'on, Pleyer, Hadis, AI suhbat, Tafsir, Daftar | «Tez orada» sahifasi |

### Sakinah oqimi

1. **`/sakinah` — Composer**
   Hero + `سَكِينَة` kalligrafiyasi, 6 ta kayfiyat kartasi, uchta sozlama chipi
   (niyat / davomiylik / format), qori tanlash, «Boshlash».
   Tugallanmagan sessiya bo'lsa — yuqorida «Davom etish» banneri.
   Pastda — so'nggi sessiyalar (qidiruv bilan).
2. **`/sakinah/reminder`**
   Avval «Tayyorlanmoqda» ekrani (kutish paytida duo), so'ng uchta parcha:
   manba, tarjima parchasi, nega aynan shu parcha — va umumiy vaqt.
3. **`/sakinah/read`**
   To'liq ekranli o'qish sahnasi: arabcha matn, tarjima, ixtiyoriy transliteratsiya.
   O'ng vertikal panel — tipografika / tarjima / fon / yorqinlik / qori.
   Pastda pleyer, pastki chapda kayfiyatni o'zgartirish chipi.
   Boshqaruv 4 soniya harakatsizlikdan so'ng yashirinadi.
4. **`/sakinah/complete`**
   Parcha tugasa — «Keyingi parcha / To'liq sura / Sozlamalar».
   Sessiya tugasa — yakuniy oyat, saqlash · qayta o'qish · ulashish · tayyor
   va «yana shunday eslatma kerakmi?» so'rovi.

### O'qish fonlari

Figmadagi to'rt konsepsiya, sof CSS animatsiyasi bilan:
`Nūr` (tepadan tushuvchi nur) · `Mushaf` (kitobdan ko'tariluvchi halqa) ·
`Sakīnah` (kesishuvchi yo'llarda suzuvchi sharlar) · `Layl` (tungi osmon).
Yorqinlik slayderi va «Harakatni kamaytirish» tugmasi bor;
`prefers-reduced-motion` tizim sozlamasi ham hurmat qilinadi.

## Ma'lumot manbalari

- **Matn va tarjima** — [quran.com API v4](https://api-docs.quran.com/), server tomonda
  `/api/passage` orqali (7 kun kesh).
  Tarjimalar: `uz` — Muhammad Sodiq Muhammad Yusuf (lotin, id 55),
  `ru` — Эльмир Кулиев (id 45), `en` — Saheeh International (id 20),
  transliteratsiya — id 57.
- **Audio** — [everyayah.com](https://everyayah.com) CDN, oyatma-oyat:
  As-Sudais · Alafasy · Al-Ghamdi · Al-Husary.
- **Parchalar tanlovi** — `lib/sakinah.ts` ichida qo'lda kuratsiya qilingan
  (kayfiyat → 3 parcha + nega aynan shu parcha izohi, uch tilda).

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
  sakinah/            composer · reminder · read · complete
  api/passage/        quran.com proxy (kesh bilan)
  quran|player|...    "tez orada" sahifalari
components/
  shell/              88px nav rail · top bar
  sakinah/            fon sahnasi · popoverlar
  ui/                 ikonka · select
lib/
  sakinah.ts          kayfiyatlar · parchalar · qorilar · fonlar
  quran.ts            quran.com API
  i18n.ts             uz / ru / en lug'atlari
  session.ts          localStorage sozlamalari va tarix
```

## Eslatma

Sakinah zikrni taklif qiladi — u foydalanuvchi holatini sharhlamaydi va diniy hukm
chiqarmaydi. Bu mahsulot matnlarida ham aniq aytilgan.
