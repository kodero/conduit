'use strict'

require('./LemrHttpInterceptor');
require('./EntityFactory');
require('./UserService');

//common services
angular.module('app').factory('pageParams', function() {
    return {};
});

//define base controllers
var BaseListCtrl = function ($scope, $location, $alert, PermissionService) {
    //paging stuff
    $scope.pageSize = 25;
    $scope.pages = [];
    $scope.currentPage = ($location.search()).page ? ($location.search()).page : 1;
    $scope.totalCount = 0;
    $scope.start = 0;
    $scope.end = 0;
    $scope.summariesResults = '';

    //search
    $scope.search = {};

    //define permissions
    if(PermissionService && $scope.permissionFilter){
        $scope.permissionService = PermissionService;
        PermissionService.loadScopePermissions($scope.permissionFilter);
    }

    //baseWhere, defined here conditionally
    //if($scope.ignoreEntityStatusFilter === true) $scope.baseWhereClause = 'entityStatus,=,FINAL,|,createdByUser.id,=,loggedInUser';

    //define the _getList
    $scope._getList = function(){
        var params = $scope._getParams() || {} ;
        if($scope.baseWhereClause){//only bother with the base where clause if it exists
            if(!params.where) {
                params.where = $scope.baseWhereClause;
            }else{
                //check if the where clause is an array
                if(typeof params.where == 'string' || params.where instanceof String){
                    var existingWhere = params.where; //copy existing value
                    params.where = [existingWhere,$scope.baseWhereClause];
                }else if(params.where instanceof Array){
                    params.where.push($scope.baseWhereClause);
                }
            }
        }

        console.log('params : ' + JSON.stringify(params));
        params.page = $scope.currentPage;
        if($scope.sortAttr && $scope.sortAttr !== '') params.orderBy = ($scope.sortDir == 'desc'? '-' : '') + $scope.sortAttr;
        if(!$scope.queryMethod) $scope.queryMethod = 'query'; //set default query method if it was not set
        $scope.Entity[$scope.queryMethod](params, function(entities, headers) {
            $scope.entities = entities;
            $scope.totalCount = headers("totalCount");
            $scope.currentPage = headers("currentPage");
            $scope.start = headers("start");
            $scope.end = headers("end");
            $scope.pageSize = headers("pageSize") || 25;
            $scope.selected = [];//TODO, see if we can harvest the ids
            $scope.pages = [];
            //for(var i=0; i < pgs; i++){$scope.pages.push(i+1);}
            var total = parseInt($scope.totalCount), i = 1, totalPages = 0;
            $scope.totalCount = parseInt($scope.totalCount);
            if($scope.totalCount === 0){
                totalPages = 0;
            }else if($scope.totalCount % $scope.pageSize == 0){
                totalPages = $scope.totalCount / $scope.pageSize;
            }else{
                totalPages = ($scope.totalCount / $scope.pageSize) + 1;
            }

            for(var i = 0; i < totalPages; i++ ){
                $scope.pages.push(i);
            }

            //automatically select the first entity
            if(entities.length === 1) {
                $scope.selectedEntity = entities[0];
                entities[0].selected = true;
                $scope.selected = [entities[0]];
            }

            if($scope.queryCallback && typeof $scope.queryCallback == 'function'){
                $scope.queryCallback(entities, headers);
            }
        });

        /*$scope.formatReportDate = function(input){
            if(input == null){ return ""; } //18-08-2015
            var match = /^(\d\d)-(\d\d)-(\d{4})/.exec(input);
            var _date = match[3] + '-' + (Number(match[2])) + '-' + Number(match[1]);
            return _date;
        }*/

        //process summaries, in the form of <function>|<field>|<label>
        if($scope.summariesA){
            $scope.summariesResults = '';
            angular.forEach($scope.summariesA, function(value, key) {
                var summaryValues = value.split('|');
                $scope.Entity.getSummaries({_function : summaryValues[0], field : summaryValues[1], where : params.where},function(res){
                    $scope.summariesResults = $scope.summariesResults + (summaryValues[2] + ' : ' + res[summaryValues[0]]) + '; ';
                })
            });
        }
    };

    //controlling selections
    $scope.selected = [];
    $scope.selectedEntity = {};
    var updateSelected = function(action, entity, $index) {
        var id = entity.id || entity.attributes.id;
        if (action === 'add' && $scope.selected.indexOf(id) === -1) {
            $scope.selected.push({id : id, index : $index});
            entity.selected = true;
        }
        if (action === 'remove' ) {
            var index = $scope.selected.map(function(e) { return e.id; }).indexOf(id);
            $scope.selected.splice(index, 1);
            entity.selected = false;
        }
    };

    $scope.updateSelection = function($event, entity, $index) {
        $event.stopPropagation();
        $scope.selectedEntity = entity;
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, entity, $index);
        if ($scope.selectedCallback && typeof($scope.selectedCallback) === "function") {
            $scope.selectedCallback($scope.selectedEntity);
        }
    };

    $scope.selectAll = function($event) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        for ( var i = 0; i < $scope.entities.length; i++) {
            var entity = $scope.entities[i];
            updateSelected(action, entity);
        }
    };

    $scope.rowClick = function(entity, $index){
        //clears all selections
        angular.forEach($scope.entities, function(ent, key) {
            ent.selected = false;
        });
        entity.selected = true;
        $scope.selectedEntity = entity;
        $scope.selected = [];
        $scope.selected.push({id : entity.attributes.id, index : $index});
    };

    //sorting stuff
    if(!$scope.sortAttr) $scope.sortAttr = '';
    if(!$scope.sortDir) $scope.sortDir = '';
    $scope.setSortAttr = function(sortAttr){
        if($scope.sortAttr == sortAttr){
            //we are only toggling the sortDir
            if($scope.sortDir == 'asc') $scope.sortDir = 'desc';
            else if($scope.sortDir == 'desc') $scope.sortDir = 'asc';
        }else{
            $scope.sortAttr = sortAttr;
            $scope.sortDir = 'asc';
        }
        //load the list
        $scope._getList();
    };

    $scope.sortClass = function (sortAttr) {
        var sortClass = '';
        if($scope.sortAttr == sortAttr) {
            sortClass = 'currentSort';
            if($scope.sortDir == 'asc') sortClass = sortClass + ' sortAsc';
            else if($scope.sortDir == 'desc') sortClass = sortClass + ' sortDesc';
        }
        return sortClass;
    };

    //set page size
    $scope.setPageSize = function(pageSize){
        $scope.pageSize = pageSize;
    };

    $scope.setCurrentPage = function(page){
        $scope.currentPage = page;
        $location.search('page', page);
        $scope._getList();
    };

    $scope.refresh = function(){
        $scope._getList();
    };

    //edit
    $scope.edit = function() {
        $location.path($scope.entityUrl + '/edit/' + $scope.selectedEntity.attributes.id);
    };

    //view
    $scope.view = function() {
        $location.path($scope.entityUrl + '/view/' + $scope.selectedEntity.attributes.id);
    };

    $scope.newp = function() {
        var urlParams = '';
        if($scope.newEntityUrlParams){
            angular.forEach($scope.newEntityUrlParams, function(key, value){
                urlParams + '?' + value + '=' + ($location.search())['value'];
            })
        }
        $location.path($scope.entityUrl + '/new' + urlParams).search({});
    };

    $scope.delete = function(){
        $scope.selectedEntity.id = $scope.selectedEntity.attributes.id;
        $scope.selectedEntity.$remove({}, function(resp){
            $scope.entities.splice($scope.selected[0].index, 1);
            $scope.totalCount = $scope.totalCount - 1;
            $scope.end = $scope.end - 1;
            $scope.selected = [];
            $alert({
                title: 'Success!',
                content: 'Delete successful',
                duration : 3,
                html : true,
                placement: 'top',
                type: 'success',
                show: true,
                animation: 'am-fade-and-slide-top'
            });
        });
    };

    /*$scope.formatReportDate = function(input){
        if(input == null){ return ""; } //18-08-2015
        var match = /^(\d\d)-(\d\d)-(\d{4})/.exec(input);
        var _date = match[3] + '-' + (Number(match[2])) + '-' + Number(match[1]);
        return _date;
    }*/
};

//base Edit Ctrl
var BaseEditCtrl = function($scope, $location, $route, $validation, $alert, PermissionService){

    $scope.savingInProgress = false;

    //define permissions
    if(PermissionService && $scope.permissionFilter){
        $scope.permissionService = PermissionService;
        PermissionService.loadScopePermissions($scope.permissionFilter);
    }

	$scope._getEntityId = function(){
		return $route.current.params[$scope.entityParam];
	}

	if($scope._getEntityId()){
        var params = {id: $scope._getEntityId()};
        if($scope.fields) params.fields = $scope.fields;
        if($scope.collections) params.collections = $scope.collections;
        if($scope.collectionsOrderBy) params.collectionsOrderBy = $scope.collectionsOrderBy;
		$scope.entity = $scope.Entity.get(params, function(entity) {
			$scope.entity = entity;
            if($scope.loadCallback && typeof $scope.loadCallback == 'function'){
                $scope.loadCallback($scope.entity);
            }
		});
	}else{
		$scope.entity = new $scope.Entity($scope._entityInitParams);
        if($scope.loadCallback && typeof $scope.loadCallback == 'function'){
            $scope.loadCallback($scope.entity);
        }
	}

	//form for validation
	$scope.form = {
        requiredCallback: 'required',
        checkValid: $validation.checkValid,
        submit: function (form) {
            $validation.validate(form).success(function(){
                //on save callbacks
                if($scope.onSaveCallback && typeof $scope.onSaveCallback == 'function'){
                    $scope.onSaveCallback($scope.entity);
                }
            	$scope.save();
            }).error(function(){
                $alert({
                    title: 'Error!',
                    content: 'Please make sure all the values required have been provided',
                    duration : 10,
                    placement: 'top',
                    type: 'danger',
                    show: true,
                    animation: 'am-fade-and-slide-top'
                });
                $alert({title: 'Error!', content: 'Please make sure all the values required have been provided', duration : 10, placement: 'top', type: 'error', show: true});
            });
        },
        reset: function (form) {
            $validation.reset(form);
        }
    };

	$scope.save = function() {
	    $scope.savingInProgress = true;
        $scope.entity.id = $scope.entity.attributes.id;
        $scope.entityBeforeSave = angular.copy($scope.entity);
		$scope.entity.$save(function(entity) {
			//notify.success({message:'Save successful!'});
            $alert({
                title: 'Success!',
                content: 'Save successful',
                duration : 3,
                html : true,
                placement: 'top',
                type: 'success',
                show: true,
                animation: 'am-fade-and-slide-top'
            });
            if($scope.afterSaveCallback && typeof $scope.afterSaveCallback == 'function'){
                $scope.afterSaveCallback($scope.entity);
            }else{
                $location.path($scope.entityUrl + '/view/' + entity.attributes.id).replace();
            }
		},function(err){
            $scope.savingInProgress = false;
        });
	};

	$scope.done = function() {
		$location.path($scope.entityUrl + '/');
	};
}

//base View Ctrl
var BaseViewCtrl = function($scope, $location, $route, PermissionService){

    //define permissions
    if(PermissionService && $scope.permissionFilter){
        $scope.permissionService = PermissionService;
        PermissionService.loadScopePermissions($scope.permissionFilter);
    }

	$scope._getEntityId = function(){
		return $route.current.params[$scope.entityParam];
	}

	if($scope._getEntityId()){
        var params = {id: $scope._getEntityId()};
        if($scope.fields) params.fields = $scope.fields + ',createdByUser,updatedByUser,createdAt,updatedAt';
        if($scope.collections) params.collections = $scope.collections;
        if($scope.collectionsOrderBy) params.collectionsOrderBy = $scope.collectionsOrderBy;
		$scope.entity = $scope.Entity.get(params, function(entity) {
			$scope.entity = entity;
            if (typeof $scope.loadCallback == 'function') { $scope.loadCallback(entity); }
		});
	}else{
		$scope.entity = new $scope.Entity();
	}

	//edit
	$scope.edit = function() {
		$location.path($scope.entityUrl + '/edit/' + $scope.entity.attributes.id);
	};

	//done
	$scope.done = function() {
		$location.path($scope.entityUrl + '/');
	};
};