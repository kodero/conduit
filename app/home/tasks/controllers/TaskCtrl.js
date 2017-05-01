'use strict'

angular.module('app').controller('MyTaskCtrl', function(){
	var vm = this;
	vm.title = 'My Tasks';
	vm.tasks = [
		{title : 'Run pension payroll', deadline : 'today'},
		{title : 'Run contribution receivables', deadline : 'tomorrow'}
	]
})

angular.module('app').controller('AllTaskCtrl', function(){
	var vm = this;
	vm.title = 'All Tasks';
	vm.tasks = [
		{title : 'Run pension payroll', deadline : 'today'},
		{title : 'Run contribution receivables', deadline : 'tomorrow'},
		{title : 'Post payment file', deadline : 'today'},
		{title : 'Give goons tea', deadline : 'today'},
		{title : 'Prepare proposal to company', deadline : 'tomorrow'}
	]
})