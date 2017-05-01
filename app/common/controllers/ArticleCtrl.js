angular.module('app').controller('ArticleListCtrl', function ($rootScope, $scope, $location, $http, $window, Entity, UserService) {
    $scope.articles = Entity['Article'].query({}, function(articles){
        $scope.articles = articles.articles;
    });

    $scope.tags = Entity['Tag'].query({}, function(tags){
        $scope.tags = tags.tags;
    });

    $scope.favorite = function(article){
        Entity['Article'].favorite({slug : article.slug}, function(res){
            //done
        })
    }
});

angular.module('app').controller('FeedListCtrl', function ($rootScope, $scope, $location, $http, $window, Entity, UserService) {
    $scope.articles = Entity['Article'].feed({}, function(articles){
        $scope.articles = articles.articles;
    });

    $scope.tags = Entity['Tag'].query({}, function(tags){
        $scope.tags = tags.tags;
    });

    $scope.favorite = function(article){
        Entity['Article'].favorite({slug : article.slug}, function(res){
            //done
        })
    }
});

angular.module('app').controller('ArticleEditCtrl', function ($rootScope, $route, $scope, $location, $http, $window, Entity, UserService) {
    var slug = $route.current.params['slug'];
    $scope.article = {};
    if(slug){
        Entity['Article'].get({slug : slug}, function(article){
            $scope.article = article;
        })
    }

    $scope.saveArticle = function(article){
        Entity['Article'].save({article : article}, function(res){
            $location.path('/view-article/' + res.article.slug).replace();
        })
    }
});

angular.module('app').controller('ArticleViewCtrl', function ($rootScope, $scope, $location, $http, $window, $route, Entity, UserService) {
    var slug = $route.current.params['slug'];
    $scope.article = {};
    $scope.comments = [];

    //load article
    $scope.article = Entity['Article'].get({slug : slug}, function(article){
        $scope.article = article.article;
    })

    //load comments
    $scope.comments = Entity['Comment'].query({slug : slug}, function(comments){
        $scope.comments = comments.comments;
    })

    $scope.favorite = function(article){
        Entity['Article'].favorite({slug : article.slug}, function(res){
            //done
        })
    }

    $scope.addComment = function(article, comment){
        if(comment){
            Entity['Comment'].save({slug : article.slug}, {comment : comment}, function(res){
                $scope.comments.push(res.comment);
                $scope.comment = {};
            })
        }
    }
});