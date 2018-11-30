const fs = require('fs')

const pad = n => ('00000000' + n).slice(-8)
const Bin2Dec = n => parseInt(n, 2).toString(10)
const Bin2Hex = n => parseInt(n, 2).toString(16)
const Hex2Bin = n => pad(parseInt(n, 16).toString(2))
const Hex2Dec = n => parseInt(n, 16).toString(10)
const getByteArray = filePath => {
	let fileData = fs.readFileSync(filePath).toString('hex')
	let result = []
	for (var i = 0; i < fileData.length; i += 2) result.push(fileData[i] + '' + fileData[i + 1])
	return result
}
const getFileSize = filename => {
	const stats = fs.statSync(filename)
	const fileSizeInBytes = stats.size
	return fileSizeInBytes
}
const Text2Bin = n => {
	var r = []
	for (var i = 0; i < n.length; i++) {
		Hex2Bin(Buffer.from(n[i], 'utf8').toString('hex'))
			.split('')
			.map(b => r.push(b))
	}
	return r
}

const args = process.argv.slice(2)

console.log('=======================================')
console.log('[+] GIF Steganography (Encoder)')
console.log('[+] Computer Security 1/2561')
console.log('[+] Coded by 5835512012 & 5835512030')
console.log('=======================================')

const fileName = 'psu.gif'
const outputFileName = 'psu-encoded.gif'

const secretText = args[0] || 'Secret Text'
const headerText = '@@@'

var result = getByteArray(fileName)

const packedField = Hex2Bin(result[10])
const tableFlag = packedField.slice(0, 1)
const colorSize = [2, 4, 8, 16, 32, 64, 128, 256][Bin2Dec(packedField.slice(-3))]
const completeText = Text2Bin(headerText + secretText + headerText)

console.log(`[+] File name: ${fileName}`)
console.log(`[+] File size: ${getFileSize(fileName)} Bytes`)

if (tableFlag !== '1') {
	console.log(`[-] This image can't hide secret text!`)
	console.log('=======================================')
	return
}

var colorArray = []

for (var i = 13; i < 13 + colorSize * 3; i++) {
	colorArray.push(result[i])
}

console.log(`[+] Maximum text length: ${colorArray.length - headerText.length * 2 * 8} bit`)
console.log(`[+] Secret Text: ${secretText} (${completeText.length - headerText.length * 2 * 8} bit)`)

if (completeText.length > colorArray.length) {
	console.log(`[-] Text too long!`)
	console.log('=======================================')
	return
}

var j = 0
for (var i = 13; i < 13 + colorSize * 3; i++) {
	if (completeText[j]) {
		var colorBinary = Hex2Bin(result[i]).split('')
		colorBinary[7] = completeText[j]
		colorBinary = colorBinary.join('')
		result[i] = Bin2Hex(colorBinary)
	}
	j++
}

fs.writeFile(outputFileName, new Buffer(result.map(r => Hex2Dec(r))), () => {
	console.log(`[+] Done! (Output ${getFileSize(outputFileName)} bytes)`)
	console.log('=======================================')
})
