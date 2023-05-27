let d = false
let px = 0
let py = 0
let lay = []
let ind = 0
let loop = false
let layer = 0
let b = true
let undo = []
let c = 0
let keys = []
const playing = document.getElementById('play')
const saveL = document.getElementById('save')
const colors = document.getElementById('color')
const weight = document.getElementById('weight')
const fps = document.getElementById('fps')
const layers = document.getElementById('layers')
const newLayer = document.getElementById('new')
fps.value = 12
weight.value = 2
let col = colors.value
let weg = weight.value
let FPS = fps.value

function setup(){
    let cnv = createCanvas(1140,window.innerHeight/1.3)
    cnv.mousePressed(startt)
    cnv.mouseReleased(stopp)
    background(255)
    loadPixels()
    undo.push(pixels)
    lay.push(pixels)
    goto(layer)
}

function draw(){
    if(d){
        noFill()
        stroke(255)
        if(b){stroke(col)}
        strokeWeight(weg)
        line(px,py,mouseX,mouseY)
        px = mouseX
        py = mouseY
    }
}

function startt(){
    d = true
    px = mouseX
    py = mouseY
}

function stopp(){
    d = false
    loadPixels()
    if(c > 0){
        undo = undo.slice(0,undo.length - c)
        c = 0   
    }
    undo.push(pixels)
    if(undo.length > 10){
        undo.shift()
    }
    saving()
}

function kaatu(lay){
    loadPixels();
    for (let i = 0; i < lay.length; i += 4) {
        pixels[i] = lay[i]
        pixels[i + 1] = lay[i+1]
        pixels[i + 2] = lay[i+2]
        pixels[i + 3] = lay[i+3]
    }
    updatePixels();
}

function animate(){
    if(loop){
        if(ind < lay.length){
            kaatu(lay[ind])
            ind += 1
            setTimeout(animate,(1000/FPS))
        }
        else{
            ind = 0
            animate()
        }
    }
}

playing.addEventListener('click',()=>{
    if(lay.length > 0 && loop == false){
        loop = true
        animate()
        playing.innerHTML = `<ion-icon name="pause" class="icon"></ion-icon>`
    }
    else{
        loop = false
        playing.innerHTML = `<ion-icon name="play" class="icon">`
        kaatu(lay[layer])
    }
})

function saving(){
    loadPixels()
    lay[layer] = pixels
}

newLayer.addEventListener('click',()=>{
    background(255)
    loadPixels()
    lay.push(pixels)
    layer = lay.length - 1
    let markup = `<div class="l" id="${lay.length - 1}" onclick="goto(${lay.length - 1})"> Layer ${lay.length} <ion-icon name="copy" style="position: relative;left: 11rem;top: 0.1rem;" id="copy" onclick="dup(${lay.length - 1})"></ion-icon><ion-icon name="trash-bin" style="position: relative;left: 8rem;top: 0.1rem;" onclick="trash(${lay.length - 1})"></ion-icon></div>`
    layers.insertAdjacentHTML('beforeend',markup)
    document.getElementById(lay.length - 1).style.borderColor = 'rgb(0, 250, 220)'
    document.getElementById(lay.length - 1).style.color = 'rgb(0, 250, 220)'
    layers.childNodes.forEach(e => {
        if(e.id != null && e.id != lay.length - 1){
            e.style.borderColor = 'gray'
            e.style.color = 'white'
        }
    });
})

function goto(id){
    if(lay[id] != undefined){
        layer = id
        kaatu(lay[id])
        document.getElementById(id).style.borderColor = 'rgb(0, 250, 220)'
        document.getElementById(id).style.color = 'rgb(0, 250, 220)'
        layers.childNodes.forEach(e => {
            if(e.id != null && e.id != id){
                e.style.borderColor = 'gray'
                e.style.color = 'white'
            }
        });
    }
}

function keyPressed(){
    keys.push(key.toLowerCase())
    if(keys[0] == "control" && keys[1] == "z" && keys.length == 2 && c < undo.length && c >= 0){
        kaatu(undo[undo.length - 2 - c])
        c += 1
    }
    if(keys[0] == "control" && keys[1] == "shift" && keys[2] == "z" && keys.length == 3 && c < undo.length && c >= 1){
        c -= 2
        kaatu(undo[undo.length - 2 - c])
        c += 1
    }
}

function keyReleased(){
    if(keys.includes(key.toLowerCase())){
        keys.splice(keys.indexOf(key.toLowerCase()),1)
    }
    if(keyIsPressed == false){
        keys = []
    }
}

colors.addEventListener('change',()=>{
    col = colors.value
})

weight.addEventListener('change',()=>{
    weg = weight.value
})

fps.addEventListener('change',()=>{
    if(isNaN(parseInt(fps.value)) == false){
        fps.value = Math.floor(fps.value)
        if(fps.value > 30){
            fps.value = 30
        }
    }
    else{
        fps.value = 0
    }
    FPS = fps.value
    console.log(lay);
})

function brush(){
    b = true
    document.getElementById('brush').style.color = 'white'
    document.getElementById('eraser').style.color = 'rgba(255,255,255,0.5)'
}

function eraser(){
    b = false
    document.getElementById('eraser').style.color = 'white'
    document.getElementById('brush').style.color = 'rgba(255,255,255,0.5)'
}

function dup(id){
    if(id != lay.length - 1){
        for(let i = id+1; i < lay.length; i++){
            document.getElementById(i).style.transform = "translate(0rem,4.4rem)"
        }
    }
    setTimeout(() => {
        lay.splice(id + 1,0,lay[id])
        layer = id + 1
        org(true)
    }, 250);
}

function trash(id){
    if(id != 0){
        document.getElementById(id).style.transform = "translate(-20rem)"
        setTimeout(() => {
            for(let i = id + 1; i < lay.length; i++){
                document.getElementById(i).style.transform = "translate(0rem,-4.4rem)"
            }
            setTimeout(() => {
                if(id != 0){
                    layer = id - 1
                }
                else{
                    layer = 0
                }
                lay.splice(id,1)
                kaatu(lay[layer])
                org()
            }, 500);
        }, 500);
    }
}

function org(f){
    layers.innerHTML = ''
    for(let i = 0; i < lay.length; i ++){
        let markup = `<div class="l" id="${i}" onclick="goto(${i})"> Layer ${i + 1} <ion-icon name="copy" style="position: relative;left: 11rem;top: 0.1rem;" id="copy" onclick="dup(${i})"></ion-icon><ion-icon name="trash-bin" style="position: relative;left: 8rem;top: 0.1rem;" onclick="trash(${i})"></ion-icon></div>`
        layers.insertAdjacentHTML('beforeend',markup)
    }
    if(f){
        document.getElementById(layer).style.transform = "translate(-20rem)"
        setTimeout(() => {
            document.getElementById(layer).style.transform = "translate(0rem)"
        }, 200);
    }
    goto(layer)
}