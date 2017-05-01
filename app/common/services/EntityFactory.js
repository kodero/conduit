angular.module('app').factory('Entity', function ($resource) {
        var __apiBase__ = 'https://conduit.productionready.io/api/';
        return {
            User : $resource(__apiBase__ + 'users/:id', {id: '@id', profileId :'@profileId'},{
                update : {method : 'PUT', url : __apiBase__ + 'user', isArray : false},
                login : {method : 'POST', url : __apiBase__ + 'users/login', isArray : true},
                currentUser : {method : 'GET', url : __apiBase__ + 'user', isArray : false}
            }),
            Profile : $resource(__apiBase__ + 'profiles/:username', {username: '@username'},{
                follow : {method : 'POST', url : __apiBase__ + 'users/:username/follow'},
                unfollow : {method : 'DELETE', url : __apiBase__ + 'users/:username/follow'}
            }),
            Article : $resource(__apiBase__ + 'articles/:slug', {slug: '@slug'},{
                query : {method : 'GET', url : __apiBase__ + 'articles', isArray : false},
                feed : {method : 'GET', url : __apiBase__ + 'articles', isArray : false},
                favorite : {method : 'POST', url : __apiBase__ + 'articles/:slug/favorite'}
            }),
            Comment : $resource(__apiBase__ + 'articles/:slug/comments/:id', {id: '@id', slug: '@slug'},{
                query : {method : 'GET', url : __apiBase__ + 'articles/:slug/comments', isArray : false},
            }),
            Tag : $resource(__apiBase__ + 'tags', {},{
                query : {method : 'GET', url : __apiBase__ + 'tags', isArray : false},
            })
        }
    }
);