(function($){
	$.fn.relClone = function(options, callback) {
		var settings = jQuery.extend({
			excludeSelector: "",
			emptySelector: "",
			copyClass: "copy",
			chosen: true,
			table: false,
			append: '',
			clearInputs: true,
			limit: 0,
			nameIndex: true
		}, options);

		settings.limit = parseInt(settings.limit);

		this.each(function() {
			$(this).click(function() {
				var rel     = $(this).attr('rel');
				var counter = $(rel + ':last').data('item') + 1;

				if(settings.limit != 0 && $(rel).length >= settings.limit){
					return false;
				};

				var master = $(rel + ":first");
				var parent = $(master).parent();
				var clone  = $(master).clone().addClass(settings.copyClass + counter).append(settings.append);

				if(settings.excludeSelector) {
					$(clone).find(settings.excludeSelector).remove();
				};

				if(settings.emptySelector) {
					$(clone).find(settings.emptySelector).empty();
				};

				if($(clone).attr('id')) {
					var newid = new String($(clone).attr('id')),
					    index = newid.indexOf('_');

					newid = newid.slice(0, index) + '_' + counter;

					$(clone).attr('id', newid);
				};

				$(clone).find('[id]').each(function() {
					var newid = $(this).attr('id') + counter;

					$(this).attr('id', newid);
				});

				if(settings.clearInputs) {
					var inputName = null,
					          reg = /\[[0-9]\]/gi;

					$(clone).find(':input').each(function() {
						var type = $(this).attr('type');
						switch(type){
							case"button":
								break;
							case"reset":
								break;
							case"submit":
								break;
							case"checkbox":
								$(this).attr('checked', '');
								break;
							default:
								$(this).val("");
								if (settings.nameIndex) {
									inputName = new String($(this).attr('name'));
									inputName = inputName.replace(reg, '[' + counter + ']');

									$(this).attr('name', inputName);
								} else {
									$(this).attr('name', $(this).attr('name') + '_' + counter);
								}
						}
					});
				};

				if (settings.table) {
					$(clone).find('table tbody tr').remove();
				}

				$(clone).attr('data-item', counter);
				$(parent).find(rel + ':last').after(clone);

				if (settings.chosen) {
					$(".chzn-select").removeClass("chzn-done").removeAttr("id").css("display", "block").next().remove();
					$(".chzn-select").chosen();
				}

				if ($.isFunction(callback)) {
					callback(clone.attr('id'), $('#'+clone.attr('id')));
				} else {
					return true;
				}
			});
		});
	
		return false;
	};
})(jQuery);