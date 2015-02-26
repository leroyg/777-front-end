;(function(exports){

    "use strict";


    Backbone.SevensRouter = Backbone.Router.extend({
        initialize: function(){
            this.container = document.querySelector(".container")
            Backbone.history.start();
        },
        routes: {
            "*default": "home"
        },
        home: function(){
            // var m = new Backbone.Photo({ id: "c91c37982fb792ea9ea714562ab0e1e9"});
            var c = new Backbone.Gallery();
            var coffee = d(CoffeeGoggles, {collection: c})
            React.render(coffee, this.container)
            c.fetch()

            var pusher = new Pusher('9e88d8c8fcbf4c114c30');
            var channel = pusher.subscribe('seven-live');
            channel.bind('photoCreated', function(data) {
                console.log('attempting to add:', data)
                // var newPhoto = new Backbone.Photo({id: data.id})
                // newPhoto.fetch().then(function(){
                c.fetch();
            });
        }
    })

    Backbone.Photo = Backbone.Model.extend({
        url: function(){
            return [
                "http://seven-seven-seven-api.herokuapp.com/api/photos/",
                this.id
            ].join('')
        }
    })

    Backbone.Gallery = Backbone.Collection.extend({
        model: Backbone.Photo,
        url: "http://seven-seven-seven-api.herokuapp.com/api/photos/",
        parse: function(data){
            return data.photos
        }
    })

    // var PhotoView = React.createClass({
    //     render: function
    // })

    var CoffeeGoggles = React.createClass({
        getInitialState: function(){
            return {}
        },
        getDefaultProps: function(){
            return { collection: { models: []} }
        },
        componentWillMount: function(){
            var self = this;
            this.props.collection && this.props.collection.on("add remove reset sync", function(){
                self.forceUpdate();
            })
        },
        render: function(){
            return d('div', [
                d('div.grid.grid-3-600.grid-2-400',
                    this.props.collection.models.map((function(model){
                        return d("span", {key: model.id}, [
                            d("img", {src: model.get("thumb_photo_url")} )
                        ])
                    }).bind(this))
                )
            ])
        }
    })

})(typeof module === "object" ? module.exports : window)