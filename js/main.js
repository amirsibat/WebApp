function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
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
        var active=this.hash;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == active) {
          x=tabsList[i].parentNode;
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
     $(active).classList.remove('hidden');


};

var tabs =document.getElementsByClassName("tabs-links");

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", set_tab);
  };


function getActiveTabIndex(Tabs){
    for (var i = 0; i < Tabs.length; i++) {
        if(Tabs[i].getAttribute('class') == 'active'){
            return i;
        }
    }
}



function setIframe (val,id) {
    $('.iframe-'+id).attr( 'src' , val );
    $('#expand-'+id).attr( 'href', val );  
}

var selectOptionChange = function  (e) {
    e.preventDefault();
    var target = e.target;
    var optionValue = target.options[target.selectedIndex].value;
    var id = $('#'+target.id).parent().parent().find("form").first().attr('id');
    setIframe(optionValue,id);
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

            $('.frmSettings').each( function(index, element){
                
                $inputsName = $(this).find('input[type="text"]'),
                $inputsUrl = $(this).find('input[type="url"]');
                var formId = $(this).attr('id');
                for (var i = 0; i < $inputsName.length; i++) {

                url = $inputsUrl.eq(i).val();
                name = $inputsName.eq(i).val();
                nameElemId = $inputsName.eq(i).attr('id');
                urlElemId = $inputsUrl.eq(i).attr('id');

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
                $('#'+storageData[i].nameElemId).val(storageData[i].name);
                $('#'+storageData[i].urlElemId).val(storageData[i].url);
            }
        }



        }
        else{
            console.log("Browser doesn't support local storage")
        }
}


function submitForm (e) {
    e.preventDefault();
        var $form = $(e.target),
            $bookmark = $( '#bookmarks-' + $form.attr('id') ).eq(0),
            $inputsName = $form.find('input[type="text"]'),
            $inputsUrl = $form.find('input[type="url"]');

            var nameVal , urlVal, emptyCounter = 0;
            
            //reset bookmark
            $bookmark.find('option').remove();

            for (var i = 0; i < $inputsName.length; i++) {
            url = $inputsUrl.eq(i).val();
            name = $inputsName.eq(i).val();
            

            // check if not empty and add to bookmark
            if(name !== '' && url !== '' ){
                UTILS.addSelectToDropDownList($bookmark,name,url);
            }
            else{
                emptyCounter++;
            }

            }// end for

            // show bookmark - iframe - expand in case emptyCounter is not zero
                if(emptyCounter != 3){

                    $bookmark.focus();
                    UTILS.setIframe($bookmark.children(0).attr('value'), $form.attr('id'));
                    $('#btnSettings-'+ $form.attr('id')).click();
                    UTILS.showSelectButtonAndIframe($form.attr('id'));
                }
                else{
                    $bookmark.find('option').remove();
                    UTILS.hideSelectButtonAndIframe($form.attr('id'));
                }

            UTILS.saveToLocalStorage();

            return true;
 
}


function addSelectToDropDownList ($selectElement ,name,url) {
    var $option = $( '<option></option>' );
        $option.attr( 'value',url );
        $option.text(name);
        $selectElement.append($option);
}



function initRequiredInputsDependencies (form) {
    var $form = $(form),
            $inputsName = $form.find('input[type="text"]'),
            $inputsUrl = $form.find('input[type="url"]');

            for (var i = 0; i < $inputsName.length; i++) {

            $inputsUrl.eq(i).bind('input', { inputsName: $inputsName, i: i } ,function(e) {
                if( $(this).val() !== '') 
                    e.data.inputsName.eq(e.data.i).prop('required',true);
                else
                    e.data.inputsName.eq(e.data.i).prop('required',false);
            });

            $inputsName.eq(i).bind('input', { inputsUrl: $inputsUrl, i: i } ,function(e) { 
                if( $(this).val() !== '')
                    e.data.inputsUrl.eq(e.data.i).prop('required',true);
                else
                    e.data.inputsUrl.eq(e.data.i).prop('required',false);
            });             

            } 
}



function initialize(){

     // UTILS.getDataRequest();
    UTILS.ajax("data/config.json", {done: updateNotification});

    document.getElementById("btnSettings-quickreports").addEventListener('click', function(e){
       
        $("#btnSettings-quickreports").classList.toggle('active') ;
        // show the feildset content
        $("#quick-reports-settings-form").classList.toggle('hidden');
        
    });

     document.getElementById("btnSettings-teamfolders").addEventListener('click', function(e){
       
        $("#btnSettings-teamfolders").classList.toggle('active') ;
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
        $('#btnSettings-teamfolders').click();

    });

    //select options updates
    for(var i = 0; i < 2; i++){
        // $('.bookmarks').eq(i).change(selectOptionChange);
        all('.bookmarks')[i].addEventListener('change', selectOptionChange);
    }

    loadFromLocalStorage();
}







window.onLoad = initialize();