export default (str: string, len: number) => {
    let result = 0;
    let text = '';
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        if (
            (chr >= 0x00 && chr < 0x81) ||
            chr === 0xf8f0 ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)
        ) {
            result += 1;
        } else {
            result += 2;
        }
        if (result <= len) {
            text += str[i];
        } else {
            text += '...';
            break;
        }
    }
    return text;
}
