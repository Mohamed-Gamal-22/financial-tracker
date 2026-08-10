# شاشة الحساب (User) — مصروف

**Base URL:** `https://finance-tracker-five-liart.vercel.app`

> شكل الـ Response العام (نجاح/فشل) موجود بالتفصيل في ملف `login-register.md` — نفس الشكل ساري هنا.

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

**⚠️ شرط أساسي:** التجديد مسموح بس لو الـ access token باقيله **5 دقايق أو أقل** على انتهاءه. لو حاولتي تجددي قبل كده، هيرفض.

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

## 4. تجميد الحساب

`DELETE /user/freeze`

**Header:** `Authorization: Bearer <access_token>`

بيعمل **soft delete** — الحساب مش بيتمسح فعليًا، بس بيتحط عليه تاريخ تجميد وممكن يترجع تاني لو التطبيق دعم الاسترجاع لاحقًا.

**لازم يبقى في شاشة الإعدادات:**
- زرار "تجميد الحساب" بلون تحذيري (أحمر).
- Confirmation dialog قبل التنفيذ — ده إجراء لا يمكن التراجع عنه من واجهة المستخدم، فلازم تأكيد صريح.

**Response (نجاح):**
```json
{ "message": "Account frozen successfully", "success": true, "status": 200 }
```

---

## ملاحظة تقنية للأجنت

بعض الـ requests في الـ Postman بتستخدم `{{LOCAL_BASE}}` بدل `{{BASE_URL_FINANCE_TRACKER}}` (زي profile و freeze) — ده على الأغلب فرق بيئة تطوير محلية عند الباك إند مش فرق حقيقي في الـ API، فاستخدمي نفس الـ Base URL الموحّد فوق لكل الـ endpoints.
