angular.module('services.exceptionHandler', ['services.i18nNotifications'])
  .factory('exceptionHandlerFactory', function ($injector) {
    "use strict";

    return function ($delegate) {

      return function (exception, cause) {
        // Lazy load notifications to get around circular dependency
        //Circular dependency: $rootScope <- notifications <- i18nNotifications <- $exceptionHandler
        var i18nNotifications = $injector.get('i18nNotifications');

        // Pass through to original handler
        $delegate(exception, cause);

        // Push a notification error
        i18nNotifications.pushForCurrentRoute('error.fatal', 'error', {}, {
          exception: exception,
          cause: cause
        });
      };
    };
  });

angular.module('services.exceptionHandler')
  .config(function ($provide) {
    "use strict";

    $provide.decorator('$exceptionHandler', function ($delegate, exceptionHandlerFactory) {
      return exceptionHandlerFactory($delegate);
    });
  });
