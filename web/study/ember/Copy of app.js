/**************************

* Application

**************************/
App = Em.Application.create();

/**************************

* Models

**************************/
App.Tweet = Em.Object.extend({

    avatar: null,

    screen_name: null,

    text: null,

    date: null

});

/**************************

* Views

**************************/
App.SearchTextField = Em.TextField.extend({

    insertNewline: function(){

        App.tweetsController.loadTweets();

    }

});

/**************************

* Controllers

**************************/
App.tweetsController = Em.ArrayController.create({

    content: [],

    username: '',

    loadTweets: function() {

        var me = this;

        var username = me.get("username");

        alert(username);

        if ( username ) {

            var url = 'http://api.twitter.com/1/statuses/user_timeline.json'

                url += '?screen_name=%@&callback=?'.fmt(me.get("username"));

            // push username to recent user array

            App.recentUsersController.addUser(username);
$.getJSON(url,function(data){

    me.set('content', []);

    $(data).each(function(index,value){

        var t = App.Tweet.create({

            avatar: value.user.profile_image_url,

            screen_name: value.user.screen_name,

            text: value.text,

            date: value.created_at

        });

        me.pushObject(t);

    })

});
        }

    }

});
App.recentUsersController = Em.ArrayController.create({

    content: [],

    addUser: function(name) {

        if ( this.contains(name) ) this.removeObject(name);

        this.pushObject(name);

    },

    removeUser: function(view){

        this.removeObject(view.context);

    },

    searchAgain: function(view){

        App.tweetsController.set('username', view.context);

        App.tweetsController.loadTweets();

    },

    reverse: function(){

        return this.toArray().reverse();

    }.property('@each')

});