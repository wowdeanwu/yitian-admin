export default function(nga, admin) {
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
		.validation({
			required: true
		}),
		nga.field('CONFIG_KEY')
		.validation({
			required: true
		}),
		nga.field('CONFIG_VALUE')
		.validation({
			required: true
		}),
		nga.field('NAME'),
		nga.field('DESCRIPTION')
	]);
	//添加更新配置项
	configs.editionView().fields(configs.creationView().fields());

	return configs;
}