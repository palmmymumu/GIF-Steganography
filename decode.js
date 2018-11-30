var fs = require('fs')

const Bin2Dec = n => parseInt(n, 2).toString(10)
const Bin2Hex = n => parseInt(n, 2).toString(16)
const Hex2Bin = n => parseInt(n, 16).toString(2)
const Hex2Dec = n => parseInt(n, 16).toString(10)
const getByteArray = filePath => {
	let fileData = fs.readFileSync(filePath).toString('hex')
	let result = []
	for (var i = 0; i < fileData.length; i += 2) result.push(fileData[i] + '' + fileData[i + 1])
	return result
}

const args = process.argv.slice(2)
const fileName = args[0] || 'psu-encoded.gif'
const headerText = '@@@'

var result = getByteArray(fileName)

console.log('=======================================')
console.log('[+] GIF Steganography (Decoder)')
console.log('[+] Computer Security 1/2561')
console.log('[+] Coded by 5835512012 & 5835512030')
console.log('=======================================')

const packedField = Hex2Bin(result[10])
const tableFlag = packedField.slice(0, 1)
const colorSize = [2, 4, 8, 16, 32, 64, 128, 256][Bin2Dec(packedField.slice(-3))]

if (tableFlag !== '1') {
	console.log(`[-] This image can't hide secret text!`)
	console.log('=======================================')
	return
}

var text = ''
var tmpText = []

for (var i = 13; i < 13 + colorSize * 3; i++) {
	tmpText.push(Hex2Bin(result[i]).slice(-1))
	if (tmpText.length === 8) {
		text += String.fromCharCode(Bin2Dec(tmpText.join('')))
		tmpText = []
	}
}

if (text.split(headerText).length > 1) {
	console.log('Secret text:', text.split(headerText)[1])
} else {
	console.log(`Secret text not found!`)
}

console.log('=======================================')
