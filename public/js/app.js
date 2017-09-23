$(document).on("click", "#scrape", function() {
    
    //do a new scrape of articles
    let getArticles = new Promise(function(resolve, reject){
        $.getJSON("/scrape");
    });

    // Grab the articles to render
    getArticles.then(function(result){
        $.getJSON("/articles");
    });

});

// Whenever someone clicks add comment button
$(document).on("click", ".js-show-comments", function() {
    let id = $(this).attr("data-id");
    let requestURL = "/articles/"+id;
    //do a get request for the correct data
    $.getJSON(requestURL, function(result) {
        let id = result[0]._id;
        $("#article-comments").text("");
        for(var i=0; i<result[0].comments.length;i++){
            let commentContainer=$("<div>");
            let deleteBtn=$("<button>")
            deleteBtn.addClass("btn btn-danger btn-margin js-btn-delete");
            deleteBtn.text("Delete");
            deleteBtn.attr("data-id", result[0].comments[i]._id)
            commentContainer.addClass("comments");
            commentContainer.attr("id", result[0].comments[i]._id);
            commentContainer.text(result[0].comments[i].message);
            $(commentContainer).append(deleteBtn);
            $("#article-comments").append(commentContainer);
        }
        $('#comments').modal('toggle');
        $("#save-comment").attr("data-id", id);  
    }); 
});

// Whenever someone clicks add comment button
$(document).on("click", "#save-comment", function() {
    
    let id = $(this).attr("data-id");
    let requestURL = "/articles/"+id;
    console.log($("#comments-new").val());
    //do a post request with new comment
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: requestURL,
        data: {
            // Value taken from title input
            message: $("#comments-new").val(),
        }
    })
    // With that done
    .done(function(data) {  
        let commentContainer=$("<div>");
        let deleteBtn=$("<button>")
        deleteBtn.addClass("btn btn-danger btn-margin js-btn-delete");
        deleteBtn.text("Delete");
        //TODO!!!
        deleteBtn.attr("data-id", "need commentID");
        commentContainer.addClass("comments");
        commentContainer.text($("#comments-new").val());
        //TODO!!!
        commentContainer.attr("id", "need commentID");
        $(commentContainer).append(deleteBtn);
        $("#article-comments").append(commentContainer);
        
        // Empty the notes section
        $("#comments-new").text("");
    });
});

$(document).on("click", ".js-btn-delete", function(){
    let id = $(this).attr("data-id");
    let requestURL = "/comments/" + id
    $.ajax({
        url: requestURL,
        type: 'DELETE',
        success: function(result) {
            //delete comment from modal
            let commentIDCont = "#"+result._id;
            $(commentIDCont).html("");
        }
    });
});

$(document).on("click", "#close-modal", function() {
    $('#comments').modal('toggle');
});