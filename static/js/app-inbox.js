$(document).ready(function() {

	var InboxMessage = Backbone.Model.extend({
		defaults: {
			id: '',
			subject: 'New message',
			unread: true,
			priority: false,
			paper: false,
			nulled: false, 
			date: '01-01-1970',
			deleted: false
		},
		alertClick: function(e) {
			return alert("Checkbox clicked!");
		},
		handleStateClick: function(e) {

			if(this.get('deleted')) {
				this.set({'unread': false, 'read': false, 'deleted':false });
			}

			this.set({ 'unread': !this.get('unread') });

		},
		handleTrashClick: function(e) {

			if(this.get('deleted')) {
				this.set({'unread': false, 'read': false, 'deleted':false });
			} else {
				this.set({'unread': false, 'deleted': true });
			}
		}

	});

	/*
	Views
	Remember to:
	- Create initalize function to listen for events
	*/
	InboxMessageView = Backbone.View.extend({
		tagName: 'tr',
		//className: '',
		template: _.template($('#msg-template').html()),
		initialize: function() {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
			return this.model.on('hide', this.remove, this);
		},
		events: {
			'click input[type="checkbox"]': 'alertClick',
			'click .state a': 'handleStateClick',
			'click .trash a': 'handleTrashClick',
		},
		render: function() {
			var attributes = this.model.toJSON();

			//Add the corresponding classes
			if(this.model.get('unread')) {
				this.$el.addClass('unread');
			} else { this.$el.removeClass('unread'); }

			if(this.model.get('priority')) {
				this.$el.addClass('priority');
			} else { this.$el.removeClass('priority'); }

			if(this.model.get('paper')) {
				this.$el.addClass('paper');
			} else { this.$el.removeClass('paper');	}

			if(this.model.get('nulled')) {
				this.$el.addClass('nulled');
			} else { this.$el.removeClass('nulled'); }

			if(this.model.get('deleted')) {
				this.$el.addClass('deleted');
			} else { this.$el.removeClass('deleted'); }

			return this.$el.html(this.template(attributes));

		},
		remove: function() {
			return this.$el.remove();
		},
		alertClick: function(e) {
			return this.model.alertClick();
		},
		handleStateClick: function(e) {
			/* This is copied from the jQuery example.
			Although this works it is still manipulating the DOM when what we are really doing is alter the model,
			So, let the model do it. It will re-render it automatically!
			*/
			/*
			var parentTr = this.$el; //No need to look for the parent 'tr', the view model IS the 'tr'
			//Change state mode
			if(parentTr.hasClass('deleted')) {
				//Change state to "unread"
				parentTr.removeClass('unread read deleted');
			} 
			parentTr.toggleClass('unread');			*/
			return this.model.handleStateClick();
		},
		handleTrashClick: function(e) {
			/* This is copied from the jQuery example.
			Although this works it is still manipulating the DOM when what we are really doing is alter the model,
			So, let the model do it. It will re-render it automatically!
			*/
			/*
			var parentTr = this.$el; //No need to look for the parent 'tr', the view model IS the 'tr'
			//Change state mode
			if(parentTr.hasClass('deleted')) {
				//Change state to "read"
				parentTr.removeClass('deleted unread read'); 
			} else {
				parentTr.removeClass('unread').addClass('deleted');
			}
			*/
			return this.model.handleTrashClick();
		}
	});

	/*
	Collections
	*/
	messages = [
	{id: 101, subject : "Email Priority Unread", unread: true, priority: true, paper: false, nulled: false, date: "10/02/2012"},
	{id: 102, subject : "Email Priority Read", unread: false, priority: true, paper: false, nulled: false, date: "11/02/2012"},
	{id: 103, subject : "Email Unread", unread: true, priority: false, paper: false, nulled: false, date: "12/02/2012"},
	{id: 104, subject : "Email Read", unread: false, priority: false, paper: false, nulled: false, date: "13/02/2012"},
	{id: 105, subject : "Email Paper Nulled Read", unread: false, priority: true, paper: true, nulled: true, date: "14/02/2012"},
	{id: 106, subject : "Email Paper Unread", unread: true, priority: false, paper: true, nulled: false, date: "15/02/2012"},
	{id: 107, subject : "Email Paper Read", unread: false, priority: false, paper: false, nulled: false, date: "16/02/2012"},
	{id: 108, subject : "Email Paper Nulled Read", unread: false, priority: false, paper: true, nulled: true, date: "17/02/2012"},
	{id: 109, subject : "Email Paper Unread", unread: true, priority: false, paper: true, nulled: false, date: "18/02/2012"}
	]

	InboxMessageList = Backbone.Collection.extend({
		model: InboxMessage,
		url: 'http://localhost:8080/inbox',
		initialize: function() {
			this.on('reset', this.doSomething, this);
			return this.on('remove', this.hideModel, this);
		},
		doSomething: function() {
			console.log("Reset executed, doing something...");
			return console.log("InboxMessageList length: " + this.length);
		},
		hideModel: function(model) {
			return model.trigger('hide');
		}
	});
	inboxMessageList = new InboxMessageList();
	//inboxMessageList.fetch();
	inboxMessageList.reset(messages);

	/*
	Collection Views
	*/
	InboxMessageListView = Backbone.View.extend({
		tagName: 'tbody',
		id: 'inbox-content',
		initialize: function() {
			this.collection.on('add', this.addOne, this);
			return this.collection.on('reset', this.addAll, this);
		},
		render: function() {
			return this.addAll();
		},
		addAll: function() {
			return this.collection.forEach(this.addOne, this);
		},
		addOne: function(inboxMessage) {
			var inboxMessageView = new InboxMessageView({
				model: inboxMessage
			});
			return this.$el.append(inboxMessageView.render());
		}
	});

	/*
	Application
	*/

	InboxApp = new (Backbone.Router.extend({
		el: '#inbox',
		initialize: function() {
			this.inboxMessageList = inboxMessageList;
			var inboxMessageListView = new InboxMessageListView({
				collection: this.inboxMessageList
			});
			inboxMessageListView.render();
			return $("" + this.el).append(inboxMessageListView.el);
		},
		start: function() {
			return Backbone.history.start({
				pushState: true
			});
		}
	}));

	/*
	Init and behavior
	*/
	InboxApp.start();

	//Add msg
	$('#addRow').click(function(e) {
		e.preventDefault();
		return InboxApp.inboxMessageList.add(new InboxMessage( getServerData() ));
	});
});

//Simulate ajax call:
function getServerData() {
	return {id: Math.random(), subject : "New message with events! :D", unread: true, priority: false, paper: false, nulled: false, date: "14/02/2012"};
}