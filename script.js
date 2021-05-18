// Give item text and color randomly
const items = document.querySelectorAll(".item")
const acakSoal = () => {
    let warnaCode1 = [...warnaCode]
    let warnaName1 = [...warnaName]
    items.forEach(item => {
        if (warnaCode1.length == 0) {
            warnaCode1 = [...warnaCode]
            warnaName1 = [...warnaName]
        }
        const name = warnaName1[(Math.ceil(Math.random() * (warnaName1.length - 0) + 0)) - 1]
        const code = warnaCode1[(Math.ceil(Math.random() * (warnaCode1.length - 0) + 0)) - 1]
        item.setAttribute('style', `color:${code}`)
        item.textContent = name
        warnaName1 = warnaName1.filter(i => i != name)
        warnaCode1 = warnaCode1.filter(i => i != code)
    })
}
acakSoal()

// Give value to tabel warna
const warnaNode = document.querySelectorAll(".warna")
warnaNode.forEach((item, index) => {
    item.setAttribute('style', `color:${warnaCode[index]}`)
    item.textContent = warnaName[index]
})

// Show and hide tabel warna
const tabelWarnaBtn = document.querySelector(".tabel-btn")
const tabelWarna = document.querySelector(".tabel-warna")
let hideTabelWarna = true
tabelWarnaBtn.addEventListener("click", () => {
    hideTabelWarna = !hideTabelWarna
    tabelWarna.setAttribute("style", `display: ${hideTabelWarna ? 'none' : 'block'}`)
})

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'id-ID'

const startBtn = document.querySelector(".start")
let isListening = false

startBtn.addEventListener("click", e => {
    durasi = 0;
    isListening = !isListening
    startBtn.textContent = isListening ? 'STOP' : 'START'
    startBtn.setAttribute('style', `background-color: ${isListening ? '#dc3545' : '#46ff6e'}`)
    if (isListening) {
        mic.start()
    } else {
        mic.stop()
        mic.onend = () => {
            console.log('Mics off')   
            clearInterval(hitung)
            showInitialHint()
        }
    }
    mic.onstart = () => {
        console.log('Mics on')
        hitung = setInterval(startTimer, 1000)
    }

    mic.onresult = event => {
        const answer = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("")
        checkAnswer(answer)
        mic.onerror = err => {
            console.log(err.error)
        }
    }
})

const checkAnswer = (answer, cb) => {
    const answerArray = answer.split(" ")
    const answerToCheck = warnaCode[warnaName.findIndex(name => name.toLowerCase() == answerArray[answerArray.length - 1].toLowerCase())]
    const itemToCheck = items[answerArray.length - 1]
    const correctAnswer = itemToCheck.style.color

    if (answerArray.length > 1 && items[answerArray.length - 2].style.visibility != 'hidden') {
        isListening = false
        startBtn.textContent = 'START'
        startBtn.setAttribute('style', `background-color: '#46ff6e'`)
        mic.stop()
        clearInterval(hitung)
        acakSoal()
        showSalahText()
        return
    }
    if (hexToRgb(answerToCheck) == correctAnswer) {
        itemToCheck.setAttribute('style', 'visibility: hidden')
    }
    if (items[items.length - 1].style.visibility == 'hidden') {
        showScoreBadge()
        isListening = false
        startBtn.textContent = 'START'
        startBtn.setAttribute('style', `background-color: '#46ff6e'`)
        mic.stop()
        clearInterval(hitung)
    }
}

const hexToRgb = hex => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)

    return `rgb(${r}, ${g}, ${b})`
}

const hintText = document.querySelector('.hint-text')

let durasi = 0
var hitung;
const startTimer = () => {
    durasi++
    const menit = Math.floor(durasi / 60)
    const detik = durasi % 60
    hintText.textContent = `${menit > 9 ? menit : '0' + menit}:${detik > 9 ? detik : '0' + detik}`
    hintText.setAttribute('style', 'font-weight: bold')
}

const showSalahText = () => {
    hintText.textContent = 'SALAH!!!'
    hintText.setAttribute('style', 'font-weight: bold;color: red')
    showInitialHint()
}

const showInitialHint = () => {
    setTimeout(() => {
        hintText.textContent = 'Sebut warna dengan urut dari kiri ke kanan sampai selesai.'
        hintText.setAttribute('style', '')
    }, 3000)
}

const showScoreBadge = () => {
    if (durasi < 20) {
        hintText.textContent += ' HEBAT!!!'
        hintText.setAttribute('style', 'font-weight: bold; color: #28a745')
    } else if (durasi < 30) {
        hintText.textContent += ' LUMAYAN!!!'
        hintText.setAttribute('style', 'font-weight: bold; color: #ffc107')
    } else {
        hintText.textContent += ' WUADUHH!!!'
        hintText.setAttribute('style', 'font-weight: bold; color: #ff1e31')
    }
    setTimeout(acakSoal, 3000)
    showInitialHint()
}