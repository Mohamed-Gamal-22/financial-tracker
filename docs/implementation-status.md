# حالة تنفيذ API — مصروف

مرجع التوثيق: [`full-api-master-doc (2).md`](./full-api-master-doc%20(2).md)

## Checklist — الملف مغلق

- [x] Auth: signup (بدون `role`)، login، Gmail، OTP، forgot/reset password
- [x] User: profile، logout one/all، rotate token، freeze، name، profile pic (`file`)
- [x] Transaction: CRUD + summary + report + فلاتر + عرض أخطاء الباك إند
- [x] Monthly Budget: create/update/delete + by month + **قائمة كل الميزانيات**
- [x] Notification: GET list + GET by id
- [x] `?lang=ar` على endpoints المدعومة + `Accept-Language: ar` على الكل
- [x] `.env.example` مع Google Client ID

## Category في المعاملات

**`POST/PATCH /transaction`:** حقل `category` = **`income` | `expense` | `savings`** (lowercase) — مش ObjectId.

**`GET /category`:** خارج النطاق (404 على production). الفورم يختار نوع المعاملة فقط؛ لا توجد شاشة إدارة تصنيفات.

## Notifications — read/unread

حالة «مقروء» تُخزَّن **محليًا** (`localStorage`) — لا يوج endpoint في التوثيق لـ mark-as-read.

## إعداد البيئة

انسخ [`.env.example`](../.env.example) إلى `.env.local` واملأ:

- `NEXTAUTH_SECRET`

## خارج النطاق (مقصود)

| البند | السبب |
| --- | --- |
| CRUD تصنيفات | Category API غير مستخدم |
| إعدادات العملة/اللغة في Profile | غير موجود في API doc |
| Mark notification read على السيرفر | لا endpoint في doc |
