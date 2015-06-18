(function() {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var user = JSON.parse(ajax.responseText);
            console.log("Success.");
        } else {
            console.log("Failure.");
        }
        // This function will be executed four times,
        // so it's not unusual for the log on the console
    }
    
    ajax.open('GET', './anqurvanillapy', true);
    ajax.send();

    console.log(user);
    // Executed at the first time,
    // and displaying `undefined`
})();