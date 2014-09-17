angular.module('dateParserDirective', ['dateParser'])
    .directive('dateParser', ['dateFilter', '$dateParser', function(dateFilter, $dateParser) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var dateFormat = attrs['ngDateParser'];
				
                // Using input[text] doesn't set the parsername
                // Setting it to "date" ensures the display of the correct error message
                ngModel.$$parserName = "date";

                // If a new format is provided, update the view by rendering the model again.
                attrs.$observe('dateParser', function(value) {
					if (dateFormat !== value) {
						dateFormat = value;
						// Leave the actual rendering to other directives. Angular provides these by default for <input>, <textarea> and <select>
						if (angular.isFunction(ngModel.$render))
							ngModel.$render();
					}
                });

                // Parse the input value to a date
                ngModel.$parsers.push(function(viewValue) {
					var date = null;
					if (viewValue !== '') {
						date = $dateParser(viewValue, dateFormat);

						if (isNaN(date)) {
                            // patching timezone offset...
                            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
						}
                    }

                    return date;
                });

                // Format the new model value before it is displayed in the editor
                ngModel.$formatters.push(function(modelValue) {
                    return modelValue ? dateFilter(modelValue, dateFormat) : '';
                });
            }
        };
    }]);