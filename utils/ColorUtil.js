export function tintTextColor(bgColor) {
    var colorAvg = Math.floor((parseInt("0x" + bgColor.substr(1,2)) + parseInt("0x" + bgColor.substr(3,2)) + parseInt("0x" + bgColor.substr(5,2))) / 3);
    if (colorAvg <= 125) {
        return "white";
    }
    else {
        return "black";
    }
}

export function tintBgColor(bgColor, gridValue) {
    if (bgColor.length == 4) {
        bgColor = `#${bgColor[1]}${bgColor[1]}${bgColor[2]}${bgColor[2]}${bgColor[3]}${bgColor[3]}`;
    }
    var gridColorTint = gridValue * 20;
    var red = tintHex(parseInt("0x" + bgColor.substr(1,2)), gridColorTint);
    var green = tintHex(parseInt("0x" + bgColor.substr(3,2)), gridColorTint);
    var blue =  tintHex(parseInt("0x" + bgColor.substr(5,2)), gridColorTint);
    
    return `#${red}${green}${blue}`;
}

export function tintHex(hex, tintAmount) {
    hex = Math.max(hex - tintAmount, 0);
    var hexString = hex.toString(16);
    if (hexString.length == 1){
        hexString = "0" + hexString[0];   
    }
    return hexString;
}
