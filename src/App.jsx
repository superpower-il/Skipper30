import { useState, useEffect, useCallback, useRef } from "react";
import './index.css';

// ─── DATA ───────────────────────────────────────────────────────────────────

const SUBJECTS = {
  seamanship: {
    id: "seamanship",
    name: "ימאות ג׳",
    icon: "⚓",
    color: "#0077B6",
    examInfo: "50 שאלות אמריקאיות, 90 דקות",
    summary: `
## ימאות ג׳ — סיכום נושאים

### חוקי הדרך בים (COLREGs)
- **זכויות קדימה**: מפרשית > דייג > מוגבל בתמרון > ממונע. עוקף תמיד מפנה דרך.
- **חרטום מול חרטום**: שניהם פונים ימינה.
- **חוצה מימין**: הספינה מימין — עליך לפנות לה דרך.
- **אורות לילה**: ירוק (ימין), אדום (שמאל), לבן (ירכתיים/עוגן/גרירה).
- **צורות יום**: כדור = עוגן, יהלום = גרירה, חרוט = מפרשית עם מנוע.

### יציבות הספינה
- **מרכז כובד (G)** — נקודת מרכז המשקל. ככל שנמוך יותר = יציב יותר.
- **מרכז עילוי (B)** — מרכז החלק השקוע במים.
- **טלטול מהיר** = G נמוך מדי. **טלטול איטי** = G גבוה מדי (מסוכן!).
- **מיכלים חלקית מלאים** מקטינים יציבות (אפקט משטח חופשי).

### ציוד בטיחות
- אפודות הצלה לכל נפש + 10%.
- גלגלי הצלה: 2 לפחות (אחד עם אור, אחד עם חבל).
- זיקוקים: 4 אדומים (ידניים) + 2 מצנח + 2 עשן כתום.
- מטף כיבוי אש, משאבת שיפוליים, קרן ערפל.

### מזג אוויר ותופעות ברומטריות
- **שקע שרבי**: רוח דרום-מערבית חזקה, ראות גרועה, אופייני לאביב.
- **חזית קרה**: ירידת לחץ חדה, גשמים, רוח מסתובבת.
- **ברומטר יורד** = מזג אוויר מתדרדר.
- **סולם בופור**: 0 = שקט, 4 = גלים בינוניים, 8 = סערה.

### תקנות ספנות
- שייט חופי = עד 20 מייל מהחוף.
- אסור לשוט בתחום חוף רחצה מוכרז.
- מרחק 200 מ׳ מספינת צוללנים (דגל A).
- חובת דיווח על תאונה ימית לרשות הספנות.
`,
    flashcards: [
      { q: "מה הכלל כשחרטום מול חרטום?", a: "שני כלי השייט פונים ימינה" },
      { q: "מי מפנה דרך — מפרשית או ממונע?", a: "הממונע מפנה למפרשית" },
      { q: "מה המשמעות של דגל A?", a: "צוללן במים — יש להתרחק 200 מטר" },
      { q: "מה גורם לטלטול איטי ומסוכן?", a: "מרכז כובד (G) גבוה מדי" },
      { q: "כמה זיקוקי מצנח חובה בספינה?", a: "2 זיקוקי מצנח אדומים" },
      { q: "מה שייט חופי?", a: "הפלגה עד 20 מייל ימי מהחוף" },
      { q: "מה צורת היום של ספינה על עוגן?", a: "כדור שחור" },
      { q: "מה משפיע מיכל דלק חלקית מלא על יציבות?", a: "מקטין יציבות — אפקט משטח חופשי" },
      { q: "מה סימון אור ירוק בצד ימין של הספינה?", a: "זהו אור הצד הימני (סטארבורד)" },
      { q: "מתי חובה לדווח על תאונה ימית?", a: "מיד לרשות הספנות" },
      { q: "מה הכלל לגבי עוקף?", a: "העוקף תמיד מפנה דרך לנעקף" },
      { q: "ברומטר יורד — מה המשמעות?", a: "מזג אוויר מתדרדר" },
    ],
    questions: [
      { q: "במהלך השנים ראייתך נפגמה, מה עליך לעשות?", options: ["לדווח מיד לרשות הספנות", "אין צורך לדווח מכיוון שהפגם תוקן", "יש לדווח תוך 12 יום", "יש לדווח בזמן חידוש הרישיון"], correct: 0 },
      { q: "מה מתוך התשובות הבאות מוגדר כתאונה ימית?", options: ["עלייה לשרטון חול וכתוצאה מכך ציר המדחף נפגע", "פגיעה באיש צוות", "תוך כדי תמרון נפגע אדם ברציף מחבל היקשרות", "כל התשובות נכונות"], correct: 3 },
      { q: "כאשר הספינה נמצאת במצב טלטול, מה הסיבה שהטלטולים יהיו מאוד איטיים?", options: ["מרכז הכובד נמוך מדיי", "מרכז הכובד גבוה מדיי", "מרכז העילוי גבוה מדיי", "מרכז העילוי נמוך מדיי"], correct: 1 },
      { q: "בספינתך 2 סיפונים — אם כל הנוסעים ירדו לסיפון התחתון, מה יקרה ליציבות?", options: ["אין שינוי ביציבות", "היציבות גדלה כי מרכז העילוי עלה", "היציבות קטנה כי מרכז הכובד עולה", "הטלטולים יהיו מהירים יותר"], correct: 3 },
      { q: "כיצד משפיעים מיכלי דלק ומים שאינם מלאים על יציבות הספינה?", options: ["אין השפעה", "מורידים מרכז כובד", "מקטינים את היציבות", "תשובות ב׳ ו-ג׳ נכונות"], correct: 3 },
      { q: "בהתייחס ליציבות — מה עדיף ביחס לאחסון נוזלים?", options: ["שכל המיכלים יהיו מלאים או ריקים", "מיכלי המים מלאים, דלק ריק", "לחלק שווה בין מיכלים", "אסור למלא דלק עד הסוף"], correct: 0 },
      { q: "מהו הטווח מהחוף שמותר לשוט ללא הגבלת מהירות?", options: ["עד 4 מייל מהחוף", "המרחק שמתיר הרישיון אך לא פחות מ-300 מ׳ מקו שפל", "בין קו שפל ועד 300 מ׳ מהחוף", "מהחוף עד המרחק שמתיר הרישיון"], correct: 1 },
      { q: "באלו תנאים רשאי משיט להפליג בתחום חוף רחצה מוכרז?", options: ["רק למצילים", "רק בשעות חשיכה", "אסור בשום אופן ובשום תנאי", "במהירות איטית בלבד"], correct: 2 },
      { q: "האם רשאי הקברניט לסרב להעלות נוסע?", options: ["כן, כשהנוסע עלול לסכן את עצמו/כלי השייט/הנוסעים", "כן, לפי ראות עיניו", "בשום מקרה לא", "רק עם אישור קצין ביטחון"], correct: 0 },
      { q: "בהפלגה במזג אוויר קשה — הספינה מתחילה להיחבט (POUNDING). מה תעשה?", options: ["אעביר משקל מחרטום לירכתיים", "אעביר משקל מירכתיים לחרטום", "אוריד מהירות ואעלה לגל בזווית 60-70 מעלות", "אעלה בניצב וארד ב-80 מעלות"], correct: 2 },
      { q: "על מסך המכ״ם — מטרה שהתכווין שלה לא משתנה. מה המשמעות?", options: ["יש סכנת התנגשות עם שתי המטרות", "אין סכנת התנגשות", "יש סכנת התנגשות עם מטרה זו", "יש סכנת התנגשות עם מטרה אחרת"], correct: 2 },
      { q: "מהו המחיר שיש לגבות עבור מי שתייה בספינה?", options: ["לפי סוג השתייה ומחירי שוק", "5 ₪ לכוס", "הקברניט קובע", "אסור לגבות כסף עבור מי שתייה"], correct: 3 },
      { q: "מה כולל צוות הבטיחות בספינה עד 55 נוסעים?", options: ["משיט 40, משיט 12, מכונן, איש צוות", "משיט 40, משיט 20, מכונן", "משיט 40, משיט 12, מכונן", "משיט 40, מכונן שהוא גם איש צוות"], correct: 2 },
      { q: "כמה גלגלי הצלה חובה בספינה עד 55 נוסעים?", options: ["4 (2 עם אור + 2 עם חבל)", "6 (4 עם אור + 2 עם חבל)", "3 (2 עם אור + 1 עם חבל)", "לכל 4 נוסעים גלגל אחד"], correct: 0 },
      { q: "מה מספר המלווים לקבוצת 25 ילדים מתחת לגיל 12?", options: ["3 מלווים", "מלווה אחד", "4 מלווים", "אין צורך במלווים"], correct: 2 },
      { q: "בעת תמרון במרינה נתפס חבל במדחף — מה תעשה?", options: ["מוריד אדם עם מסכת צלילה", "כמו א׳ אבל מניף דגל צולל", "אסור לצלול ללא אישור מנהל המרינה", "אפשר לצלול ולהזהיר סביבה"], correct: 2 },
      { q: "ספינה מניפה דגל A עוגנת 120 מ׳ ממך — מה תעשה?", options: ["אין צורך לעשות דבר", "אני הגעתי ראשון, אחזור ראשון", "אתנתק ואחכה עד מרחק 200 מ׳ לפני הפעלת מנוע", "אין אפשרות לצאת"], correct: 2 },
      { q: "בחרטום הספינה מרימים 4 טון במנוף — כיצד ישפיע על יציבות?", options: ["מרכז הכובד יורד", "מרכז הכובד יעלה", "מרכז הציפה ישתנה", "אין השפעה"], correct: 1 },
    ],
  },
  mechanics: {
    id: "mechanics",
    name: "מכונאות",
    icon: "⚙️",
    color: "#E63946",
    examInfo: "50 שאלות אמריקאיות, 90 דקות",
    summary: `
## מכונאות — סיכום נושאים

### מנועי דיזל — עקרונות פעולה
- **4 פעימות**: יניקה → דחיסה → שריפה/התפשטות → פליטה.
- דלק מוזרק בלחץ גבוה ע״י מזרקים (אינג׳קטורים).
- הצתה עצמית (לא בוגי כמו בנזין).
- יחס דחיסה גבוה (14:1 עד 22:1).

### מערכת קירור
- **קירור ישיר**: מי ים עוברים דרך המנוע (סכנת קורוזיה).
- **קירור עקיף**: מי מתוקים במנוע + מחליף חום עם מי ים.
- **תרמוסטט**: מווסת טמפרטורה. תקלה = התחממות יתר.
- **משאבת מי ים**: אימפלר גומי. יש להחליף תקופתית.

### מערכת שימון
- שמן מנוע מונע חיכוך, מקרר ומגן מקורוזיה.
- **סנן שמן** — להחליף בכל החלפת שמן.
- **לחץ שמן נמוך** = עצור מנוע מיד!
- בדיקת שמן: מנוע קר, ספינה ישרה.

### מערכת דלק
- סנן דלק ראשוני (מפריד מים) + סנן משני.
- **אוויר במערכת דלק** = מנוע לא מתניע. פתרון: אוורור (bleeding).
- מיכל דלק: פקק אוורור, ברז ניתוק, סנן.
- **זיהום דלק**: מים, אלגות, חלודה — סנן מפריד מים פותר.

### מערכת חשמל
- מצברים: 12V או 24V. חיבור טורי מעלה מתח, מקבילי מעלה קיבולת.
- **גנרטור/אלטרנטור** — טוען מצברים בזמן שהמנוע עובד.
- נתיך (פיוז) מגן מקצר חשמלי.
- אלקטרוליזה: זרם תועה גורם לשחיקת מתכות.
- **אנודות הקרבה** (אבץ) — מגנות מקורוזיה גלוונית.

### מדחף וציר
- **מדחף ימני** = נטייה לפנות ירכתיים ימינה (אפקט paddle).
- פיץ׳ (pitch) = מרחק תיאורטי לסיבוב אחד.
- חבל במדחף → כבה מנוע מיד!
- שומן בבית הציר — בדיקה תקופתית.
`,
    flashcards: [
      { q: "מהן 4 הפעימות של מנוע דיזל?", a: "יניקה → דחיסה → שריפה/התפשטות → פליטה" },
      { q: "מה ההבדל בין קירור ישיר לעקיף?", a: "ישיר = מי ים במנוע. עקיף = מי מתוקים + מחליף חום" },
      { q: "מה לעשות כשלחץ שמן נמוך?", a: "לעצור את המנוע מיד!" },
      { q: "מה הגורם הנפוץ למנוע שלא מתניע?", a: "אוויר במערכת הדלק — צריך אוורור (bleeding)" },
      { q: "מה תפקיד אנודות אבץ?", a: "הגנה מקורוזיה גלוונית — מתכלות במקום גוף הספינה" },
      { q: "מה אפקט paddle במדחף ימני?", a: "נטייה של הירכתיים לנוע ימינה" },
      { q: "מה תפקיד התרמוסטט?", a: "ווסות טמפרטורת המנוע — פתיחה/סגירה של מעגל הקירור" },
      { q: "איך מחברים מצברים בטורי?", a: "פלוס לפלוס, מינוס למינוס — מתח עולה, קיבולת זהה" },
      { q: "מה פיץ׳ של מדחף?", a: "המרחק התיאורטי שהמדחף מתקדם בסיבוב אחד" },
      { q: "נתפס חבל במדחף — מה עושים?", a: "כיבוי מנוע מיידי!" },
    ],
    questions: [
      { q: "מהו יחס הדחיסה של מנוע דיזל ימי?", options: ["6:1 עד 8:1", "8:1 עד 12:1", "14:1 עד 22:1", "25:1 עד 30:1"], correct: 2 },
      { q: "מה סוג ההצתה במנוע דיזל?", options: ["הצתה בבוגי", "הצתה עצמית מדחיסה", "הצתה חשמלית", "הצתה מגנטית"], correct: 1 },
      { q: "מה תפקיד האימפלר במשאבת מי ים?", options: ["סינון מי ים", "שאיבת מי ים לקירור", "מניעת זרימה חוזרת", "חימום מי ים"], correct: 1 },
      { q: "מה עליך לעשות כשלחץ השמן יורד מתחת למינימום?", options: ["להוסיף שמן תוך כדי נסיעה", "לעצור מנוע מיד", "להמתין ולבדוק שוב", "להגביר סל״ד"], correct: 1 },
      { q: "כיצד מאבחנים אוויר במערכת הדלק?", options: ["עשן שחור מהפליטה", "מנוע לא מתניע / מתניע ונעצר", "רעש חריק מהמנוע", "מנוע עובד בסל״ד גבוה"], correct: 1 },
      { q: "מה תפקיד סנן מפריד המים במערכת הדלק?", options: ["סינון חלקיקים בלבד", "הפרדת מים מהדלק", "אוורור מערכת הדלק", "קירור הדלק"], correct: 1 },
      { q: "מה סוג הקירור המומלץ למנוע ימי?", options: ["קירור אוויר", "קירור ישיר במי ים", "קירור עקיף — מי מתוקים + מחליף חום", "אין צורך בקירור"], correct: 2 },
      { q: "מהי אלקטרוליזה בהקשר הימי?", options: ["תהליך טעינת מצבר", "זרם תועה שגורם שחיקת מתכות", "חיבור מצברים במקביל", "תקלה באלטרנטור"], correct: 1 },
      { q: "מה תפקיד אנודת ההקרבה (אבץ)?", options: ["חיזוק מבנה הספינה", "הגנה מקורוזיה גלוונית", "שימון ציר המדחף", "איטום גוף הספינה"], correct: 1 },
      { q: "כיצד מחברים שני מצברי 12V כדי לקבל 24V?", options: ["מקביל", "טורי", "לא ניתן", "בעזרת ממיר"], correct: 1 },
      { q: "מה המשמעות של ״פיץ׳״ (pitch) של מדחף?", options: ["קוטר המדחף", "מרחק תיאורטי לסיבוב", "מספר הלהבים", "זווית ההתקנה"], correct: 1 },
      { q: "מה תפקיד התרמוסטט במנוע?", options: ["סינון מי קירור", "ווסות טמפרטורת המנוע", "שאיבת מי קירור", "כיבוי אוטומטי"], correct: 1 },
      { q: "מדחף ימני — לאיזה כיוון נוטות הירכתיים?", options: ["שמאלה", "ימינה", "למעלה", "ללא השפעה"], correct: 1 },
      { q: "מה קורה כשחבל נתפס במדחף?", options: ["מגבירים סל״ד לחיתוך", "מכבים מנוע מיד", "משנים כיוון סיבוב", "ממתינים שיתנתק"], correct: 1 },
      { q: "מה תפקיד האלטרנטור?", options: ["התנעת המנוע", "טעינת מצברים בזמן שהמנוע עובד", "הפעלת מזרק הדלק", "קירור המנוע"], correct: 1 },
    ],
  },
  navigation_coastal: {
    id: "navigation_coastal",
    name: "ניווט חופי (א׳)",
    icon: "🗺️",
    color: "#2A9D8F",
    examInfo: "6 שאלות פתוחות + שרטוט על מפה, 120 דקות",
    summary: `
## ניווט חופי (א׳) — סיכום נושאים

### מושגי יסוד
- **קו רוחב (Latitude)**: מרחק צפון/דרום מקו המשווה. נמדד ב-0°–90°.
- **קו אורך (Longitude)**: מרחק מזרח/מערב מגריניץ׳. 0°–180°.
- **מייל ימי**: דקת קשת אחת על קו הרוחב = 1,852 מטר.
- **קשר (Knot)**: מייל ימי לשעה.

### סוגי כיוונים
- **כיוון אמיתי (True)**: ביחס לצפון האמיתי.
- **כיוון מגנטי (Magnetic)**: True ± שגיאה (Variation).
- **כיוון מצפן (Compass)**: Magnetic ± סטייה (Deviation).
- **נוסחה**: True ± Variation = Magnetic ± Deviation = Compass.

### שרטוט על מפה
- **קו מקום (LOP)**: קו שעליו אנחנו נמצאים. נוצר מכיוון למתנוסס.
- **חתך שני קווי מקום** = מיקום (Fix).
- **העברת קו מקום**: הזזת LOP ישן למרחק שעברנו — Running Fix.
- **שרטוט קורס**: קו מ-A ל-B + מדידת כיוון בסרגל/מד זווית.

### חישובי ניווט
- **מהירות = מרחק / זמן**.
- **DMG** (Distance Made Good) — מרחק בפועל שנעשה.
- **CMG** (Course Made Good) — כיוון בפועל.
- **סחף (Drift)**: השפעת זרם ים. יש לחשב תיקון כיוון.
- **שמיכת רוח (Leeway)**: השפעת רוח צד. מוסיפים/מחסירים זווית.

### מתנוססים ותאורות
- **אור מהבהב (Fl)**: הבהוב קצר + חושך ארוך.
- **אור קבוע (F)**: דולק ברציפות.
- **Oc**: אור ארוך + חושך קצר.
- **Q**: הבהוב מהיר.
- **מאפיינים**: צבע, מחזוריות, גובה, טווח.
`,
    flashcards: [
      { q: "מהו מייל ימי?", a: "דקת קשת אחת על קו רוחב = 1,852 מטר" },
      { q: "מהו קשר (Knot)?", a: "מייל ימי לשעה" },
      { q: "מה הנוסחה: True ↔ Compass?", a: "True ± Variation = Magnetic ± Deviation = Compass" },
      { q: "מהו קו מקום (LOP)?", a: "קו שעליו אנחנו נמצאים, נוצר מכיוון למתנוסס" },
      { q: "איך קובעים מיקום (Fix)?", a: "חתך של שני קווי מקום לפחות" },
      { q: "מהו Running Fix?", a: "העברת קו מקום ישן למרחק שעברנו + חתך עם קו חדש" },
      { q: "מה ההבדל בין Variation ל-Deviation?", a: "Variation = שגיאת שדה מגנטי. Deviation = סטיית מצפן מברזל בספינה" },
      { q: "מהו DMG?", a: "Distance Made Good — המרחק שנעשה בפועל" },
      { q: "מהו סחף (Drift)?", a: "השפעת זרם הים על מסלול הספינה" },
      { q: "מהו אור Fl (Flash)?", a: "אור מהבהב: הבהוב קצר + חושך ארוך" },
    ],
    questions: [
      { q: "מהו מייל ימי (Nautical Mile)?", options: ["1,000 מטר", "1,852 מטר", "2,000 מטר", "1,609 מטר"], correct: 1 },
      { q: "מה הכיוון האמיתי של ספינה שמפליגה מזרחה?", options: ["000°", "090°", "180°", "270°"], correct: 1 },
      { q: "Variation במפה הוא 3°W. כיוון אמיתי 045°. מה הכיוון המגנטי?", options: ["042°", "045°", "048°", "050°"], correct: 2 },
      { q: "כמה קווי מקום נדרשים לקביעת Fix?", options: ["1", "2 לפחות", "3 לפחות", "4"], correct: 1 },
      { q: "מהירות הספינה 6 קשר. כמה זמן ייקח לעבור 18 מייל?", options: ["2 שעות", "3 שעות", "4 שעות", "2.5 שעות"], correct: 1 },
      { q: "מה המשמעות של אור Fl(3) 15s?", options: ["אור קבוע כל 15 שניות", "3 הבהובים כל 15 שניות", "הבהוב אחד כל 3 שניות", "אור חוזר 15 פעמים"], correct: 1 },
      { q: "באיזה צד של המפה נמדד קו הרוחב?", options: ["למעלה ולמטה", "בצדדים (מזרח/מערב)", "למעלה בלבד", "לא רלוונטי"], correct: 1 },
      { q: "מה Running Fix?", options: ["מדידת מהירות", "העברת LOP ישן + חתך עם חדש", "Fix משני מתנוססים בו-זמנית", "חישוב סחף"], correct: 1 },
      { q: "סחף ימי (current) גורם ל:", options: ["שינוי מהירות בלבד", "שינוי כיוון בלבד", "שינוי כיוון ומהירות בפועל", "לא משפיע"], correct: 2 },
      { q: "Leeway (שמיכת רוח) נגרם ע״י:", options: ["זרם ים", "רוח צד", "גלים", "משקל יתר"], correct: 1 },
    ],
  },
  navigation_instruments: {
    id: "navigation_instruments",
    name: "ניווט מכשירים (ב׳)",
    icon: "🧭",
    color: "#9B5DE5",
    examInfo: "50 שאלות אמריקאיות, 90 דקות",
    summary: `
## ניווט מכשירים (ב׳) — סיכום נושאים

### מצפן מגנטי
- פועל ע״י שדה מגנטי של כדור הארץ.
- **שגיאה (Variation)**: הפרש בין צפון אמיתי למגנטי. משתנה לפי מיקום.
- **סטייה (Deviation)**: השפעת ברזל/חשמל בספינה על המצפן.
- **כיוול (Swing)**: בדיקת סטייה ע״י סיבוב הספינה 360°.
- טבלת סטייה (Deviation Card) — לכל כיוון סטייה שונה.

### GPS
- מערכת ניווט לוויינית — מינימום 3 לוויינים למיקום, 4 לגובה.
- **דיוק**: ±5-15 מטר.
- **DGPS**: GPS דיפרנציאלי — דיוק משופר.
- **COG** (Course Over Ground) = כיוון מעל הקרקע.
- **SOG** (Speed Over Ground) = מהירות מעל הקרקע.

### מכ״ם (Radar)
- שולח גלי רדיו ומקבל הדים.
- **טווח**: נמדד בזמן חזרת ההד.
- **כיווון**: נמדד בזווית האנטנה.
- **ARPA**: מעקב אוטומטי — מחשב CPA ו-TCPA.
- **CPA** (Closest Point of Approach) = נקודת ההתקרבות המקסימלית.
- **צל מכ״ם**: אזורים שלא נראים מאחורי מכשולים.

### אקו סאונדר (עומק)
- שולח גלי קול לקרקעית ומודד זמן חזרה.
- יש לכייל: שוקע (transducer) נמצא מתחת לקו המים.
- עומק מוצג = מתחת לשוקע (לא מתחת לקיל!).

### AIS (זיהוי אוטומטי)
- שידור מפרטים: שם, MMSI, מיקום, מהירות, כיוון, סוג.
- **Class A**: חובה בספינות מסחריות.
- **Class B**: אופציונלי, פחות נתונים.

### VHF רדיו
- ערוץ 16 — ערוץ מצוקה וקריאה בינלאומי.
- ערוץ 70 — DSC (קריאת מצוקה דיגיטלית).
- **MAYDAY**: סכנה מיידית לחיים/ספינה.
- **PAN PAN**: מצב דחוף אך לא סכנת חיים.
- **SECURITÉ**: הודעת בטיחות (מזג אוויר, סכנה).
`,
    flashcards: [
      { q: "מה ההבדל בין Variation ל-Deviation?", a: "Variation = שגיאה מגנטית של כדה״א. Deviation = השפעת ברזל/חשמל בספינה" },
      { q: "כמה לוויינים צריך GPS למיקום?", a: "מינימום 3 (ו-4 לגובה)" },
      { q: "מהו CPA?", a: "Closest Point of Approach — נקודת ההתקרבות המקסימלית" },
      { q: "מה ערוץ 16 ב-VHF?", a: "ערוץ מצוקה וקריאה בינלאומי" },
      { q: "מה ההבדל בין MAYDAY ל-PAN PAN?", a: "MAYDAY = סכנת חיים מיידית. PAN PAN = מצב דחוף ללא סכנה מיידית" },
      { q: "מהו COG?", a: "Course Over Ground — כיוון מעל הקרקע (מ-GPS)" },
      { q: "מהו כיוול (Swing)?", a: "בדיקת סטיית מצפן ע״י סיבוב 360° של הספינה" },
      { q: "מה מודד אקו סאונדר?", a: "עומק המים — ע״י שליחת גלי קול לקרקעית" },
      { q: "מהו AIS Class A?", a: "מערכת זיהוי אוטומטי חובה בספינות מסחריות" },
      { q: "מה SECURITÉ?", a: "הודעת בטיחות — מזג אוויר או סכנת ניווט" },
    ],
    questions: [
      { q: "מצפן מגנטי פועל ע״י:", options: ["שדה חשמלי", "שדה מגנטי של כדוה״א", "לוויינים", "גלי רדיו"], correct: 1 },
      { q: "מהו כיוול (Swing)?", options: ["כיול GPS", "בדיקת סטיית מצפן ע״י סיבוב 360°", "כיול מכ״ם", "בדיקת אקו סאונדר"], correct: 1 },
      { q: "כמה לוויינים נדרשים ל-GPS למיקום דו-ממדי?", options: ["2", "3", "4", "5"], correct: 1 },
      { q: "מהו CPA?", options: ["Course Per Approach", "Closest Point of Approach", "Current Position Angle", "Compass Point Adjustment"], correct: 1 },
      { q: "באיזה ערוץ VHF שולחים קריאת מצוקה?", options: ["ערוץ 9", "ערוץ 12", "ערוץ 16", "ערוץ 70"], correct: 2 },
      { q: "מה סדר העדיפות בקריאות רדיו?", options: ["PAN PAN > MAYDAY > SECURITÉ", "MAYDAY > PAN PAN > SECURITÉ", "SECURITÉ > MAYDAY > PAN PAN", "כולן שוות"], correct: 1 },
      { q: "מכ״ם ימי מודד:", options: ["עומק ים", "טווח וכיוון למטרות", "מהירות רוח", "טמפרטורת מים"], correct: 1 },
      { q: "מהו SOG?", options: ["Speed Of Gust", "Speed Over Ground", "Signal Output Gauge", "Standard Operating Guidelines"], correct: 1 },
      { q: "ARPA במכ״ם משמש ל:", options: ["שיפור תמונה", "מעקב אוטומטי וחישוב CPA", "מדידת עומק", "תקשורת"], correct: 1 },
      { q: "אקו סאונדר מודד עומק ע״י:", options: ["לחץ מים", "גלי קול", "גלי רדיו", "לייזר"], correct: 1 },
      { q: "AIS Class A חובה ב:", options: ["כל ספינה", "ספינות מסחריות", "ספינות פרטיות בלבד", "ספינות מפרש"], correct: 1 },
      { q: "מה DSC (ערוץ 70)?", options: ["Digital Sound Channel", "Digital Selective Calling — קריאת מצוקה דיגיטלית", "Data Signal Converter", "Depth Sounder Control"], correct: 1 },
    ],
  },
};

const SUBJECT_LIST = Object.values(SUBJECTS);

// ─── UTILITY ────────────────────────────────────────────────────────────────

function markdownToHtml(md, accentColor) {
  return md
    .replace(/^## (.+)$/gm, `<h2 style="color:${accentColor};font-size:22px;font-weight:800;margin:24px 0 12px;border-bottom:2px solid ${accentColor}22;padding-bottom:8px;">$1</h2>`)
    .replace(/^### (.+)$/gm, `<h3 style="color:var(--text);font-size:17px;font-weight:700;margin:20px 0 8px;">$1</h3>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${accentColor}">$1</strong>`)
    .replace(/^- (.+)$/gm, `<div style="padding:4px 0 4px 16px;margin:2px 0;font-size:14px;line-height:1.8;color:var(--text);">• $1</div>`)
    .replace(/\n\n/g, "<br/>");
}

const btnStyle = {
  padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
  fontFamily: "inherit", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
};

const btnSmall = {
  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 48, stroke = 4, color }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0e0e0" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 12, fontWeight: 700, fill: color }}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

function SubjectCard({ subject, onClick, stats }) {
  const pct = stats?.total > 0 ? (stats.correct / stats.total) * 100 : 0;
  return (
    <div onClick={onClick} style={{
      background: "var(--card)", borderRadius: 16, padding: "24px 20px", cursor: "pointer",
      border: "2px solid transparent", transition: "all 0.25s ease",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = subject.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${subject.color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{subject.icon}</div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{subject.name}</h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>{subject.examInfo}</p>
        </div>
        {stats?.total > 0 && <ProgressRing pct={pct} color={subject.color} />}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: `${subject.color}15`, color: subject.color, fontWeight: 600 }}>
          {subject.questions.length} שאלות
        </span>
        <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: `${subject.color}15`, color: subject.color, fontWeight: 600 }}>
          {subject.flashcards.length} כרטיסיות
        </span>
      </div>
    </div>
  );
}

function Quiz({ subject, onBack, onUpdateStats }) {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const shuffled = [...subject.questions].sort(() => Math.random() - 0.5).slice(0, Math.min(15, subject.questions.length));
    setQuestions(shuffled);
  }, [subject]);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setScore(s => s + 1);
    onUpdateStats(subject.id, isCorrect);
  };

  const nextQ = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  if (questions.length === 0) return null;

  if (finished) {
    const pct = (score / questions.length) * 100;
    const passed = pct >= 60;
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{passed ? "🎉" : "📚"}</div>
        <h2 style={{ color: "var(--text)", margin: 0 }}>{passed ? "כל הכבוד!" : "צריך עוד תרגול"}</h2>
        <p style={{ fontSize: 40, fontWeight: 800, color: passed ? "#2A9D8F" : "#E63946", margin: "16px 0" }}>
          {score}/{questions.length}
        </p>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>{Math.round(pct)}% — {passed ? "עברת!" : "ציון עובר: 60%"}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ ...btnStyle, background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}>חזרה</button>
          <button onClick={() => { setFinished(false); setCurrentQ(0); setScore(0); setSelected(null); setShowResult(false); const s = [...subject.questions].sort(() => Math.random() - 0.5).slice(0, 15); setQuestions(s); }}
            style={{ ...btnStyle, background: subject.color, color: "#fff" }}>מבחן חדש</button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div style={{ padding: "16px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={onBack} style={{ ...btnSmall, color: "var(--muted)" }}>← חזרה</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{currentQ + 1}/{questions.length}</span>
          <div style={{ width: 120, height: 6, borderRadius: 3, background: "var(--border)" }}>
            <div style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, height: "100%", borderRadius: 3, background: subject.color, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>
      <h3 style={{ color: "var(--text)", fontSize: 18, lineHeight: 1.6, marginBottom: 24, fontWeight: 600 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = "var(--card)", border = "var(--border)", textColor = "var(--text)";
          if (showResult) {
            if (i === q.correct) { bg = "#d4edda"; border = "#2A9D8F"; textColor = "#155724"; }
            else if (i === selected && i !== q.correct) { bg = "#f8d7da"; border = "#E63946"; textColor = "#721c24"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{
              padding: "14px 18px", borderRadius: 12, background: bg, border: `2px solid ${border}`,
              cursor: showResult ? "default" : "pointer", textAlign: "right", fontSize: 15, lineHeight: 1.5,
              color: textColor, fontFamily: "inherit", fontWeight: 500, transition: "all 0.2s",
            }}>
              <span style={{ fontWeight: 700, marginLeft: 8, color: subject.color }}>{String.fromCharCode(1488 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={nextQ} style={{ ...btnStyle, background: subject.color, color: "#fff", fontSize: 16 }}>
            {currentQ + 1 >= questions.length ? "סיום מבחן" : "שאלה הבאה →"}
          </button>
        </div>
      )}
    </div>
  );
}

function Flashcards({ subject, onBack }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards([...subject.flashcards].sort(() => Math.random() - 0.5));
  }, [subject]);

  if (cards.length === 0) return null;
  const card = cards[idx];

  return (
    <div style={{ padding: "16px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={onBack} style={{ ...btnSmall, color: "var(--muted)" }}>← חזרה</button>
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{idx + 1}/{cards.length}</span>
      </div>
      <div onClick={() => setFlipped(!flipped)} style={{
        minHeight: 220, borderRadius: 16, padding: 32, cursor: "pointer", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        background: flipped ? `${subject.color}10` : "var(--card)",
        border: `2px solid ${flipped ? subject.color : "var(--border)"}`,
        boxShadow: flipped ? `0 8px 32px ${subject.color}20` : "0 2px 12px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
      }}>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
          {flipped ? "תשובה" : "שאלה — לחץ לגלות"}
        </div>
        <p style={{ fontSize: 20, fontWeight: flipped ? 700 : 500, color: flipped ? subject.color : "var(--text)", lineHeight: 1.6, margin: 0 }}>
          {flipped ? card.a : card.q}
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
        <button disabled={idx === 0} onClick={() => { setIdx(i => i - 1); setFlipped(false); }}
          style={{ ...btnStyle, background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)", opacity: idx === 0 ? 0.4 : 1 }}>← הקודם</button>
        <button disabled={idx >= cards.length - 1} onClick={() => { setIdx(i => i + 1); setFlipped(false); }}
          style={{ ...btnStyle, background: subject.color, color: "#fff", opacity: idx >= cards.length - 1 ? 0.4 : 1 }}>הבא →</button>
      </div>
    </div>
  );
}

function Summary({ subject, onBack }) {
  return (
    <div style={{ padding: "16px 24px" }}>
      <button onClick={onBack} style={{ ...btnSmall, color: "var(--muted)", marginBottom: 16 }}>← חזרה</button>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "24px 20px", border: "1px solid var(--border)" }}>
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(subject.summary, subject.color) }} />
      </div>
    </div>
  );
}

function AIChat({ onBack }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "שלום! 👋 אני העוזר שלך ללימודי משיט 30. שאל אותי כל שאלה על ימאות, מכונאות, ניווט חופי וניווט מכשירים." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter((_, i) => i > 0) // skip initial greeting
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `שגיאה: ${err.message}. ודא שמפתח ה-API מוגדר.` }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ ...btnSmall, color: "var(--muted)" }}>← חזרה</button>
        <span style={{ fontWeight: 700, color: "var(--text)" }}>💬 צ׳אט AI — שאל מה שתרצה</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-start" : "flex-end",
            maxWidth: "85%", padding: "12px 16px", borderRadius: 16,
            background: m.role === "user" ? "#0077B6" : "var(--card)",
            color: m.role === "user" ? "#fff" : "var(--text)",
            border: m.role === "assistant" ? "1px solid var(--border)" : "none",
            fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
          }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-end", padding: "12px 16px", borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            חושב... 🤔
          </div>
        )}
        <div ref={chatEnd} />
      </div>
      <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="שאל שאלה על החומר..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)",
            background: "var(--card)", color: "var(--text)", fontSize: 14, fontFamily: "inherit",
            outline: "none", direction: "rtl",
          }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ ...btnStyle, background: "#0077B6", color: "#fff", padding: "12px 20px", opacity: loading || !input.trim() ? 0.5 : 1 }}>
          שלח
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [stats, setStats] = useState({});

  const updateStats = useCallback((subjectId, isCorrect) => {
    setStats(prev => {
      const s = prev[subjectId] || { correct: 0, total: 0 };
      return { ...prev, [subjectId]: { correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 } };
    });
  }, []);

  const goHome = () => { setView("home"); setSelectedSubject(null); };
  const goSubject = (s) => { setSelectedSubject(s); setView("subject"); };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "24px 24px 16px", borderBottom: view !== "home" ? "1px solid var(--border)" : "none" }}>
          {view === "home" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 28 }}>⛵</span>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "var(--text)", letterSpacing: -0.5 }}>משיט 30 — Notebook</h1>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)", fontWeight: 400 }}>כל החומר ל-4 מבחני התיאוריה במקום אחד</p>
            </div>
          )}
        </header>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {view === "home" && (
            <div style={{ padding: "8px 24px 24px" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <button onClick={() => setView("chat")} style={{
                  ...btnStyle, background: "linear-gradient(135deg, #0077B6, #00B4D8)", color: "#fff",
                  display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(0,119,182,0.25)",
                }}>💬 שאל את ה-AI</button>
              </div>
              <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--muted)" }}>ארבעת הנושאים</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {SUBJECT_LIST.map(s => (
                  <SubjectCard key={s.id} subject={s} stats={stats[s.id]} onClick={() => goSubject(s)} />
                ))}
              </div>
              {Object.keys(stats).length > 0 && (
                <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)" }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "var(--muted)" }}>סטטיסטיקות כלליות</h3>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {SUBJECT_LIST.map(s => {
                      const st = stats[s.id];
                      if (!st?.total) return null;
                      return (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <ProgressRing pct={(st.correct / st.total) * 100} size={40} stroke={3} color={s.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)" }}>{st.correct}/{st.total}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === "subject" && selectedSubject && (
            <div style={{ padding: "16px 24px" }}>
              <button onClick={goHome} style={{ ...btnSmall, color: "var(--muted)", marginBottom: 16 }}>← חזרה לדף הבית</button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 40 }}>{selectedSubject.icon}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--text)" }}>{selectedSubject.name}</h2>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{selectedSubject.examInfo}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "📝 מבחן תרגול", desc: `${Math.min(15, selectedSubject.questions.length)} שאלות אקראיות`, action: () => setView("quiz"), color: selectedSubject.color },
                  { label: "🃏 כרטיסיות לימוד", desc: `${selectedSubject.flashcards.length} כרטיסיות`, action: () => setView("flashcards"), color: "#E9C46A" },
                  { label: "📖 סיכום נושאים", desc: "כל החומר החשוב בקצרה", action: () => setView("summary"), color: "#2A9D8F" },
                  { label: "💬 שאל את ה-AI", desc: "שאל שאלה על הנושא", action: () => setView("chat"), color: "#0077B6" },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)",
                    background: "var(--card)", cursor: "pointer", fontFamily: "inherit", textAlign: "right", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <span style={{ fontSize: 20, color: "var(--muted)" }}>←</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "quiz" && selectedSubject && <Quiz subject={selectedSubject} onBack={() => setView("subject")} onUpdateStats={updateStats} />}
          {view === "flashcards" && selectedSubject && <Flashcards subject={selectedSubject} onBack={() => setView("subject")} />}
          {view === "summary" && selectedSubject && <Summary subject={selectedSubject} onBack={() => setView("subject")} />}
          {view === "chat" && <AIChat onBack={goHome} />}
        </div>

        {view === "home" && (
          <footer style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>⛵ נבנה עם ❤️ לסקיפרים העתידיים — בהצלחה במבחנים!</p>
          </footer>
        )}
      </div>
    </div>
  );
}
