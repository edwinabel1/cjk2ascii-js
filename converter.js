// 确保 unicodeMapping 被初始化为空对象
var unicodeMapping = {};  // 使用 var 确保它是全局变量

function loadUnicodeMappingIfNeeded() {
    // 如果 unicodeMapping 已经被加载，则跳过
    if (Object.keys(unicodeMapping).length > 0) {
        return;
    }

    // 检查 unicodeMappingBase64 是否存在且非空
    if (!unicodeMappingBase64 || Object.keys(unicodeMappingBase64).length === 0) {
        return;
    }

    // 遍历 unicodeMappingBase64 中的数据，并使用 atob() 进行解码
    for (const blockKey in unicodeMappingBase64) {
        const encodedData = unicodeMappingBase64[blockKey];
        const decodedData = atob(encodedData);
        try {
            unicodeMapping[blockKey] = JSON.parse(decodedData);
        } catch (error) {
            // 出错时不做任何操作，只忽略该区块
        }
    }
}

// 将 Unicode 字符转换为 ASCII 发音的函数
function unicodeToAscii(char) {
    const charCode = char.charCodeAt(0);
    const block = Math.floor(charCode / 256).toString(16).padStart(3, '0');
    const offset = charCode % 256;

    const blockData = unicodeMapping[block];

    if (blockData) {
        const mappedValue = blockData[offset];
        if (mappedValue) {
            return ` ${mappedValue.trim().toLowerCase()} `; // 去掉多余空格并转换为小写，同时在前后加空格
        }
    }

    return char; // 如果未找到映射，返回原始字符
}

// 将输入文本转换为拼音的函数
function convertToPinyin() {
    // 在调用转换函数之前，确保 unicodeMapping 已经加载
    loadUnicodeMappingIfNeeded();

    const inputText = document.getElementById('inputText').value;
    const outputTextElement = document.getElementById('outputText');

    // 将输入文本逐字符转换，并将结果拼接起来
    const convertedText = Array.from(inputText).map(char => unicodeToAscii(char)).join('');
    outputTextElement.textContent = convertedText;
}
