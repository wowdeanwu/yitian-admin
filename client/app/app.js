'use strict';

angular.module('yitianAdminApp', [
		'ng-admin'
	])
	.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
        var nga = NgAdminConfigurationProvider;
        // create an admin application
        var admin = nga.application('我是Dome').baseApiUrl('http://localhost:9000/api/');
        
        /*************************** 配置项 ***************************/
        var configs = nga.entity('configs').identifier(nga.field('CONFIG_ID'));
        //显示Config List
        configs.listView().fields([
        	nga.field('MODULE'),
        	nga.field('CONFIG_KEY').isDetailLink(true),
        	nga.field('CONFIG_VALUE')
        ]).filters([
            nga.field('module')
                .label('MODULE')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
        ]).exportFields([]);

        //添加创建配置项
        configs.creationView().fields([
        	nga.field('MODULE')
            .validation({required:true}),
        	nga.field('CONFIG_KEY')
            .validation({required:true}),
        	nga.field('CONFIG_VALUE')
            .validation({required:true}),
        	nga.field('NAME'),
        	nga.field('DESCRIPTION')
        ]);
        //添加更新配置项
        configs.editionView().fields(configs.creationView().fields());

        /*************************** Redis ***************************/
        var redis = nga.entity('redis').identifier(nga.field('key'));
        //显示redis List
        redis.listView().fields([
            nga.field('key').isDetailLink(true)
        ]).exportFields([])
        .listActions(['show','delete']);
        redis.deletionView();

        admin.addEntity(configs);
        admin.addEntity(redis);
        //admin.dashboard(nga.dashboard().addCollection(nga.collection()));
        // attach the admin application to the DOM and run it
        nga.configure(admin);
    }])
    .config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params._start = (params._page - 1) * params._perPage;
                params._end = params._page * params._perPage;
            }
            delete params._page;
            delete params._perPage;
            // custom sort params
            if (params._sortField) {
                params._sort = params._sortField;
                params._order = params._sortDir;
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);;