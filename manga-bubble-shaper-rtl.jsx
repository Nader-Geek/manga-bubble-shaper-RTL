// المتغيرات العامة
var MINIMUM_WORDS_PER_LINE = 2;
var MAXIMUM_LINE_LENGTH = 15;

// دالة التحقق من النص العربي
function isRTL(text) {
    const rtlChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return rtlChars.test(text);
}

// دالة معالجة علامات الترقيم العربية
function convertPunctuation(text) {
    const punctuationMap = {
        '?': '؟',
        ',': '،',
        ';': '؛',
        '...': '…'
    };
    
    return text.replace(/[?,;]|\.\.\./g, match => punctuationMap[match] || match);
}

// الدالة الرئيسية لتشكيل النص
function shapeArabicText(text) {
    // تنظيف النص وتحويل علامات الترقيم
    text = text.trim();
    text = convertPunctuation(text);
    
    // تقسيم النص إلى كلمات
    let words = text.split(' ').filter(word => word.length > 0);
    
    // معالجة خاصة للنصوص القصيرة
    if (words.length <= 3) {
        return handleShortText(words);
    }
    
    // تشكيل النص في فقاعة الحوار
    return shapeLongText(words);
}

function handleShortText(words) {
    if (words.length === 2) {
        return words.join(' ');
    } else if (words.length === 3) {
        return words[0] + ' ' + words[1] + '\n' + words[2];
    }
    return words.join(' ');
}

function shapeLongText(words) {
    let lines = [];
    let currentLine = [];
    let currentLength = 0;
    
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        
        if (currentLine.length === 0) {
            currentLine.push(word);
            currentLength = word.length;
        } else {
            if (currentLength + word.length + 1 <= MAXIMUM_LINE_LENGTH) {
                currentLine.push(word);
                currentLength += word.length + 1;
            } else {
                if (currentLine.length < MINIMUM_WORDS_PER_LINE && i < words.length - 1) {
                    currentLine.push(word);
                } else {
                    lines.push(currentLine.join(' '));
                    currentLine = [word];
                    currentLength = word.length;
                }
            }
        }
    }
    
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }
    
    return lines.join('\n');
}

// الدالة الرئيسية للسكريبت
function main() {
    if (app.documents.length === 0) return;
    
    var doc = app.activeDocument;
    var selectedLayers = doc.selection;
    
    if (selectedLayers.length === 0) {
        alert("الرجاء تحديد طبقة نصية");
        return;
    }
    
    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        
        if (layer.kind === LayerKind.TEXT) {
            var originalText = layer.textItem.contents;
            
            if (isRTL(originalText)) {
                layer.textItem.contents = shapeArabicText(originalText);
            } else {
                // استخدام المنطق الأصلي للنص الإنجليزي
                // يمكن استدعاء الدالة الأصلية هنا
            }
        }
    }
}

// تشغيل السكريبت
main();
