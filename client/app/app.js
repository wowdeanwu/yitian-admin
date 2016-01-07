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
        redis.showView().fields([
			nga.field('key'),
			nga.field('value')
		]);

        /*************************** 分享信息 ***************************/
        var shareinfos = nga.entity('shareinfos').identifier(nga.field('SHARE_INFO_ID'));
        //显示分享信息
        shareinfos.listView().fields([
            nga.field('TITLE'),
            nga.field('DESCRIPTION'),
            nga.field('IMG_URL'),
            nga.field('LINK').map(function truncate(value) {
                if (!value) {
                    return '';
                }
                return value.length > 50 ? value.substr(0, 50) + '...' : value;
            })
            .cssClasses('hidden-xs'),
            nga.field('BUSINESS_TYPE').label('B_TYPE'),
            nga.field('STATUS'),
            nga.field('COMMENT')
        ]).exportFields([]).listActions(['edit']);;

        //添加分享信息
        shareinfos.creationView().fields([
            nga.field('TITLE') .validation({required:true}),
            nga.field('DESCRIPTION') .validation({required:true}),
            nga.field('IMG_URL') .validation({required:true}),
            nga.field('LINK') .validation({required:true}),
            nga.field('BUSINESS_TYPE') .validation({required:true}),
            nga.field('STATUS') .validation({required:true}),
            nga.field('COMMENT')
        ]);
        //添加更新分享信息
        shareinfos.editionView().fields(shareinfos.creationView().fields());

        admin.addEntity(configs);
        admin.addEntity(redis);
        admin.addEntity(shareinfos);

        admin.menu(nga.menu()
          .addChild(nga.menu(configs).title('配置项'))
          .addChild(nga.menu(redis))
          .addChild(nga.menu(shareinfos).title('分享信息'))
        );
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
