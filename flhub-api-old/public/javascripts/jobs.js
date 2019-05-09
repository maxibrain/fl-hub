function vote(e) {
    e.preventDefault();
    $.post("/jobs/rate/" + dir, job, function(res) {
        console.log(res);
    });
    return false;
}

function showJSON(e, json) {
    e.preventDefault();
    var newWindow = window.open();
    newWindow.document.write(json);
    return false;
}