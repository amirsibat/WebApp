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


function updatePageData(data){
    updateNotification(data.notification);
    updateQuickActions(data.quickActions);
}



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





var selectOptionChange = function  (e) {
    e.preventDefault();
    var target = e.target;
    var optionValue = target.options[target.selectedIndex].value;
    var id = $('#'+target.id).parentNode.parentNode.querySelectorAll("form")[0].getAttribute('id');
    setIframe(optionValue,id);
}



function checkDuplicates(name,url){

var usedNames = {};
    var select = $("select > option");
    for(var i in select) {
  if(name == i.value) {
     $(i).remove();
 } else {
     return 1;
 }
}
    return 0;
}


function addSelectToDropDownList ($selectElement ,name,url) {
    var $option = document.createElement('option');
        $option.setAttribute( 'value',url );
        $option.textContent = name;
        $selectElement.appendChild($option);
}

function setIframe (val,id) {
    $('.iframe-'+id).setAttribute( 'src' , val );
    $('#expand-'+id).setAttribute( 'href', val );  
}


function showSelectButtonAndIframe (id) {
     $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).classList.toggle('hidden'); 
}


function hideSelectButtonAndIframe (id) {
    $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).classList.toggle('hidden');
}


function saveToLocalStorage () {
     if (typeof(Storage) !== "undefined"){

            var arr = [];
            var $frmsettings =  document.getElementsByClassName('frmSettings');

            Array.prototype.forEach.call( $frmsettings, function(index, element){
                
                $inputsName = this.all('input[type="text"]'),
                $inputsUrl = this.all('input[type="url"]');

                var formId = $frmsettings[0].getAttribute('id');
                
                for (var i = 0; i < $inputsName.length; i++) {

                url = $inputsUrl[i].value;
                name = $inputsName[i].value;
                nameElemId = $inputsName[i].getAttribute('id');
                urlElemId = $inputsUrl[i].getAttribute('id');


                arr.push({
                    formId: formId,
                    name: name,
                    url: url,
                    nameElemId: nameElemId,
                    urlElemId : urlElemId
                });


                }


            
            });

            localStorage.setItem('storage', JSON.stringify(arr));

        }
        else{
            console.log("Browser doesn't support local storage")
        }
}


function loadFromLocalStorage () {
    if (typeof(Storage) !== "undefined") {
        var storageData = JSON.parse(localStorage.getItem('storage'));


        if(storageData !== null){
            for(var i=0; i<storageData.length; i++){
                 $('#'+storageData[i].nameElemId).valueOf(storageData[i].name);
                 $('#'+storageData[i].urlElemId).valueOf(storageData[i].url);
               
            }
        }



        }
        else{
            console.log("Browser doesn't support local storage")
        }
}



function submitForm (e) {
     e.preventDefault();
     var $form = e.target,
            $bookmark = all('#bookmarks-' + $form.getAttribute('id'))[0],
            $inputsName = $form.querySelectorAll('input[type="text"]'),
            $inputsUrl = $form.querySelectorAll('input[type="url"]');
    
            var nameVal , urlVal, emptyCounter = 0;
            
            //reset bookmark
             if($bookmark.length != 0){
             for (var i=0; i<$bookmark.length; i++){
                    $bookmark.options.remove(i);
                }

            }



            for (var i = 0; i < $inputsName.length; i++) {
            url = $inputsUrl[i].value;
            name = $inputsName[i].value;
            

            // check if not empty and add to bookmark
            if(name !== '' && url !== '' ){
                    checkDuplicates(name,url);

                    addSelectToDropDownList($bookmark,name,url);
            }
            else{
                emptyCounter++;
            }

            }// end for

            // show bookmark - iframe - expand in case emptyCounter is not zero
                if(emptyCounter != 3){

                    $bookmark.focus();
                         setIframe( $bookmark.getElementsByTagName("option")[0].attributes[0].value, $form.getAttribute('id'));
                    $('#btnSettings-'+ $form.getAttribute('id')).click();
                        showSelectButtonAndIframe($form.getAttribute('id'));
                }
                else{
                    // $bookmark.find('option').remove();
                        for (var i=0; i<$bookmark.length; i++){
                                $bookmark.options.remove(i);
                          }
                        hideSelectButtonAndIframe($form.getAttribute('id'));
                }

            saveToLocalStorage();

            return true;


}


function formValidation(form){

        var returnVal = true;
        var tmp = $(form).querySelectorAll('.input-wrapper');
        var urlExp = new RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}", i); 
        var linkExp = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);


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
                (tmp[i+1].children[1]).style.outline = "none";
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
       
        $("#btnSettings-quickreports").classList.toggle('active') ;
        // show the feildset content
        $("#quick-reports-settings-form").classList.toggle('hidden');
        // Set initial focus
        document.getElementById("nameReport1").focus();

        
    });

     document.getElementById("btnSettings-teamfolders-reports").addEventListener('click', function(e){
       
        $("#btnSettings-teamfolders-reports").classList.toggle('active') ;
        // show the feildset content
        $("#team-folders-settings-form").classList.toggle('hidden');



        
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

    

    document.getElementById('quickreports').addEventListener('submit', function (e) {
        e.preventDefault();
        if(formValidation('.frmSettings') == true){
          submitForm(e);  
        }
        
    });
    
    document.getElementById('my-team-folders').addEventListener('submit', function (e) {
        e.preventDefault();
        formValidation('.frmSettings');
        submitForm(e);
    });


    

    //select options updates
    for(var i = 0; i < 2; i++){
        // $('.bookmarks').eq(i).change(selectOptionChange);
        all('.bookmarks')[i].addEventListener('change', selectOptionChange);
    }

    loadFromLocalStorage();
}





window.onLoad = initialize();