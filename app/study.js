var app = document.getElementsByTagName("app")[0]
var storage
function defaultStorage(){
    storage = {}
    storage.classes = {}
    storage.settings = {"glass":true, "uiAnimations":true}
}
defaultStorage()
window.api.invoke('storage', ["load"])
    .then(function(res){
        try{
            storage = JSON.parse(res)
        }catch (error){
            console.log("Seems like your data is corrupted! Error: ", error)
        }
    })
    .catch(function(err){
        console.error(err)
    })
function SaveSettings(){
    window.api.invoke('storage', ["save", JSON.stringify(storage)])
}
function ClearData(){
    defaultStorage()
    SaveSettings()
    location.reload()
}
var settings = { version : "1.2.1Beta"}

window.onload = function(){
    var loadClasses = Object.keys(storage.classes)
    if(loadClasses.length>0){
        hideWelcome()
        for(let i = 0; i < loadClasses.length; i++){
            const classId = loadClasses[i]
            const element = storage.classes[loadClasses[i]]
            LoadClass(element.name, element.color1, element.color2, classId)
        }
    }
    var loadSettings = Object.keys(storage.settings)
    for (let i = 0; i < loadSettings.length; i++) {
        optionsAffect(loadSettings[i])
    }
}

var colors = { 1 : ["#f22c4d", "#4f000d"], 2 : ["#ff9933", "#301901"], 3 : ["#ffff4f", "#4a4a00"], 4 : ["#4aff50", "#005403"], 5 : ["#47ffd7", "#004032"], 6 : ["#65baff", "#002e54"], 7 : ["##4261ff", "#000e54"], 8 : ["#c14fff", "#33004f"], 9 : ["#ff61fa", "#3d003b"], 10 : ["#8c3030", "#290000"], 11 : ["#000", "#fff"] }
var selectedColor
var lastselectedColor

var PageColor = ""
for(let i = 1; i < Object.keys(colors).length+1; i++){
    PageColor += "<color onclick='try{lastselectedColor.style.removeProperty(\"outline\")}catch{}selectedColor="+i+";this.style.outline=\"3px solid #555\";lastselectedColor=this' style='background:"+colors[i][0]+"'><subcolor style='color:"+colors[i][1]+"'>Aa</subcolor></color>"
}

var ModalAdd = "<modal><add><span class='m-i x'>close</span><h1><span class='m-i'>book</span>Add a subject</h1><input placeholder='Name'><de>Choose a color</de>"+PageColor+"<button>Add</button></add></modal>"
var PageEmpty = "<header><a>Take a break</a><input><span class='m-i f'>search</span><searchoptions></searchoptions></header><sidepanel><line></line><el><span class='m-i'>add</span></el><el class='a'><span class='m-i'>info</span></el><el class='a b'><span class='m-i'>settings</span></el><sideclass></sideclass></sidepanel><classes></classes><activescreen></activescreen><div class='center'><oaction><ti><span class='m-i'>add</span>Add a subject</ti></oaction></div><whatitcando><h1>Features <span class='m-i'>auto_awesome</span></h1><feature><ti>Organize all your classes</ti><co>Manage <b>todo</b>s, <b>timers</b>, <b>study music</b>, all within your specific class.</co></feature><feature><ti>Helps you relax</ti><co>With customized study timer and a rest option.</co></feature><feature><ti>Entirely free and customizable</ti><co>The limit is you, do whatever you want in this app!</co></feature><version>Version "+settings.version+"</version></whatitcando>"

function optionsAffect(setting){
    var setTo = storage.settings[setting]
    if(setting=="glass"){
        if(setTo == true){
            app.classList.remove("noblur")
            // style = document.getElementById("noblur")
            // if(style && style.nodeType){
            //     style.remove()
            // }
        }
        else{
            app.classList.add("noblur")
            // var style = document.createElement("style")
            // style.innerText = "*{backdrop-filter: initial!important}"
            // style.id = "noblur"
            // document.head.appendChild(style)
        }
    }
    if(setting=="uiAnimations"){
        if(setTo == true){
            app.classList.remove("noanim")
        }
        else{
            app.classList.add("noanim")
        }
    }
}

function optionsPage(){
    var PageOptions = document.createElement("div")
    PageOptions.classList.add("settings")
    PageOptions.innerHTML = "<h2>Settings</h2>"
    function section(label){
        var heading = document.createElement("h3")
        heading.innerText = label
        PageOptions.appendChild(heading)
    }
    function toggle(ti, co, setting){
        var element = document.createElement("div")
        element.classList.add("setting")
        element.innerHTML = "<ti>"+ti+"</ti><co>"+co+"</co>"+
        "<toggleswitch><div></div></toggleswitch>"
        var toggleswitch = element.getElementsByTagName("toggleswitch")[0]
        if(storage.settings[setting] == true){
            toggleswitch.classList.add("active")
        }
        ButtonEvent(toggleswitch, function(){
            if(toggleswitch.classList.contains("active")){
                storage.settings[setting] = false
                toggleswitch.classList.remove("active")
            }
            else{
                storage.settings[setting] = true
                toggleswitch.classList.add("active")
            }
            optionsAffect(setting)
            SaveSettings()
        })
        PageOptions.appendChild(element)
    }
    function choice(ti){
        var element = document.createElement("div")
        element.classList.add("setting")
        element.innerHTML = "<ti>"+ti+"</ti>"
        PageOptions.appendChild(element)
    }
    section("Visual")
    toggle("Glass Effect", "Using semi transparent elements and blur makes beautiful backgrounds but costs a lot of performance.", "glass")
    toggle("UI Animations", "Smooth transitions between elements. Might make some users nauseous.", "uiAnimations")
    choice("Custom Background")
    section("Advanced")
    var clearBtn = document.createElement("button")
    clearBtn.innerText = "Clear all data"
    ButtonEvent(clearBtn, ClearData)
    PageOptions.appendChild(clearBtn)
    return PageOptions
}


function LoadClass(name, color1, color2, classId){
    var classes = app.getElementsByTagName("classes")[0]
    var sideclass = app.getElementsByTagName("sideclass")[0]
    var classEl = document.createElement("class")
    classEl.innerHTML = "<ti style='background:"+color1+";color:"+color2+"'>"+name+"</ti>"
    classes.appendChild(classEl)
    var classCircleEl = document.createElement("el")
    classCircleEl.classList.add('big')
    classCircleEl.style.background = color1
    classCircleEl.style.color = color2
    classCircleEl.innerText = name[0]
    sideclass.appendChild(classCircleEl)

    var header = app.getElementsByTagName("header")[0]
    if(header.style.visibility != "visible"){
        classes.style.visibility = "visible"
        header.style.visibility = "visible"
        header.style.opacity = 1
        header.style.height = "60px"
        app.getElementsByTagName("line")[0].style.height = "calc(100% - 60px)"
        app.getElementsByTagName("oaction")[0].style.transform = "translateY(-140%)"
    }
    classEl.setAttribute("classId", classId)
    classCircleEl.setAttribute("classId", classId)
    ButtonEvent(classEl, openClass, classId)
    ButtonEvent(classCircleEl, openClass, classId)
}

function AddClass(name, color1, color2){
    var classId = guidGenerator(4)
    var existingClasseIds = Object.keys(storage.classes)
    while(existingClasseIds.includes(classId)){
        classId = guidGenerator(4)
    }
    storage.classes[classId] = {}
    storage.classes[classId].name = name
    storage.classes[classId].color1 = color1
    storage.classes[classId].color2 = color2
    storage.classes[classId].posts = {}
    SaveSettings()
    LoadClass(name, color1, color2, classId)
}

function ActiveScreen(element){
    var activescreen = document.getElementsByTagName("activescreen")[0]
    activescreen.style.visibility = "visible"
    activescreen.style.opacity = 1
    activescreen.style.transform = "initial"
    activescreen.innerHTML = "<span class='m-i x'>close</span>"
    activescreen.appendChild(element)
    function close(){
        activescreen.style.removeProperty("visibility")
        activescreen.style.removeProperty("opacity")
        activescreen.style.removeProperty("transform")
    }
    activescreen.getElementsByClassName("x")[0].onclick = function(){
        close()
    }
}

app.innerHTML = ModalAdd + PageEmpty


var modal = app.getElementsByTagName("modal")[0]
var add = app.getElementsByTagName("add")[0]
var features = app.getElementsByTagName("whatitcando")[0]
var sidepanel = app.getElementsByTagName("sidepanel")[0]
function hideWelcome(){
    app.classList.remove("dragable")
    features.style.transform = "translateX(-50%)scale(0.4)"
    features.style.opacity = 0
    features.style.visibility = "hidden"
    sidepanel.style.visibility = "visible"
    sidepanel.style.width = "70px"
}
app.classList.add("dragable")
app.getElementsByTagName("oaction")[0].onclick = sidepanel.getElementsByTagName("el")[0].onclick = function(){
    hideWelcome()
    modal.style.transition = "2s"
    modal.style.background = "#00000044"
    modal.style.visibility = "visible"
    add.style.visibility = "visible"
    add.style.opacity = 1
    add.style.transform = "translate(-50%, -50%)"
    function close(){
        modal.style.removeProperty("transition")
        modal.style.removeProperty("background")
        modal.style.removeProperty("visibility")
        add.style.removeProperty("visibility")
        add.style.removeProperty("opacity")
        add.style.removeProperty("transform")
    }
    modal.onclick = function(e){
        if(e.target == modal){
            close()
        }
    }
    app.getElementsByTagName("span")[0].onclick = function(){
        close()
    }
}
add.getElementsByTagName("button")[0].onclick = function(){
    var name = add.getElementsByTagName("input")[0]
    if(name.value){
        function close(){
            modal.style.removeProperty("transition")
            modal.style.removeProperty("background")
            modal.style.removeProperty("visibility")
            add.style.removeProperty("visibility")
            add.style.removeProperty("opacity")
            add.style.removeProperty("transform")
            name.value = ""
        }
        AddClass(name.value, colors[selectedColor][0], colors[selectedColor][1])
        close()
    }
}

sidepanel.getElementsByClassName("a")[0].onclick = function(){
    function close(){
        var closebutton = features.getElementsByClassName("x")[0]
        closebutton.remove()
        features.style.transform = "translateX(-50%)scale(0.4)"
        features.style.opacity = 0
        features.style.visibility = "hidden"
    }
    if(features.style.visibility == "hidden"){
        features.style.removeProperty("visibility")
        features.style.removeProperty("transform")
        features.style.removeProperty("opacity")
        features.innerHTML += "<span class='m-i x'>close</span>"
        var closebutton = features.getElementsByClassName("x")[0]
        closebutton.style.color = "#fff"
        closebutton.onclick = function(){
            close()
        }
    }
    else{
        close()
    }
}

sidepanel.getElementsByClassName("b")[0].onclick = function(){
    ActiveScreen(optionsPage())
}

var search = app.getElementsByTagName("header")[0].getElementsByTagName("input")[0]
var searchoptions = app.getElementsByTagName("searchoptions")[0]

search.onkeydown = function(e){
    if(e.key == "Enter"){

    }
}
function searchoptionsAdd(name){
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    var number = getRandomInt(8)+1
    search.value = "";
    search.dispatchEvent(new Event('input', {bubbles:true}));
    AddClass(name, colors[number][0], colors[number][1])
}
search.oninput = function(){
    if(search.value){
        searchoptions.innerHTML = ""
        search.style.borderRadius = "4px 4px 0 0"
        search.style.borderBottom = "initial"
        search.style.boxShadow = "0 -1px 3px #000"
        searchoptions.style.visibility = "visible"
        searchoptions.style.opacity = 1
        searchoptions.innerHTML += "<opt onclick='searchoptionsAdd(\""+search.value+"\")'>Create a subject \""+search.value+"\"</opt>"
    }
    else{
        search.style.removeProperty("border-bottom")
        search.style.removeProperty("border-radius")
        search.style.removeProperty("box-shadow")
        searchoptions.style.removeProperty("visibility")
        searchoptions.style.removeProperty("opacity")
    }
}

function openClass(classId){
    var element = document.createElement("div")
    element.classList.add("class")
    var heading = document.createElement("input")
    heading.contentEditable = true
    heading.value = storage.classes[classId].name
    function rename(newName){
        storage.classes[classId].name = newName
        SaveSettings()
        var elements = document.querySelectorAll('[classId="'+classId+'"]')
        for(let i = 0; i < elements.length; i++){
            const element = elements[i]
            if(element.classList[0]=='big'){
                element.innerText = newName[0]
            }
            else{
                element.getElementsByTagName("ti")[0].innerText = newName
            }
        }
    }
    heading.addEventListener("keydown", function(e){
        if(e.key == "Enter"){
            rename(this.value)
        }
    })
    heading.addEventListener("blur", function(){
        rename(this.value)
    })
    element.appendChild(heading)

    var r = document.querySelector(':root')
    r.style.setProperty('--color1', storage.classes[classId].color1)
    r.style.setProperty('--color2', storage.classes[classId].color2)

    ActiveScreen(element)


    var posts = document.createElement("posts")
    element.appendChild(posts) 

    var loadPosts = Object.keys(storage.classes[classId].posts)
    if(loadPosts.length>0){
        hideWelcome()
        for (let i = 0; i < loadPosts.length; i++) {
            const postId = loadPosts[i]
            const content = storage.classes[classId].posts[loadPosts[i]]
            loadPost(content, postId)
        }
    }

    function loadPost(content, postId){
        const element = document.createElement("post")
        element.innerHTML = content
        element.setAttribute('postId', postId)
        posts.appendChild(element)
    }
    function addPost(content){
        var postId = guidGenerator(8)
        var existingClasseIds = Object.keys(storage.classes[classId].posts)
        while(existingClasseIds.includes(postId)){
            postId = guidGenerator(4)
        }
        storage.classes[classId].posts[postId] = content
        // maybe add dates and stuff of creation and probs edits?
        SaveSettings()
        loadPost(content, postId)
    }

    var createPost = document.createElement("createpost")
    createPost.contentEditable = true
    createPost.addEventListener("keydown", function(e){
        if(e.key=="Enter" && !e.shiftKey){
            addPost(createPost.innerHTML)
            createPost.innerHTML = ""
        }
    })
    element.appendChild(createPost)
}

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}



ButtonEvent(app.getElementsByTagName("a")[0], takeABreak)
var breakEl
function takeABreak(){
    if(!breakEl || !breakEl.nodeType){
        breakEl = document.createElement("break")
        breakEl.innerHTML = "<h1>Take a break</h1>"+
        "<h2>You'll be notified in <b>20</b><i class='m-i'>expand_more</i><i class='m-i'>expand_less</i> minutes</h2>"+
        "<btn>Return now</btn>"
        ButtonEvent(breakEl.getElementsByTagName("btn")[0], endBreak)
        breakEl.classList.add("transition")
        var minutesEl = breakEl.getElementsByTagName("b")[0]
        var minutesArrows = breakEl.getElementsByTagName("i")
        function endCountdown(){
            window.api.invoke('notification', ["Your break is over!", "Come back and study"])
            playSound("assets/sounds/notify.mp3")
            clearInterval(timer)
            endBreak()
        }
        for(let i = 0; i < minutesArrows.length; i++){
            ButtonEvent(minutesArrows[i], function(){
                var minutes = parseInt(minutesEl.innerText)
                if(i==0){
                    minutes--
                }
                else{
                    minutes++
                }
                if(minutes==1){
                    endCountdown()
                }
                minutesEl.innerText = minutes
            })
        }
        function countdown(){
            var minutes = parseInt(minutesEl.innerText)
            if(minutes==1){
                endCountdown()
            }
            minutes--
            minutesEl.innerText = minutes
        }
        var timer = setInterval(() => {
            countdown()
        }, 60000);
        app.appendChild(breakEl)
        setTimeout(() => {
            breakEl.classList.remove("transition")
        }, 10);

        function endBreak(){
            clearInterval(timer)
            var animTime = 500
            if(storage.settings && storage.settings.uiAnimations == false){
                animTime = 0
            }
            breakEl.classList.add("transition")
            setTimeout(() => {
                breakEl.remove()
                breakEl = ''
            }, animTime);
        }
    }
}