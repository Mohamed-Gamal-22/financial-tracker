# شاشة الحساب (User) — مصروف

**Base URL:** `https://finance-tracker-five-liart.vercel.app`

> شكل الـ Response العام (نجاح/فشل) موجود بالتفصيل في ملف `login-register.md` — نفس الشكل ساري هنا.
>
> ⚠️ **تحديث:** الفولدر ده بقى فيه **7 endpoints** — منها تعديل الاسم وصورة البروفايل (رفع وحذف).

---

## 1. بيانات البروفايل

`GET /user`

**Header:** `Authorization: Bearer <access_token>`

**Response (نجاح):**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "_id": "6865d1f4b6b0d4d1d2a1f123",
    "fullname": "Mohamed Ahmed",
    "email": "user@example.com"
  }
}
```

---

## 2. تسجيل الخروج

`POST /user/logout`

**Header:** `Authorization: Bearer <access_token>`

**Body:**
```json
{ "flag": "one" }
```
| القيمة | المعنى |
| --- | --- |
| `"one"` | تسجيل خروج من الجهاز الحالي بس |
| `"all"` | تسجيل خروج من كل الأجهزة |

اعملي في شاشة الحساب خيارين منفصلين: "تسجيل الخروج" (one) و"تسجيل الخروج من كل الأجهزة" (all)، مش زرار واحد بس.

**Response (نجاح):**
```json
{ "message": "Logged out successfully", "success": true, "status": 200 }
```

---

## 3. تجديد التوكن (Rotate Token)

`POST /user/rotate-token`

**Header:** `Authorization: Bearer <refresh_token>` *(مش access token — الفرق مهم)*

**⚠️ شرط أساسي:** التجديد مسموح بس لو الـ access token باقيله **5 دقايق أو أقل** على انتهاءه.

**تنفيذها في الفرونت:** لازم منطق (interceptor أو timer) يراقب وقت انتهاء الـ access token، ويستدعي الـ endpoint ده تلقائيًا لما يقرب على الانتهاء — مش تستني الـ request يفشل بـ401 الأول.

**Response (نجاح):**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": { "access_token": "...", "refresh_token": "..." }
}
```
> خزّني الـ token الجديد بدل القديم فورًا (الاتنين access و refresh بيتجددوا سوا).

---

## 4. تعديل اسم المستخدم

`PATCH /user/name`

**Header:** `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "fullname": "Raneem Magdy Elmahdy"
}
```

| الحقل | النوع | إلزامي | الوصف |
| --- | --- | --- | --- |
| fullname | string | ✅ | الاسم الجديد الكامل |

> القاعدة المتوقعة للاسم (كلمتين إنجليزي أو أكثر) ليست مؤكدة من الباك إند بنفس صرامة Signup — أي خطأ validation يرجع من الـ API يظهر في الـ alert ورسائل الحقول.

**Response (نجاح):**
```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "_id": "6865d1f4b6b0d4d1d2a1f123",
    "fullname": "Raneem Magdy Elmahdy",
    "email": "user@example.com"
  }
}
```

---

## 5. تجميد الحساب

`DELETE /user/freeze`

**Header:** `Authorization: Bearer <access_token>`

بيعمل **soft delete** — الحساب مش بيتمسح فعليًا، الباك إند بيحط تاريخ في حقل `deletedAt`، وممكن يترجع تاني لو التطبيق دعم الاسترجاع لاحقًا.

**لازم يبقى في شاشة الإعدادات:**
- زرار "تجميد الحساب" بلون تحذيري (أحمر).
- Confirmation dialog قبل التنفيذ — ده إجراء لا يمكن التراجع عنه من واجهة المستخدم، فلازم تأكيد صريح.

**Response (نجاح):**
```json
{ "message": "Account frozen successfully", "success": true, "status": 200 }
```

---

## 6. رفع/تعديل صورة البروفايل (جديد)

`PATCH /user/profile-pic`

**Header:** `Authorization: Bearer <access_token>`
**Content-Type:** `multipart/form-data`

**Form Data:**

| Key | النوع | إلزامي | الوصف |
| --- | --- | --- | --- |
| profilePic | File | ✅ | صورة البروفايل — **الحد الأقصى لحجم الملف 5MB** |

**Response (نجاح):**
```json
{
  "success": true,
  "data": { "url": "https://res.cloudinary.com/..." }
}
```
> ملحوظة شكل استجابة مختلف هنا: الـ response بتاع الـ endpoint ده **من غير** `message` و `status` زي باقي الـ endpoints (بس `success` و `data`) — تعاملي معاه بحذر لو الـ API client بتاعك بيفترض وجود الحقلين دول دايمًا.

**سلوك مهم:** لو المستخدم عنده صورة قديمة بالفعل، الباك إند بيمسحها تلقائيًا من التخزين (Cloudinary) قبل ما يرفع الجديدة — يعني زرار "تغيير الصورة" في الواجهة بيستخدم نفس الـ endpoint ده سواء كانت أول صورة أو استبدال لصورة موجودة، مفيش فرق في الاستدعاء.

**تنفيذ الرفع في الفرونت:** لازم `FormData` مش JSON عادي:
```js
const formData = new FormData();
formData.append("profilePic", file);
```

---

## 7. حذف صورة البروفايل (جديد)

`DELETE /user/profile-pic`

**Header:** `Authorization: Bearer <access_token>`

**Response (نجاح):**
```json
{ "success": true, "message": "Profile picture deleted successfully" }
```

**Response (فشل — مفيش صورة أصلاً):**
```json
{ "success": false, "message": "You don't have a profile picture" }
```
**Status:** `404`

> لو زرار "حذف الصورة" ظاهر في الواجهة، اخفيه أو عطّليه لو الـ `GET /user` رجّع إن المستخدم مفيهوش صورة أصلاً، بدل ما تسيبي المستخدم يدوس عليه ويطلعله خطأ 404.

---

## ملاحظات عامة للأجنت

- الـ endpoints دي كل واحد فيها بيرجع شكل response شوية مختلف عن التاني (بعضها فيه `status`/`message` كاملين، وبعضها (صورة البروفايل) مختصر أكتر) — لازم الـ API client يكون متسامح مع الاختلاف ده، ميفترضش إن كل response لازم يكون فيه نفس الحقول بالظبط.
- بعض الـ headers في الـ Postman مكتوبة `authorization` بحروف صغيرة وبعضها `Authorization` بحرف كبير — HTTP headers مش حساسة لحالة الأحرف، فمفيش فرق فعلي، استخدمي `Authorization` بالشكل القياسي في كودك.
