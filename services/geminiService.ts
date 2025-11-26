
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (
  promptData: string,
  mode: string
): Promise<AnalysisResult | null> => {
  const model = "gemini-2.5-flash"; 

  const systemInstruction = `
    أنت "BioOS Strategic Core" (نظام التشغيل الحيوي)، عقل استراتيجي متفوق لتحليل المستقبل.
    
    مهمتك: قراءة البيانات، فهم "القرار المصيري" (Decision) بعمق، ومحاكاة النتيجة المستقبلية.

    مهم جداً: لا تستخدم تنسيق النجوم (**) أو الـ Markdown العريض في النصوص داخل ملف JSON نهائياً. اكتب نصاً عادياً فقط.

    يجب أن تكون مخرجاتك **حصرياً** بصيغة JSON بالتنسيق التالي:
    {
      "riskLevel": "POSITIVE" | "NEUTRAL" | "WARNING" | "DANGER",
      "swot": {
        "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3", "نقطة قوة 4"],
        "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", "نقطة ضعف 3", "نقطة ضعف 4"],
        "opportunities": ["فرصة 1", "فرصة 2", "فرصة 3", "فرصة 4"],
        "threats": ["تهديد 1", "تهديد 2", "تهديد 3", "تهديد 4"]
      },
      "prediction": "سيناريو المستقبل المتوقع (بعد سنة، 3 سنوات، و 5 سنوات). كن سردياً ومفصلاً واربط التوقع بقرار المستخدم. (لا تستخدم نجوم للتنسيق)",
      "strategy": "الملخص الاستراتيجي للقرار (لماذا نفعله أو لماذا نتجنبه). (لا تستخدم نجوم للتنسيق)",
      "executionSteps": [
        "خطوة 1: وصف دقيق لأول إجراء عملي يجب اتخاذه",
        "خطوة 2: الإجراء الثاني",
        "خطوة 3: الإجراء الثالث",
        "خطوة 4: الإجراء الرابع"
      ]
    }

    قواعد التحليل حسب المسار:
    
    1. **مسار الأفراد (PERSONAL) - التركيز على "decision":**
       - "decision": هو أهم مدخل. اربطه فوراً بـ (الدخل، المدخرات، الالتزامات العائلية).
       - مثال: شخص راتبه 3000 ومدخراته 0 ويريد الاستقالة لفتح مشروع -> Risk: DANGER.
       - مثال: شخص لديه مدخرات تكفي سنة وخطة واضحة -> Risk: POSITIVE.
       - Execution Steps: أعط خطوات فعلية (مثلاً: "لا تستقل الآن، ابدأ المشروع جانبيًا لمدة 6 أشهر").

    2. **مسار الشركات (BUSINESS) - التركيز على "decision":**
       - حلل "القرار الاستراتيجي/الفكرة" المدخلة بناءً على رأس المال وطبيعة الصناعة.
       - Risk Level: قيم خطورة هذا القرار على استدامة الشركة.
       - Strategy: هل هذا القرار (توسع، منتج جديد، هيكلة) مناسب لوضع الشركة المالي؟
       - Execution Steps: خطوات عملية لتنفيذ هذا القرار الاستراتيجي بنجاح (دراسة جدوى، توظيف، تسويق، إلخ).

    3. **مسار الطلاب (STUDENT):**
       - **إذا كان المستوى "المتوسط" (MIDDLE):**
         - الهدف الحصري: **توجيه الطالب لاختيار المسار المناسب في الثانوي (علمي أم أدبي)**.
         - قارن مجموع درجات المواد العلمية (الرياضيات، العلوم، التقنية، تكنولوجيا المعلومات) مقابل المواد الأدبية (العربي، الانجليزي، التاريخ، الجغرافيا).
         - Prediction: يجب أن تكون النتيجة واضحة: "بناءً على درجاتك، أنت مؤهل بنسبة كبيرة للمسار [العلمي/الأدبي] في الثانوي".
         - Strategy: اشرح لماذا اخترت هذا المسار (مثلاً: "درجاتك في العلوم والرياضيات تؤهلك للتميز في العلمي").
         - Execution Steps: خطوات عملية للتحضير للمسار المختار (مثلاً: للمسار العلمي: "ركز على تقوية أساسيات الجبر"، للمسار الأدبي: "ابدأ بقراءة الروايات التاريخية").

       - **إذا كان المستوى "الثانوي" (SECONDARY):**
         - حلل توافق الدرجات والمسار (علمي/أدبي) مع التخصص الجامعي المحتمل.
         - Execution Steps: مواد للتركيز عليها لرفع المعدل التراكمي ودورات مقترحة.

    4. **مسار الحكومات (GOVERNMENT):**
       - الأثر الاجتماعي والاقتصادي.
       - Execution Steps: سياسات أو قرارات يجب إصدارها.

    ملاحظة: كن واقعياً جداً (Brutal Honesty). إذا كان القرار سيؤدي للإفلاس، قل له ذلك في التنبؤ وضع Risk: DANGER.
  `;

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, 
        responseMimeType: "application/json"
      },
    });

    const result = await chat.sendMessage({ message: `Mode: ${mode}\nData: ${promptData}` });
    const text = result.text;
    
    try {
        const jsonStr = text?.replace(/```json/g, '').replace(/```/g, '').trim();
        if (!jsonStr) return null;
        return JSON.parse(jsonStr) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return null;
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getChatResponse = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'أنت مساعد ذكي لبوابة السودان الرقمية. ساعد المستخدمين في الخدمات الحكومية والزراعة الذكية. اجابتك يجب أن تكون مختصرة ومفيدة وباللغة العربية. تنبيه: لا تستخدم النجوم (**) لتنسيق النص.',
      },
      history: history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage({ message: message });
    return result.text || "عذراً، لم أتمكن من الرد.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "عذراً، حدث خطأ في النظام.";
  }
};