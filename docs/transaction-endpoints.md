# المعاملات (Transaction) — مصروف

**Base URL:** `https://finance-tracker-five-liart.vercel.app`

> شكل الـ Response العام (نجاح/فشل) موجود بالتفصيل في ملف `login-register.md` — نفس الشكل ساري هنا. كل الـ endpoints هنا محتاجة Header:
> `authorization: <access_token>`
>
> **مهم:** الباك إند بياخد المستخدم الحالي من التوكن نفسه — الفرونت **متبعتش** `userId` ولا `createdBy` في أي request هنا أبدًا.

---

## 1. إضافة معاملة

`POST /transaction`

**Header:** `authorization: <access_token>`

**Body:**
```json
{
  "title": "شراء طعام",
  "amount": 1000,
  "category": "6a7b2544b7e711374175c0a8",
  "date": "2026-07-09"
}
```

| الحقل | النوع | إلزامي | القاعدة |
| --- | --- | --- | --- |
| title | string | ✅ | حرف واحد على الأقل، والمسافات الزيادة أول/آخر النص بتتشال تلقائي |
| amount | number | ✅ | لازم يكون أكبر من 0 |
| category | string (ObjectId) | ✅ | لازم يكون ID تصنيف موجود فعلاً (من `GET /category`) |
| date | string | ❌ | لو مبعتّهاش، الباك إند بيستخدم التاريخ/الوقت الحالي تلقائي |

**Response (نجاح):**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "_id": "6a79d054991101b52f875bab",
    "title": "شراء طعام",
    "amount": 1000,
    "category": "6a7b2544b7e711374175c0a8",
    "date": "2026-07-09"
  }
}
```

---

## 2. حذف معاملة

`DELETE /transaction/:id`

**مثال:** `DELETE /transaction/6a79d054991101b52f875bab`

**Header:** `Authorization: Bearer <access_token>`

**صلاحيات الحذف:**
- **صاحب المعاملة:** يقدر يحذف معاملته هو بس.
- **Admin:** يقدر يحذف أي معاملة لأي مستخدم.
- مستخدم عادي **مايقدرش** يحذف معاملة مستخدم تاني — لو حاول، الباك إند هيرفض.

**Response (نجاح):**
```json
{ "message": "Done", "success": true, "status": 200 }
```

---

## 3. عرض معاملة واحدة بالـ ID

`GET /transaction/:id`

**مثال:** `GET /transaction/6a7b260879ff2cb953fbf0cd`

**Header:** `Authorization: Bearer <access_token>`

بيرجع تفاصيل المعاملة، مع بيانات التصنيف **كاملة** (populated) بما فيها `typeLabel`، مش الـ ID بس.

**Response (نجاح):**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "_id": "6a7b260879ff2cb953fbf0cd",
    "title": "شراء طعام",
    "amount": 1000,
    "date": "2026-07-09",
    "category": {
      "_id": "6a7b2544b7e711374175c0a8",
      "name": "طعام ومشروبات",
      "type": "expense",
      "typeLabel": "مصروف"
    }
  }
}
```

---

## 4. عرض كل معاملات المستخدم (مع فلاتر)

`GET /transaction`

**Header:** `authorization: <access_token>`

بترجع **قايمة مقسّمة على صفحات (Pagination)** لمعاملات المستخدم المسجل دخوله بس، مرتبة **من الأحدث للأقدم** حسب التاريخ.

### Query Parameters

| Parameter | النوع | إلزامي | الافتراضي | القاعدة |
| --- | --- | --- | --- | --- |
| page | number | ❌ | 1 | رقم صحيح، الحد الأدنى 1 |
| limit | number | ❌ | 10 | رقم صحيح، من 1 لحد 100 |
| categoryType | string | ❌ | — | واحد من: `income` / `expense` / `savings` (إنجليزي فقط، متبعتش القيمة عربي) |
| categoryName | string | ❌ | — | بحث جزئي (Partial match) وغير حساس لحالة الأحرف — تقدر تبعت جزء من الاسم بالعربي أو الإنجليزي |
| month | string | ❌ | — | صيغة `YYYY-MM` بالظبط (زي `2026-07`) — بترجع كل معاملات الشهر ده كامل |

### أمثلة

```
GET /transaction?page=1&limit=10
GET /transaction?page=2
GET /transaction?limit=50
GET /transaction?categoryType=expense
GET /transaction?categoryName=طعام
GET /transaction?month=2026-07
```

**تجميع الفلاتر مع بعض:**
```
GET /transaction?page=1&limit=10&categoryType=expense&categoryName=Food&month=2026-07
```
(بيرجع صفحة 1، لحد 10 معاملات، تصنيفها مصروف، اسم التصنيف فيه "Food"، والتاريخ في يوليو 2026)

**Response (نجاح):**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "transactions": [
      {
        "_id": "6a79d054991101b52f875bab",
        "title": "شراء طعام",
        "amount": 1000,
        "date": "2026-07-09",
        "category": { "_id": "6a7b2544b7e711374175c0a8", "name": "طعام ومشروبات", "type": "expense" }
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```
> ملحوظة: شكل بيانات الـ pagination بالظبط (أسماء الحقول `page`/`limit`/`total`) اتفترض بناءً على النمط الشائع — تأكدي منه مع الباك إند وقت أول اختبار فعلي للـ endpoint، الـ Postman collection معندهاش أمثلة response محفوظة.

---

## 5. ملخص المعاملات (Summary)

`GET /transaction/summary`

**Header:** `authorization: <access_token>`

بيرجع **ملخص مالي مجمّع حسب التصنيف**، مقسّم لـ 3 أقسام: `expense`، `income`، `savings`. لكل تصنيف جوه كل قسم: بيانات التصنيف، عدد المعاملات، وإجمالي المبلغ.

### Query Parameters

| Parameter | النوع | إلزامي | الافتراضي |
| --- | --- | --- | --- |
| month | string | ❌ | الشهر الحالي تلقائيًا لو معدّتش |

**مثال:**
```
GET /transaction/summary?month=2026-07
```
لو بعتّي من غير `month`، الباك إند بيرجّع ملخص **الشهر الحالي تلقائيًا** — الفرونت مش محتاج يحسب الشهر الحالي بنفسه إلا لو عايز يعرضه في الواجهة بس.

**Response (نجاح) — شكل تقريبي:**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "expense": [
      { "category": { "_id": "...", "name": "طعام ومشروبات" }, "count": 5, "total": 2500 }
    ],
    "income": [
      { "category": { "_id": "...", "name": "راتب أساسي" }, "count": 1, "total": 15000 }
    ],
    "savings": [
      { "category": { "_id": "...", "name": "ادخار للسفر" }, "count": 1, "total": 5000 }
    ]
  }
}
```

---

## 6. تقرير يومي/شهري (Report)

`GET /transaction/report`

**Header:** `authorization: <access_token>`

بيرجع **تقرير مالي كامل** مجمّع حسب التصنيف ومقسّم لـ `expense` / `income` / `savings`، بالإضافة للإجماليات الكلية: `totalExpense`، `totalIncome`، `totalSavings`. المعاملات والتصنيفات المحذوفة بتتستبعد تلقائيًا من التقرير.

### Query Parameters

| Parameter | النوع | إلزامي | الوصف |
| --- | --- | --- | --- |
| type | string | ❌ | `day` أو `month` |
| date | string | مطلوب لو `type=day` | صيغة `YYYY-MM-DD` |
| month | string | مطلوب لو `type=month` | صيغة `YYYY-MM` |

### 3 حالات استخدام

**أ) بدون أي Query Params → تقرير الشهر الحالي تلقائيًا:**
```
GET /transaction/report
```

**ب) تقرير يوم محدد:**
```
GET /transaction/report?type=day&date=2026-08-13
```
(لازم `date` يتبعت لو `type=day`، وإلا الطلب غلط)

**ج) تقرير شهر محدد:**
```
GET /transaction/report?type=month&month=2026-07
```
(لازم `month` يتبعت لو `type=month`، وإلا الطلب غلط)

**Response (نجاح) — شكل تقريبي:**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "expense": [
      { "category": { "_id": "...", "name": "طعام ومشروبات" }, "count": 5, "total": 2500 }
    ],
    "income": [
      { "category": { "_id": "...", "name": "راتب أساسي" }, "count": 1, "total": 15000 }
    ],
    "savings": [
      { "category": { "_id": "...", "name": "ادخار للسفر" }, "count": 1, "total": 5000 }
    ],
    "totalExpense": 2500,
    "totalIncome": 15000,
    "totalSavings": 5000
  }
}
```

---

## ملاحظات عامة للأجنت

1. **`categoryType` دايمًا إنجليزي:** `income`/`expense`/`savings` بس — لو عايزة تعرضي "دخل"/"مصروف"/"ادخار" في الواجهة، الترجمة دي بتتعمل في الفرونت، مش بتتبعت للباك إند عربي.
2. **الفرق بين Summary و Report:**
   - **Summary** (`/transaction/summary`) — ملخص بسيط لشهر واحد بس، بدون تفاصيل يومية.
   - **Report** (`/transaction/report`) — تقرير أشمل، بيدعم يوم محدد أو شهر محدد، ومعاه الإجماليات الكلية (`totalExpense`/`totalIncome`/`totalSavings`) جاهزة من غير ما تحسبيها بنفسك في الفرونت.
   - شاشة "الداشبورد/نظرة عامة" الأنسب لها الـ Summary، وشاشة "التقارير" الأنسب لها الـ Report.
3. **الفرز:** قايمة المعاملات (`GET /transaction`) دايمًا مرتبة الأحدث أولًا — مفيش داعي تعملي sort تاني في الفرونت.
4. **الحد الأقصى للـ limit في الـ pagination هو 100** — لو حبيتي تعملي "تحميل كل المعاملات" في تقرير، هتحتاجي تلفي على أكتر من صفحة لو العدد أكبر من 100.
