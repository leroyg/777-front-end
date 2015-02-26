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

            // var pusher = new Pusher('9e88d8c8fcbf4c114c30');
            // var channel = pusher.subscribe('seven-live');
            // channel.bind('photoCreated', function(data) {
            //     console.log('attempting to add:', data)
            //     // var newPhoto = new Backbone.Photo({id: data.id})
            //     // newPhoto.fetch().then(function(){
            //     c.fetch();
            // });
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

    var PhotoView = React.createClass({
        className: "Photo",
        getDefaultProps: function(){
            return {}
        },
        getInitialState: function(){
            return {
                loaded: false,
                inViewport: false
            }
        },
        componentWillMount: function(){
            var self = this;
            this.onscroll = function(e, force){
                var inViewport = self._getScrollTop(force)
                if(inViewport){
                    self.refs.img.getDOMNode().classList.add("loaded")
                } else {
                    self.refs.img.getDOMNode().classList.remove("loaded")
                }
            }
            this.onscroll = _.debounce(this.onscroll, 16)
            window.addEventListener('scroll', this.onscroll)
        },
        componentWillUnmount: function(){
            window.removeEventListener('scroll', this.onscroll)
        },
        _getScrollTop: function(loaded){
            var a = this.refs.img.getDOMNode(),
                _y = a.offsetTop,
                b = a.offsetHeight - 100,
                h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            return (loaded || this.state.loaded) && ((_y + b > window.scrollY) && (_y + 100 < window.scrollY + h))
        },
        _loaded: function(){
            this.setState({ loaded: true })
            this.onscroll(null, true);
        },
        render: function(){
            var model = this.props.model;
            return d("div", [
                d("img.dynamic@img", {src: model && model.get("large_photo_url"), onLoad: this._loaded} ),
            ])
        }
    })

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
            Pace.restart();
            var arr = this.props.collection.models,
                arr2 = [],
                i = 0;
            // duplicate tenfold for scrolling
            while(i < 10){
                arr2.push.apply(arr2, arr)
                i++;
            }

            return d('div', [
                d('div.grid.grid-3-600.grid-2-400',
                    arr2.map((function(model){
                        return d(PhotoView, { model: model, key: model.id+Math.random() })
                    }).bind(this))
                ),
            ])
        }
    })

})(typeof module === "object" ? module.exports : window)