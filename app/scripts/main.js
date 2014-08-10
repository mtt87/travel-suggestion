'use strict';
(function(window, $) {
    // firebase configuration
    var firebase = new Firebase('https://travelsuggestion.firebaseio.com/');

    // insert new value
    firebase.child('la1/').on('child_added', function(snapshot) {
        var newComment = '<div class="suggestion fade in"><div class="suggestion-author">' + snapshot.val().author + '</div><p>' + snapshot.val().comment + '</p></div>';
        $('#la1 .suggestion-list').append(newComment);
    });

    function pushComment(location, author, comment) {
        firebase.child(location).push({
            author: author,
            comment: comment
        });
    }

    $('.btn-suggest').click(function() {

        var tripStep = $(this).data('trip-step'),
            comment = $('#input-la1').val(),
            author;

        if (sessionStorage.getItem('author-name')) {
            author = sessionStorage.getItem('author-name');
            pushComment(tripStep, author, comment);
            $('#input-la1').val('');
        } else {
            $('#modal-name').modal('show');
            $('#btn-save-name').click(function() {
                author = $('#input-author-name').val();
                sessionStorage.setItem('author-name', author);
                pushComment(tripStep, author, comment);
                $('#modal-name').modal('hide');
            });
        }
    });

})(window, jQuery);
