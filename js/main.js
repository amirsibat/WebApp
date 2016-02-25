function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
}

var updatePage = function (data) {
    updateNotificationArea(data.notification);
    // updateQuickActions(data.quickActions);
    // if (localStorage.pageData != "" && localStorage.pageData != null) {
    //     updateFolders("quick-reports");
    //     updateFolders("my-team-folders");
    // } else {
    //     localStorage.pageData = "";
    // }
};


var updateNotificationArea = function (data) {
    if (data !== undefined) {
        $(".notifications").innerHTML = "<p>" + data + "</p>";
    }
};


function initialize(){


    UTILS.ajax({

            url: 'data/config.json',
            dataType: "json"

        });
     // $(".input-search").addEventListener("keypress", searchEnter);
}







window.onLoad = initialize();