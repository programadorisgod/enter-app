export const encrypt = (text) => {
    if (!text) return null

    let encryption = ''
    const scrolling = process.env.SCROLLING

    for (let index = 0; index < text.length; index++) {
        let char = text[index]
        let code = text.charCodeAt(index)

        if (
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122) ||
            (code >= 48 && code <= 57)
        ) {
            code = code + (scrolling % 26)

            if ((code > 90 && code < 97) || code > 122) {
                code -= 26
            }

            char = String.fromCharCode(code)
        }

        encryption += char
    }

    return encryption
}
export const decrypt = (encryptText) => {
    if (!encryptText) return null

    let text = ''

    let scrolling = process.env.SCROLLING

    for (let index = 0; index < encryptText.length; index++) {
        let char = encryptText[index]
        let code = encryptText.charCodeAt(index)

        if (
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122) ||
            (code >= 48 && code <= 57)
        ) {
            code = code - (scrolling % 26)

            if (code < 65 || (code > 90 && code < 97)) {
                code += 26
            }

            char = String.fromCharCode(code)
        }

        text += char
    }

    return text
}
