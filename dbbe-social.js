(function ($) {

    Album = Backbone.Model.extend({
        id: null,
        full_picture: null,
        message: null,
        created_time: null
    });
    Insta = Backbone.Model.extend({
        media_type: null,
        media_url: null,
        thumbnail_url: null,
        caption: null
    });
    Photo = Backbone.Model.extend({
        media: null,
        type: null
    });
    varAToken = "EAANWvKagZBAMBO2ZCILZAxsiZBWAZCo1ltc3ptmHw2cJYfyVwbyOAoWzbbCV4XGodqr2TrJbiash3ZBEo5rdceG9AcUzaBZCZAGhEIrvewaOPCNvYPZB7wgZCL0a8gkXlqQmAFQTz3sgck6c7ip61nrhK6z7fv3NZB8OXo3ybTRZAIdXKHqnanUviz8icnBPKuZAyyisoShZBDniiB";
    varPageid = "345469512265820";
    varFields = "full_picture,message";
    varAToken2 = "IGQWRPSzNiUGF4dTZA4ZAXZACSWhxMVFDMXRIQjktRDN3VVdYZAGE0UEp2NzZAZAZAXE1OUhycDFDbmIzSndTaERWendyV2RYb0M5QUtzN3lrSTRScXRvWmZAmVjhCZAm5SbmZADS3kwUncwb1BIVElHdwZDZD";
    varFields2 = "id,media_type,media_url,thumbnail_url,caption,timestamp";
    Albums = Backbone.Collection.extend({
        initialize: function(models, options) {
            // Just binds a listener for when a new photo is added to the collection
            this.bind("add", options.view.addAlbumLi);
        }
    });
    Instas = Backbone.Collection.extend({
        initialize: function(models, options) {
            // Just binds a listener for when a new Insta is added to the collection
            this.bind("add", options.view.addInstaLi);
        }
    });

    Photos = Backbone.Collection.extend({
        initialize: function(models, options) {
            // Just binds a listener for when a new photo is added to the collection
            this.bind("add", options.view.addPhotoLi);
        }
    });

    window.AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function () {
            // Initializes the albums and photos collections
            this.albums = new Albums(null, {view: this});
            this.photos = new Photos(null, {view: this});
            this.instas = new Instas(null, {view: this});
            var that = this;
            $.ajax({ url: "https://graph.facebook.com/"+varPageid+"/feed?limit=6&fields="+varFields+"&access_token=" + varAToken,
                // AJAX to FB for getting MightyMoo albums
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    $.each(data['data'], function(index, value) {
                        // Album object has subset of tag names from FB response
                        var album = new Album(value);
                        that.albums.add(album);
                    });
                },
                complete: that.showAlbum
            });
            $.ajax({ url: "https://graph.instagram.com/me/media?limit=6&fields="+varFields2+"&access_token=" + varAToken2,
                // AJAX to FB for getting MightyMoo albums
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    $.each(data['data'], function(index, value) {
                        // Album object has subset of tag names from FB response
                        var insta = new Insta(value);
                        that.instas.add(insta);
                    });
                },
                complete: that.showInsta
            });
        },
        events: {
            "click #slideme": "showAlbum" // binds click handler for albums
        },
        showAlbum: function () {
            //var friend_name = prompt("Who is your friend?");
            sleep(1000).then(() => {
                $('.mijslider').slick({
                    slidesToShow: 3,
                    slidesToScroll: 1
                })
            });
        },
        showInsta: function () {
            //var friend_name = prompt("Who is your friend?");
            sleep(1000).then(() => {
                $('.mijslider2').slick({
                    slidesToShow: 3,
                    slidesToScroll: 1
                })
            });
        },        
        addPhotoLi: function (model) {
            // Adds small photo to DOM
            var dbbeimg7 = model.get('media');
            var dbbeimg7b = dbbeimg7['image']['src'];
            $("#friends-list").append("<a href='"+ dbbeimg7b +"' data-gallery><div class='photo-thumb' style='background: url("+ dbbeimg7b +");background-size:contain;'></div></a>");
        },
        addAlbumLi: function (model) {
                    $("#albums-list").append("<div><a href=\"#\" id=\""+ model.get('id') +
                        "\" class=\"album-names\"><img src=\""+ model.get('full_picture') +
                        "\"/><br>"+ model.get('message') +"</a></div>");
                    $("#"+ model.get("id") ).click(add_photos);
        },
        addInstaLi: function (model) {
            var vImgInsta = "";
            if(model.get('media_type')=="VIDEO"){
                vImgInsta = model.get('thumbnail_url');
            }else{
                vImgInsta = model.get('media_url');
            }
                    $("#instas-list").append("<div><a href=\"#\" id=\""+ model.get('id') +
                        "\" class=\"insta-names\" data-theimg=\""+vImgInsta+"\" data-therem=\""+model.get('caption')+"\" data-thetim=\""+model.get('timestamp')+"\"><img src=\""+ vImgInsta +
                        "\" style=\"aspect-ratio:1/1;object-fit:cover;\"/></a></div>");
    //                  "\" style=\"aspect-ratio:1/1;\"/><br>"+ model.get('timestamp') +"</a></div>");
                    $("#"+ model.get("id") ).click(show_instas);
        }
    });
    // AppView is the main backbone object, holds the methods and collections
    var appview = new AppView;
    function add_photos() {
        // Makes AJAX call to FB to get all photos in an album 
        // First remove any old pics from previous clicks
        $("#friends-list").empty();
        $("#staticBackdropLabel").text(this.text).css("font-weight", "bold");
        $.ajax({
            url: "https://graph.facebook.com/" + this.id + "?fields=attachments&access_token=" + varAToken, 
            dataType: "json",
            success: function (attachments, textStatus, jqXHR) {
                // Iterate thru photos and add to collection
                $.each(attachments['attachments'].data, function(index, value) {
                    var ro9lf6 = value['subattachments']['data'];
                    $.each(ro9lf6, function(index, value) {
                        appview.photos.add(new Photo(value));
                    });
                });
            }
        });
        sleep(1200).then(() => {
//            $('#blueimp-gallery').data('useBootstrapModal', false);
            $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', true);
            mijnmodal.show();
        });
    };
    function show_instas() {
        // First remove any old pics from previous clicks
        $("#friends-list").empty();
        //add values to list
        var dbbeimg = $(this).data('theimg');
        var dbbeRem = $(this).data('therem');
        var dbbeTim = new Date($(this).data('thetim'));
        var dbbeTim2 = dbbeTim.toLocaleString().split(",");
        var dbbeInsta = '<a style="font-weight:bold;color:#337ab7;" href="https://www.instagram.com/ballenbakeindhoven" target="_blank">Instagram pagina</a>';
        $("#staticBackdropLabel").text(dbbeTim2[0]).css("font-weight", "bold");
        $("#friends-list").append("<table style='margin:0;'><tr><td><img class='photo-thumb2' src='"+ dbbeimg +"'></td><td>"+dbbeRem+"<br><br>"+dbbeInsta+"</td></tr></table>");

        sleep(200).then(() => {
            $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', true);
            mijnmodal.show();
        });
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var mijnmodal = $('#exampleModal');
    $('.btn-close').bind('click', function() {
        mijnmodal.fadeOut();
    });
})(jQuery);