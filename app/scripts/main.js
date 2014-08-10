'use strict';
var tripData = {
    locations: [{
        id: 'la1',
        title: 'Los Angeles',
        time: '2 days',
        map: {
            lat: 34.0204989,
            lng: -118.3117325,
            zoom: 11
        }
    }, {
        id: 'vegas',
        title: 'Las Vegas',
        time: '1 night',
        map: {
            lat: 36.125,
            lng: -115.175,
            zoom: 10
        }
    }, {
        id: 'canyon',
        title: 'Death Valley / Grand Canyon / Yosemite (night @ Curry Village)',
        time: '1 day + 1 night',
        map: {
            lat: 37.737683,
            lng: -119.572073,
            zoom: 10
        }
    }, {
        id: 'sf',
        title: 'San Francisco',
        time: '3 days',
        map: {
            lat: 37.77493,
            lng: -122.41942,
            zoom: 10
        }
    }, {
        id: 'coast1',
        title: 'Come back to LA through the coast',
        time: 'to update',
        map: {
            lat: 35.7373676,
            lng: -120.1404361,
            zoom: 7
        }
    }]
};
(function($, Mustache, tripData) {

    // perform some action only at loading
    var isStart = true;
    // render mustache template
    var template = $('#trip-step-template').html();
    // Mustache.parse(template); // optional, speeds up future uses
    var rendered = Mustache.render(template, tripData);
    $('#target').html(rendered).addClass('animated fadeIn');

    // firebase configuration
    var firebase = new Firebase('https://travelsuggestion.firebaseio.com/');

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    }

    // save a new comment
    function pushComment(location, author, comment) {
        firebase.push({
            location: location,
            author: author,
            comment: comment
        });
    }

    function isEmpty(el) {
        return !$.trim(el.html());
    }

    // insert comment in the specified location
    function insertComment(location, author, comment) {
        comment = escapeHtml(comment);
        var newComment = '<div class="suggestion animated fadeIn"><div class="suggestion-author">' + author + '</div><p>' + comment + '</p></div>';
        $('#' + location + ' .suggestion-list').append(newComment);
        $('#' + location + ' .empty-suggestion').remove();
    }

    // load values 1by1 and then monitor for new child (new comments)
    firebase.on('child_added', function(data) {
        insertComment(data.val().location, data.val().author, data.val().comment);
        if (isStart) {
            $('.suggestion-list').each(function() {
                if (isEmpty($(this))) {
                    $(this).append('<p class="empty-suggestion">No suggestion yet, be the first! :)</p>');
                }
            });
            $('.loading').addClass('hidden');
            $('.suggestion-list').removeClass('hidden').addClass('animated fadeInUp');
        }
    });



    $('.btn-suggest').click(function() {
        var tripStep = $(this).data('trip-step'),
            comment = $('#input-' + tripStep).val(),
            author;

        if (sessionStorage.getItem('author-name')) {
            author = sessionStorage.getItem('author-name');
            pushComment(tripStep, author, comment);
            $('#' + tripStep + ' .empty-suggestion').remove();
            $('#input-' + tripStep).val('');
        } else {
            $('#modal-name').modal('show');
            $('#btn-save-name').click(function() {
                author = $('#input-author-name').val();
                sessionStorage.setItem('author-name', author);
                pushComment(tripStep, author, comment);
                $('#' + tripStep + ' .empty-suggestion').remove();
                $('#modal-name').modal('hide');
            });
        }
    });

})(jQuery, Mustache, tripData);
