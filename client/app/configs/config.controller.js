'use strict';

angular.module('ytcSystemApp')
	.controller('ConfigCtrl', function($scope,$http) {
		$scope.configGrid = {
			enableHorizontalScrollbar : 0,
			columnDefs: [{
				field: 'CONFIG_ID',
				displayName: 'ConfigID',
				width: 180
			},{
				field: 'MODULE',
				displayName: '模块',
				width: 120
			}, {
				field: 'CONFIG_KEY',
				displayName: '主键',
				width: 200
			}, {
				field: 'CONFIG_VALUE',
				displayName: '配置值',
				cellTooltip: true,
			}]
		};

		$http.get('/api/configs').success(function(data){
			$scope.configGrid.data = data;
		});
	});
