function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
}

function remove(element) {
    element.parentNode.removeChild(element);
}


var addEventListener = function(obj, evt, fnc) {
if (document.addEventListener) {
    var addEvent = function(elem, type, handler) {
        elem.addEventListener(type, handler, false)
    }
    var removeEvent = function(elem, type, handler) {
        elem.removeEventListener(type, handler, false)
    }
} else {
    var addEvent = function(elem, type, handler) {
        elem.attachEvent("on" + type, handler)
    }
    var removeEvent = function(elem, type, handler) {
        elem.detachEvent("on" + type, handler)
    }
}

};


//search in webapp
function search(data){

    var selReports = $("#bookmarks-quickreports");

    for(var i=0; i<selReports.options.length; i++){
        if(selReports.options[i].text == data ||
            selReports.options[i].text.search(data)!=-1){
            reloadTab("#quick-reports");
            var newLinkIndex = selReports.options[i].index;
            selReports.selectedIndex = newLinkIndex;
            changeIFrame();
            return true;
        }
    }

    selReports = $("#bookmarks-teamfolders-reports");

    for(var i=0; i<selReports.options.length; i++){
        if(selReports.options[i].text == data ||
            selReports.options[i].text.search(data)!=-1){
            reloadTab("#my-team-folders");
            var newLinkIndex = selReports.options[i].index;
            selReports.selectedIndex = newLinkIndex;
            changeIFrame();
            return true;
        }
    }
    return false;
}

//search event
document.getElementById("searchInput").addEventListener('search', function(e){
            var data = document.getElementById("searchInput").value;
            if(!search(data)){
                var result = "The searched report " + data + " was not found."
                updateNotificationArea(result);
                return;
            }
    });


// change active tab with arrows keyboard
document.addEventListener('keyup' , function(e){
    var active = window.location.hash;
    var cod = e.keyCode;
    //Left
    if(e.keyCode == 37){
        LeftArrowTabEvent(active);
    }
    //Right
    if(e.keyCode == 39){
        RightArrowTabEvent(active);
    }
});

//save last selected tab
function saveLastSelectedTab(data){
    localStorage.setItem("lastTab", data);
}


function reloadTab(data){
    var tabsList = document.getElementsByClassName("tabs-links");

    window.location.hash = data;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == data) {
          parent=tabsList[i].parentNode;
          // set the tab toggle class to be active-tab
          parent.className+=' tab-active';
          // tabsList[i].children[0].classList.add("active-tab-icon");
          tabsList[i].style.color = "black";
        } 
        else {
          // remove the tab-active class from the other tabs
          parent=tabsList[i].parentNode;
          parent.className='';
          // hide the other tabs content
            $(tabsList[i].hash).classList.add('hidden');
            // tabsList[i].children[0].classList.remove("active-tab-icon");
            tabsList[i].style.color = "white";
        }
      }
    // show current tab content
     $(data).classList.remove('hidden');
     saveLastSelectedTab(data);

}




//left arror action
function LeftArrowTabEvent(data){
    if(data == "#quick-reports")
        return;
    else if(data == "#my-folders")
        reloadTab("#quick-reports");
    else if(data == "#my-team-folders")
        reloadTab("#my-folders");
    else if(data == "#public-folders")
        reloadTab("#my-team-folders");
}

//right arrow action
function RightArrowTabEvent(data){
    if(data == "#public-folders")
        return;
    else if(data == "#my-team-folders")
        reloadTab("#public-folders");
    else if(data == "#my-folders")
        reloadTab("#my-team-folders");
    else if(data == "#quick-reports")
        reloadTab("#my-folders");
}

// Enter/Esc events
$("#quickreports").addEventListener('keyup' , function(e){
    //Enter
    if(e.keyCode == 13){
        submitForm("#quickreports");
        return;
    }
    //ESC
    if(e.keyCode == 27){
        $("#quickreports").classList.toggle("hidden");
        return;
    }
});

//Enter/Esc events
$("#teamfolders-reports").addEventListener('keyup' , function(e){
   
    //Enter
    if(e.keyCode == 13){
        submitForm("#teamfolders-reports");
        return;
    }
     //ESC
    if(e.keyCode == 27){
        $("#teamfolders-reports").classList.toggle("hidden");
        return;
    }
});



function updatePage(data){
    updateNotification(data.notification);
    updateQuickActions(data.quickActions);
}


function updateNotification (data) {
      if (data !== undefined) {
        $(".notifications").innerHTML = "<p>" + data + "</p>";
        $(".notifications").classList.remove('hidden');
    } 
}

//update notifications area -- for search results
function updateNotificationArea(data){
    if(data != undefined)
        $(".notifications").innerHTML = data;
}

function updateQuickActions (actions) {
     var navSections = all(".nav-section");
    if (actions !== undefined) {
        for (var i = 0; i < actions.length; i++) {
            navSections[i].innerHTML = "<p>" + actions[i].label + "</p>" + navSections[i].innerHTML;
            navSections[i].style.background = "black url(./img/icons/" + actions[i].icon + ".png)  left 50% top 70px no-repeat";
            navSections[i].addEventListener("focus", changeFocusNav, false);
            navSections[i].addEventListener("mouseleave", ignoreClick, false);
        }
        var menuCaptions = all(".menu-caption");
        for (i = 0; i < actions.length; i++) {
            menuCaptions[i].innerHTML = "<p>" + actions[i].actionsLabel + "</p>";
        }
        var g = 4;
        var q = 0;
        var actionLists = all(".action-list");
        for (i = 0; i < actions.length; i++) {
            for (var j = 0; j < actions[i].actions.length; j++) {
                actionLists[i].innerHTML += "<li><a tabindex=\"" + g + "\" href=\"" + actions[i].actions[j].url + "\">" + actions[i].actions[j].label + "</a></li>";
                g++;
                //if (j+1 == actions[i].actions.length) {
                all(".action-list li >a")[q].addEventListener("blur", changeFocus, false);
                //}
                q++;
            }
            g++;
        }
    }
}

var changeFocus = function (e) {
    this.parentNode.parentNode.style.display = "none";
};

var changeFocusNav = function (e) {
    this.querySelector(".action-list").style.display = "block";
};

var ignoreClick = function (e) {
    if (document.activeElement === this) {
        this.blur();
        this.querySelector(".action-list").style.display = "none";
    }
};






var set_tab = function(){
        var tabsList =document.getElementsByClassName("tabs-links");
        // current tab hash
        var current = this.hash;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == current) {
          var x = tabsList[i].parentNode;

          // set the tab toggle class to be active-tab
          x.className+=' tab-active';
        } else {

          // remove the tab-active class from the other tabs
          x=tabsList[i].parentNode;
          x.className='';
          // hide the other tabs content
        $(tabsList[i].hash).classList.add('hidden');
        }
      }
    // show current tab content
     $(current).classList.remove('hidden');


};

var tabs =document.getElementsByClassName("tabs-links");

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", set_tab);
  }






function getActiveTabIndex(Tabs){
    for (var i = 0; i < Tabs.length; i++) {
        if(Tabs[i].getAttribute('class') == 'tab-active'){
            return i;
        }
    }
}




// //====================================================================
// var selectOptionChange = function (e) {
//     e.preventDefault();
//     var target = e.target;
//     var optionValue = target.options[target.selectedIndex].value;
//     var id = $('#'+target.id).parentNode.parentNode.querySelectorAll("form")[0].getAttribute('id');
//     setIframe(optionValue,id);
// }
// //====================================================================



function addSelectToDropDownList ($selectElement ,name,url) {
    var $option = document.createElement('option');
        $option.setAttribute( 'value',url );
        $option.textContent = name;
        $selectElement.appendChild($option);
}

// function setIframe (val,id) {
//     $('.iframe-'+ id).setAttribute( 'src' , val );
//     $('#expand-'+id).setAttribute( 'href', val );  
// }


function showSelectButtonAndIframe (id) {
     $('#bookmarks-' + id).classList.remove('hidden'); 
      $('#expand-' + id).classList.remove('hidden'); 
}


function hideSelectButtonAndIframe (id) {
    $('#bookmarks-' + id).classList.add('hidden'); 
    $('#expand-' + id).classList.add('hidden'); 
}


//update the inputs in form when the form is open
function loadLocalData(){

    var formData = JSON.parse(localStorage.getItem("FormData"));
    if(formData == null) return;
    for(var i=0; i<formData.length; i++){
        var reportsNumber = 1;
        var foldersNumber = 1;
        if(formData[i].formId == "ReportsForm"){
            var inputName = "#nameReport"+reportsNumber;
            var inputURL = "#urlReport"+reportsNumber;
            $(inputName).value = formData[i].name;
            $(inputURL).value = formData[i].url;
            reportsNumber++;
        }

        if(formData[i].formId == "MyTeamFoldersForm"){
            var inputName = "#folderName"+foldersNumber;
            var inputURL = "#folderUrl"+foldersNumber;
            $(inputName).value = formData[i].name;
            $(inputURL).value = formData[i].url;
            foldersNumber++;
        }
    }
}


//reload last selected tab
function reloadLastTab(){
    var tabName = localStorage.getItem("lastTab");
    if(tabName == null)
        reloadTab("#quick-reports");
    else if(tabName != "")
        reloadTab(tabName);
}



//update the saved links in select element
function updateSelect(data) {
        var formData = JSON.parse(localStorage.getItem("FormData"));
        if(formData == null) return;
        if(data == "#my-team-folders"){
            var selectReports = $("#bookmarks-teamfolders-reports");
            for(var i=0; i<formData.length; i++){
                var formId = formData[i].formId;

                if(formId == "MyTeamFoldersForm"){
                    var val = formData[i].name;
                    if(val != "") $("#bookmarks-teamfolders-reports").classList.remove("hidden");
                    var myOption = document.createElement("option");
                    myOption.text = val;
                    myOption.value = val; 
                    selectReports.appendChild(myOption);
                }   
            }   
        }

        else{
                var selectReports = $("#bookmarks-quickreports");
                for(var i=0; i<formData.length; i++){
                    var formId = formData[i].formId;
                    if(formId == "ReportsForm"){
                        var val = formData[i].name;
                        if(val != "") $("#bookmarks-quickreports").classList.remove("hidden");
                        var myOption = document.createElement("option");
                        myOption.text = val;
                        myOption.value = val;
                        selectReports.appendChild(myOption);
                    }
                }   
        }

        changeIFrame();
}



//change the iframe link
function changeIFrame() {
   var activeTab = location.hash;
    var newURL;
    var selReports;
    var iframeWindow;
    var selectedValue;
    var formData = JSON.parse(localStorage.getItem("FormData"));

    if(activeTab == "#my-team-folders"){
        selReports = $("#bookmarks-teamfolders-reports");
        selectedValue = selReports.value;
        for(var i=0; i<formData.length; i++){
            if(formData[i].name == selectedValue){
                newURL = formData[i].url;
                iframeWindow = $("#teamfolders-frame");
                iframeWindow.src = newURL;
                $("#expand-teamfolders-reports").href = newURL;
            }
        }       
    }
    else{
        selReports = $("#bookmarks-quickreports");
        selectedValue = selReports.value;
        for(var i=0; i<formData.length; i++){
            if(formData[i].name == selectedValue){
                newURL = formData[i].url;
                iframeWindow = $("#quickreports-frame");
                iframeWindow.src = newURL;
                $("#expand-quickreports").href = newURL;
            }
        }
    }   
}


//upload iframe
function frameUpload(){
    var s1 = $("#bookmarks-quickreports");
    var s2 = $("#bookmarks-teamfolders-reports");
    var formData = JSON.parse(localStorage.getItem("FormData"));
    if(formData == null) return;
    if(s1.options.length > 0){
        for(var i=0; i<formData.length; i++){
            if(formData[i].formId == "ReportsForm"){
                $("#quickreports-frame").classList.remove("hidden");
                $("#quickreports-frame").src = formData[i].url;
                break;
            }
        }
    }

    if(s1.options.length > 0){
        for(var i=0; i<formData.length; i++){
            if(formData[i].formId == "myTeamFolders"){
                $("#teamfolders-frame").classList.remove("hidden");
                $("#teamfolders-frame").src = formData[i].url;
                break;
            }
        }
    }
}



//====================================================================
function isInputsNull(data){
    var arr = [];
    var returnVal = true;
    var frame;

    if(data == "#my-team-folders"){
        arr = all("#teamFolders-data");
        frame = $("#teamfolders-frame");
    }
    else{
        arr = all("#reports-data");
        frame = $("#quickreports-frame");
    }

    for(var i =0; i<arr.length; i++){
        var text = arr[i].children[1].value;
        if(text != ""){
            returnVal = false;
        }
    }
    var d = frame.src;

    if(returnVal)
        frame.src = "";
    return returnVal;
}
//====================================================================

//====================================================================
function clearSelect(data){
    var selectReports;
    if(data == "#my-team-folders"){
        selectReports = $("#bookmarks-teamfolders-reports");
    }
    else{
        selectReports = $("#bookmarks-quickreports");
    }

    for(var i=0; i<=selectReports.childNodes.length; i++){
            selectReports.remove(selectReports.i);
    }
}
//====================================================================

function clearLocalStorage(data){

    var formData = JSON.parse(localStorage.getItem("FormData"));
    localStorage.removeItem("FormData");

    var formId = "ReportsForm";
    if(data == "#my-team-folders")
        formId = "MyTeamFoldersForm";
    var j=0;
    for(var i=0; i<formData.length; i++){
        if(formData[i].formId == formId)
            j++;
    }

    if(data == "#my-team-folders"){
        for(var i=0; i<j; i++)
            formData.pop();
    }
    else{
        formData.splice(0,j);
    }
    localStorage.setItem('FormData', JSON.stringify(formData));
}





//save links from forms to localStorage with key formData
function saveLinks() {
    var activeTab = location.hash;
    var links = [];
    var tmp = [];
    var selectName;
    var selecetURL;
    
    clearSelect(activeTab);
    
    tmp = all("#reports-data");

    for(var i=0; i<tmp.length-1; i=i+2){
        var name = tmp[i].children[1].value;
        var url = tmp[i+1].children[1].value;
        if(name != "" && url != ""){
            links.push({
                formId:"ReportsForm" ,
                name:name ,
                url:url
            });
        }       
    }

    tmp = all("#teamFolders-data");
    
    for(var i=0; i<tmp.length-1; i=i+2){
        var name = tmp[i].children[1].value;
        var url = tmp[i+1].children[1].value;
        
        if(name != "" && url != ""){
            links.push({
                formId:"MyTeamFoldersForm" ,
                name:name ,
                url:url
            });
        }
    }

    localStorage.setItem('FormData', JSON.stringify(links));

    updateSelect(activeTab);
}

//delete links from localStorage
function deleteLinksFromLocalStorage(data){

    var formData = JSON.parse(localStorage.getItem("FormData"));
    localStorage.removeItem("FormData");

    var formId = "ReportsForm";
    if(data == "#my-team-folders")
        formId = "MyTeamFoldersForm";
    var j=0;
    for(var i=0; i<formData.length; i++){
        if(formData[i].formId == formId)
            j++;
    }

    if(data == "#my-team-folders"){
        for(var i=0; i<j; i++)
            formData.pop();
    }
    else{
        formData.splice(0,j);
    }
    localStorage.setItem('FormData', JSON.stringify(formData));
}


//check if inputs in form are valid
function isValid(data){
    var returnVal = true;
    var links = [];
    var tmp = [];
    var urlExp = new RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}", i); 
    var linkExp = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
    if(data == "quick-reports")
        tmp = all(".reports-data");
    else{
        tmp = all(".teamFolders-data");
    }

    for(var i=0; i<tmp.length-1; i=i+2){
        var name = tmp[i].children[1].value;
        var url = tmp[i+1].children[1].value;



        if(name!="" && url=="" ){
            (tmp[i+1].children[1]).classList.add("error-input");
            if(returnVal){
                (tmp[i+1].children[1]).focus();
                (tmp[i+1].children[1]).style.outline = "none";
            }

            returnVal=false;
        }

        else if(name=="" && url!=""){
            (tmp[i].children[1]).classList.add("error-input");
            if(returnVal){
                (tmp[i].children[1]).focus();
                (tmp[i].children[1]).style.outline = "none";
            }
            returnVal=false;
        }

        else{
            tmp[i].children[1].classList.remove("error-input");
            tmp[i+1].children[1].classList.remove("error-input");
        }

        if(name!="" && url!="" && ( !urlExp.test(url) && !linkExp.test(url) ) ){
            (tmp[i+1].children[1]).classList.add("error-input");
            if(returnVal){
                (tmp[i+1].children[1]).focus();
                (tmp[i+1].children[1]).style.outline = "none";
            }
            returnVal=false;
        }
        if(url.slice(0,4) == "www."){
            var newURL = "http://";
            newURL+=url;
            tmp[i+1].children[1].value = newURL;
            tmp[i+1].children[1].text = newURL;
            returnVal=true;
        }
        if(!urlExp.test(url) && linkExp.test(url)){
            var newURL = "http://www.";
            newURL+=url;
            tmp[i+1].children[1].value = newURL;
            tmp[i+1].children[1].text = newURL;
            returnVal=true;
        }


    }
    return returnVal;
}
//====================================================================
function submitForm(data){
    
    if(data == "#my-team-folders"){
        if( isInputsNull("#my-team-folders") ){
            clearSelect("#my-team-folders");
            clearLocalStorage("#my-team-folders");
            $('#btnSettings-teamfolders-reports').click();
            $("#bookmarks-teamfolders-reports").classList.add("hidden");
            $("#teamfolders-frame").classList.add("hidden");
            toggleExpandBtn();
            return;
        }
        if(isValid("my-team-folders") == true){
            saveLinks();
            $('#btnSettings-teamfolders-reports').click();
            $("#bookmarks-teamfolders-reports").classList.remove("hidden");
            $("#teamfolders-frame").classList.remove("hidden");
        }
    }

    else{
        if( isInputsNull("#quick-reports") ){
            clearSelect("#quick-reports");
            deleteLinksFromLocalStorage("#quick-reports");
           // $("#quick-reports-settings-form").classList.toggle("hidden");
            $('#btnSettings-quickreports').click();
            $("#bookmarks-quickreports").classList.add("hidden");
            $("#quickreports-frame").classList.add("hidden");
            toggleExpandBtn();
            return;
        }
        if(isValid("quick-reports") == true){
            saveLinks();
            //$("#quick-reports-settings-form").classList.toggle("hidden");
            $('#btnSettings-quickreports').click();
            $("#bookmarks-quickreports").classList.remove("hidden");
            $("#quickreports-frame").classList.remove("hidden");
        }
    }

    toggleExpandBtn();
}


//toggle expand button with frame
function toggleExpandBtn(){
    if( $("#bookmarks-quickreports").options.length == 0){
        $("#expand-quickreports").classList.add("hidden");
    }else{
        $("#expand-quickreports").classList.remove("hidden");
    }

    if($("#bookmarks-teamfolders-reports").options.length == 0){
        $("#expand-teamfolders-reports").classList.add("hidden");
    }else{
        $("#expand-teamfolders-reports").classList.remove("hidden");
    }
}

function formValidation(data){
    var returnVal = true;
    var links = [];
    var tmp = [];
    var urlExp = new RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}", i); 
    var linkExp = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
    if(data == "quick-reports")
        tmp = all("#reports-data");
    else{
        tmp = all("#teamFolders-data");
    }

    for(var i=0; i<tmp.length-1; i=i+2){
        var name = tmp[i].children[1].value;
        var url = tmp[i+1].children[1].value;



        if(name!="" && url=="" ){
            (tmp[i+1].children[1]).classList.add("error-input");
            if(returnVal){
                (tmp[i+1].children[1]).focus();
                (tmp[i+1].children[1]).style.outline = "none";
            }

            returnVal=false;
        }

        else if(name=="" && url!=""){
            (tmp[i].children[1]).classList.add("error-input");
            if(returnVal){
                (tmp[i].children[1]).focus();
                (tmp[i].children[1]).style.outline = "none";
            }
            returnVal=false;
        }

        else{
            tmp[i].children[1].classList.remove("error-input");
            tmp[i+1].children[1].classList.remove("error-input");
        }

        if(name!="" && url!="" && ( !urlExp.test(url) && !linkExp.test(url) ) ){
            (tmp[i+1].children[1]).classList.add("error-input");
            if(returnVal){
                (tmp[i+1].children[1]).focus();
                (tmp[i+1].children[1]).style.outline = "none";
            }
            returnVal=false;
        }
        if(url.slice(0,4) == "www."){
            var newURL = "http://";
            newURL+=url;
            tmp[i+1].children[1].value = newURL;
            tmp[i+1].children[1].text = newURL;
            returnVal=true;
        }
        if(!urlExp.test(url) && linkExp.test(url)){
            var newURL = "http://www.";
            newURL+=url;
            tmp[i+1].children[1].value = newURL;
            tmp[i+1].children[1].text = newURL;
            returnVal=true;
        }


    }
    return returnVal;




}


function initialize(){

      //localStorage.clear();
     // UTILS.getDataRequest();
     
    UTILS.ajax("data/config.json", {done: updatePage});
    


    document.getElementById("btnSettings-quickreports").addEventListener('click', function(e){
        e.preventDefault();
        $("#btnSettings-quickreports").classList.toggle('active') ;
        // show the feildset content
        $("#quick-reports-settings-form").classList.toggle('hidden');
        // Set initial focus
        document.getElementById("nameReport1").focus();

        
    });

     document.getElementById("btnSettings-teamfolders-reports").addEventListener('click', function(e){
        e.preventDefault();
        $("#btnSettings-teamfolders-reports").classList.toggle('active') ;
        // show the feildset content
        $("#team-folders-settings-form").classList.toggle('hidden');
         // Set initial focus
        document.getElementById("folderName1").focus();
 
     });

     // quick reports setting cancel 
    document.getElementById("cancel-quick-reports").addEventListener('click',function(e){
        e.preventDefault();
        $('#btnSettings-quickreports').click();

    });


    // my team folders setting cancel 
    document.getElementById("cancel-team-folders").addEventListener('click',function(e){
        e.preventDefault();
        $('#btnSettings-teamfolders-reports').click();

    });


    document.getElementById("quickreports").addEventListener('submit', function (e) {
        e.preventDefault();

        if(formValidation('quick-reports') == true){
         submitForm("#quickreports");
        }
        
    });
    
    document.getElementById('teamfolders-reports_submit').addEventListener('click', function (e) {
        e.preventDefault();

        if(formValidation('my-team-folders') == true){
        submitForm("#my-team-folders");
       }
    });


    
   document.getElementById("bookmarks-quickreports").addEventListener('change', function(e){
        changeIFrame();
    });

    document.getElementById("bookmarks-teamfolders-reports").addEventListener('change', function(e){
        changeIFrame();
    });


    reloadLastTab();
    updateSelect("#quick-reports");
    updateSelect("#my-team-folders");
    toggleExpandBtn();
    frameUpload();
    loadLocalData();


}





window.onLoad = initialize();