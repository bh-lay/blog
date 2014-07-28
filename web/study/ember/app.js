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

        var username = this.get("username");
        
        if(!username) {
        	return
        }
        // push username to recent user array

    	  App.recentUsersController.addUser(username);

	    this.set('content', []);
	
	
        var t = App.Tweet.create({

            avatar: 'http://static.bootcss.com/www/assets/img/codeguide.png',

            screen_name: '宋茜',

            text: 'JK_Rush - 博客园',

            date: '2013-12-23'

        });

        this.pushObject(t);


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