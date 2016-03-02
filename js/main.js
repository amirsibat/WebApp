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
            navSections[i].style.background = "black url(./img/icons/" + actions[i].icon + ".png)  left 50% top 77px no-repeat";
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
                actionLists[i].innerHTML += "<li><a tabindex=\"" + g + "\" href=\"" + actions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>";
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



function setIframe (val,id) {
    $('.iframe-'+id).setAttribute( 'src' , val );
    $('#expand-'+id).setAttribute( 'href', val );  
}

var selectOptionChange = function  (e) {
    e.preventDefault();
    var target = e.target;
    var optionValue = target.options[target.selectedIndex].value;
    var id = $('#'+target.id).parentNode.parentNode.querySelectorAll("form")[0].getAttribute('id');
    setIframe(optionValue,id);
}


function showSelectButtonAndIframe (id) {
     $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).classList.toggle('hidden');
}

function hideSelectButtonAndIframe (id) {
    $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).classList.toggle('hidden');
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
     $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).classList.remove('hidden'); 
}


function hideSelectButtonAndIframe (argument) {
    $('#bookmarks-' + id + ', .content-' + id + ', #expand-' + id).classList.add('hidden');
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
        var $form = $(form),
            $inputsName = $form.querySelectorAll('input[type="text"]'),
            $inputsUrl = $form.querySelectorAll('input[type="url"]');

            for (var i = 0; i < $inputsName.length; i++) {

            $inputsUrl[i].addEventListener('input', { inputsName: $inputsName, i: i } ,function(e) {
                if( $(this).value != '' || $(this).value != null ) 
                    e.data.inputsName[e.data.i].prop('required',true);
                else
                    e.data.inputsName[e.data.i].prop('required',false);
            });

            $inputsName[i].addEventListener('input', { inputsUrl: $inputsUrl, i: i } ,function(e) { 
                if( $(this).value != '' || $(this).value != null )
                    e.data.inputsUrl[e.data.i].prop('required',true);
                else
                    e.data.inputsUrl[e.data.i].prop('required',false);
            });             

            }

}





function initialize(){

        //localStorage.clear();
     // UTILS.getDataRequest();
    UTILS.ajax("data/config.json", {done: updateNotification});

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

    formValidation('.frmSettings');

    document.getElementById('quickreports').addEventListener('submit', function (e) {
        e.preventDefault();
        submitForm(e);
    });
    
    document.getElementById('my-team-folders').addEventListener('submit', function (e) {
        e.preventDefault();
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