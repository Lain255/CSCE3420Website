let chatbox
let catSelect
let chatboxContent
let messageInput
let addMessage = (message, sender, className) => {
    console.log(message, "sent")
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(className)

    const senderSpan = document.createElement("span");
    const senderText = document.createTextNode(sender);
    senderSpan.append(senderText)
    senderSpan.classList.add(className)
    senderSpan.classList.add("sender")


    const colonSpan = document.createElement("span");
    const colonText = document.createTextNode(":");
    colonSpan.append(colonText)
    colonSpan.classList.add("colon")


    const messageSpan = document.createElement("span");
    const messageText = document.createTextNode(message);
    messageSpan.append(messageText)
    messageSpan.classList.add("message")


    messageDiv.appendChild(senderSpan)
    messageDiv.appendChild(colonSpan)
    messageDiv.appendChild(messageSpan)


    document.getElementById("chatbox-content").appendChild(messageDiv);
    document.getElementById("chatbox-content").scrollTop = document.getElementById("chatbox-content").scrollHeight

}

let createSpeakFunc = (start, extender, end) => {
    return (message) => {
        let response = []
        let maxNumWords = message.split(" ").length*2
        let numWords = Math.floor(Math.random() * maxNumWords + 1)
        for (let i = 0; i < numWords; i++) {
            response.push(start + extender.repeat(Math.floor(Math.random() * 5 + 1)) + end)
        }
        return response.join(" ")
    }
}
let sleepCounterStart = 3
let sleepCounter = sleepCounterStart

let cats = {
    cat : {
        name: "Cat",
        imgSrc : "assets/cat.png",
        speak: createSpeakFunc("Me", "o", "w"),
        sound: "assets/cat.mp3",

    },
    sleepyCat : {
        name: "Sleepy Cat",
        imgSrc : "assets/sleepyCat.png",
        speak: (message) => {
        
            let response = "Z" + "z".repeat(sleepCounter)
            sleepCounter -= 1
            if (sleepCounter < 0) {
                let choice = Math.floor(Math.random()*3)
                if (choice === 0) {
                    addMessage("Uh oh, you woke up the cat! Its in a bad mood!", "System", "system")
                    changeCat("angeryCat")
                    response = cats["angeryCat"].speak(message)
                }
                else if (choice === 1) {
                    addMessage("The cat woke up in a good mood!", "System", "system")
                    changeCat("happyCat")
                    response = cats["happyCat"].speak(message)
                }
                else {
                    addMessage("The cat stays fast asleep.", "System", "system")
                    changeCat("sleepyCat")
                }
                
            }

            return response
        },
        sound: "assets/sleepyCat.mp3",

    },
    angeryCat : {
        name: "Angery Cat",
        imgSrc : "assets/angeryCat.png",
        speak: createSpeakFunc("hi", "ss", ""),
        sound: "assets/angeryCat.mp3",
    },
    happyCat : {
        name: "Happy Cat",
        imgSrc : "assets/happyCat.png",
        speak: createSpeakFunc("pu", "rr", ""),
        sound: "assets/happyCat.mp3",

    },
    copyCat : {
        name: "Copy Cat",
        imgSrc : "assets/you.png",
        speak : (message) => message + " (meow)",
        sound: "assets/copyCat.mp3",

    },
    japaneseCat : {
        name: "Japanese Cat",
        imgSrc : "assets/japaneseCat.webp",
        speak: createSpeakFunc("ny", "a", "n"),
        sound: "assets/japaneseCat.mp3",


    },
    chineseCat : {
        name: "Chinese Cat",
        imgSrc : "assets/chineseCat.png",
        speak: createSpeakFunc("ma", "o", ""),
        sound: "assets/chineseCat.mp3",



    },
}
let nyanInterval
let enableNyanInterval = () => {
    if (!nyanInterval) {
        nyanInterval = setInterval(() => {
            console.log(!soundPlayer.paused, !soundPlayer.muted, soundPlayer.src, soundPlayer.currentTime,document.getElementById("cat-select").value)
            if (!soundPlayer.paused 
                && !soundPlayer.muted 
                && soundPlayer.currentTime > 3.6
                && document.getElementById("cat-select").value === "japaneseCat"
            ) {
                addMessage(cats.japaneseCat.speak(""), "japaneseCat", "cat")
            }
        }, 100)
    }

}
let disableNyanInterval = () => {
    if (nyanInterval) {
        clearInterval(nyanInterval)
        nyanInterval = undefined
    }
}

let sleepTimer
let resetSleepTimer = () => {
    if (sleepTimer) {
        clearTimeout(sleepTimer)
    }
    sleepTimer = setTimeout(() => {
        if (document.getElementById("cat-select").value !== "sleepyCat") {
            addMessage("It looks like the cat fell asleep. Try being more engaging.", "System", "system")
            changeCat("sleepyCat")
        }
        resetSleepTimer()
    }, 30*1000)
}
let onSendMessage = (message) => {
    if (message === "") {
        return
    }
    addMessage(message, "You", "you")

    let cat = document.getElementById("cat-select").value
    let response = cats[cat].speak(message)
    cat = document.getElementById("cat-select").value
    addMessage(response, cats[cat].name, "cat")


    document.getElementById("message").value = ""
    resetSleepTimer()
}
let onChangeSelection = (selection) => {
    changeCat(selection)
    document.getElementById("chatbox-content").innerHTML = "";

    console.log(selection)
}

let soundPlayer = new Audio()
let changeCat = (selection) => {
    document.getElementById("cat-img").src = cats[selection].imgSrc
    document.getElementById("cat-img-name").innerText = cats[selection].name
    document.getElementById("cat-select").value = selection
    if (selection === "sleepyCat") {
        sleepCounter = sleepCounterStart
    }
    if (selection === "japaneseCat") {
        enableNyanInterval()
    }
    else {
        disableNyanInterval()
    }

    if (document.getElementById("sound-enabled").checked) {
        soundPlayer.src = cats[selection].sound
        soundPlayer.play()

    }
    resetSleepTimer()


}



let onSoundEnabled = (enabled) => {
    if (enabled) {
        soundPlayer.src = cats[document.getElementById("cat-select").value].sound
        soundPlayer.play()
    }
    else {
        soundPlayer.pause()
    }
}

window.addEventListener('DOMContentLoaded', function() {
    resetSleepTimer()
    document.getElementById("send-message").addEventListener("click", () => onSendMessage(document.getElementById("message").value))
    document.addEventListener("keydown", (event) => event.key === "Enter" ? onSendMessage(document.getElementById("message").value) : undefined)
    document.getElementById("cat-select").addEventListener("change", () => onChangeSelection(document.getElementById("cat-select").value))
    document.getElementById("sound-enabled").addEventListener("change", () => onSoundEnabled(document.getElementById("sound-enabled").checked))

});
