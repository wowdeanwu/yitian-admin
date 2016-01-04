'use strict';

angular.module('ytcSystemApp', [
		'ng-admin'
	])
	.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
        var nga = NgAdminConfigurationProvider;
        // create an admin application
        var admin = nga.application('我是Dome').baseApiUrl('http://localhost:9000/api/');
        
        var configs = nga.entity('configs').identifier(nga.field('CONFIG_ID'));
        //显示Config List
        configs.listView().fields([
        	nga.field('MODULE'),
        	nga.field('CONFIG_KEY').isDetailLink(true),
        	nga.field('CONFIG_VALUE')
        ]);
        //添加创建配置项
        configs.creationView().fields([
        	nga.field('MODULE'),
        	nga.field('CONFIG_KEY'),
        	nga.field('CONFIG_VALUE'),
        	nga.field('NAME'),
        	nga.field('DESCRIPTION')
        ]);
        //添加更新配置项
        configs.editionView().fields(configs.creationView().fields());

        admin.addEntity(configs);
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