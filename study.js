var app = document.getElementsByTagName("app")[0]
var storage = localStorage.getItem("classes")
var settings = { version : "1.1.0Beta"}

var colors = { 1 : ["#f22c4d", "#4f000d"], 2 : ["#ff9933", "#301901"], 3 : ["#ffff4f", "#4a4a00"], 4 : ["#4aff50", "#005403"], 5 : ["#47ffd7", "#004032"], 6 : ["#65baff", "#002e54"], 7 : ["##4261ff", "#000e54"], 8 : ["#c14fff", "#33004f"], 9 : ["#ff61fa", "#3d003b"], 10 : ["#8c3030", "#290000"], 11 : ["#000", "#fff"] }
var selectedColor
var lastselectedColor

var PageColor = ""
for(let i = 1; i < Object.keys(colors).length+1; i++){
    PageColor += "<color onclick='try{lastselectedColor.style.removeProperty(\"outline\")}catch{}selectedColor="+i+";this.style.outline=\"3px solid #555\";lastselectedColor=this' style='background:"+colors[i][0]+"'><subcolor style='color:"+colors[i][1]+"'>Aa</subcolor></color>"
}

var ModalAdd = "<modal><add><span class='m-i x'>close</span><h1><span class='m-i'>book</span>Add a subject</h1><input placeholder='Name'><de>Choose a color</de>"+PageColor+"<button>Add</button></add></modal>"
var PageEmpty = "<header><input><span class='m-i f'>search</span><searchoptions></searchoptions></header><sidepanel><line></line><el><span class='m-i'>add</span></el><el class='a'><span class='m-i'>info</span></el><el class='a b'><span class='m-i'>settings</span></el><sideclass></sideclass></sidepanel><classes></classes><activescreen></activescreen><oaction class='center'><ti><span class='m-i'>add</span>Add a subject</ti></oaction><whatitcando><h1>Features <span class='m-i'>auto_awesome</span></h1><feature><ti>Organize all your classes</ti><co>Manage <b>todo</b>s, <b>timers</b>, <b>study music</b>, all within your specific class.</co></feature><feature><ti>Helps you relax</ti><co>With customized study timer and a rest option.</co></feature><feature><ti>Entirely free and customizable</ti><co>The limit is you, do whatever you want in this app!</co></feature><version>Version "+settings.version+"</version></whatitcando>"
var PageOptions = "cool settings"

function AddClass(name, color1, color2){
    var classes = app.getElementsByTagName("classes")[0]
    var sideclass = app.getElementsByTagName("sideclass")[0]
    classes.innerHTML += "<class><ti style='background:"+color1+";color:"+color2+"'>"+name+"</ti></class>"
    sideclass.innerHTML += "<el class='big' style='background:"+color1+";color:"+color2+"'>"+name[0]+"</el>"

    var header = app.getElementsByTagName("header")[0]
    if(header.style.visibility != "visible"){
        classes.style.visibility = "visible"
        header.style.visibility = "visible"
        header.style.opacity = 1
        header.style.height = "60px"
        app.getElementsByTagName("line")[0].style.height = "calc(100% - 60px)"
        app.getElementsByTagName("oaction")[0].style.transform = "translateY(-140%)"
    }
}

function ActiveScreen(html){
    var activescreen = document.getElementsByTagName("activescreen")[0]
    activescreen.style.visibility = "visible"
    activescreen.style.opacity = 1
    activescreen.style.transform = "initial"
    activescreen.innerHTML = "<span class='m-i x'>close</span>" + html
    function close(){
        activescreen.style.removeProperty("visibility")
        activescreen.style.removeProperty("opacity")
        activescreen.style.removeProperty("transform")
    }
    activescreen.getElementsByClassName("x")[0].onclick = function(){
        close()
    }
}

if(storage){
    app.innerHTML = storage
}
else{
    app.innerHTML = ModalAdd + PageEmpty
}

var modal = app.getElementsByTagName("modal")[0]
var add = app.getElementsByTagName("add")[0]
var features = app.getElementsByTagName("whatitcando")[0]
var sidepanel = app.getElementsByTagName("sidepanel")[0]
app.getElementsByTagName("oaction")[0].onclick = sidepanel.getElementsByTagName("el")[0].onclick = function(){
    features.style.transform = "translateX(-50%)scale(0.4)"
    features.style.opacity = 0
    features.style.visibility = "hidden"
    sidepanel.style.visibility = "visible"
    sidepanel.style.width = "70px"
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
    ActiveScreen(PageOptions)
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