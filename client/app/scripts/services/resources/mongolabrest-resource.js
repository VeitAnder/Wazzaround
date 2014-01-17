angular.module('mongolabResource', [])
  .factory('mongolabResource', function (APP_CONFIG, $http, $q) {
    "use strict";

    function RestResourceFactory(resourceName) {

      var url = APP_CONFIG.APIUrl + resourceName;

      var defaultParams = {};

      var Resource = function (data) {
        if (data) {
          angular.extend(this, data);
        }
      };

      Resource.thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
        var scb = successcb || angular.noop;
        var ecb = errorcb || angular.noop;

        return httpPromise.then(function (response) {

          //@TODO check all possible response state codes
          if (response.status === 200 || response.status === 201 || response.status === 304) {
            //success code
            var result;
            if (isArray) {
              result = [];
              for (var i = 0; i < response.data.length; i++) {
                result.push(new Resource(response.data[i]));
              }

            } else {
              //@TODO item not found error via API
              //MongoLab has rather peculiar way of reporting not-found items, I would expect 404 HTTP response status...
              if (response.data === " null ") {
                return $q.reject({
                  code: 'resource.notfound',
                  collection: resourceName
                });
              } else {
                result = new Resource(response.data);
              }
            }

            scb(result, response.status, response.headers, response.config);
            return result;

          } else {
            ecb(undefined, response.status, response.headers, response.config);
            return $q.reject({
              code: response.status,
              collection: resourceName
            });
          }
        }, function (response) {
          ecb(undefined, response.status, response.headers, response.config);
          return $q.reject({
            code: response.status,
            collection: resourceName
          });

        });
      };

      Resource.getUrl = function () {
        return url;
      };

      Resource.all = function (cb, errorcb) {
        return Resource.query({ }, cb, errorcb);
      };

      Resource.query = function (queryJson, successcb, errorcb) {
        var httpPromise = $http.get(url, {"params": queryJson});
        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb, true);
      };

      // works against rest - tested.
      Resource.getById = function (id, successcb, errorcb) {
        var httpPromise = $http.get(url + "/" + id + "/", {params: defaultParams});
        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
      };

      // works against rest - tested.
      Resource.getByIdWithQueryParams = function (id, params, successcb, errorcb) {
        var httpPromise = $http.get(url + "/" + id + "/", {params: params});
        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
      };

      //to be tested
      Resource.getByIds = function (ids, successcb, errorcb) {
        var qin = [];
        angular.forEach(ids, function (id) {
          qin.push({$oid: id});
        });
        return Resource.query({_id: {$in: qin}}, successcb, errorcb);
      };

      //instance methods
      Resource.prototype.getUrl = function () {
        return url;
      };

      Resource.prototype.$id = function () {
        if (this._id) {
          return this._id;
        }
      };

      Resource.prototype.$save = function (successcb, errorcb) {
        var httpPromise = $http.post(url + "/", this, {params: defaultParams});
        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
      };

      Resource.prototype.$update = function (successcb, errorcb) {
        var httpPromise = $http.put(url + "/" + this.$id() + "/", angular.extend({}, this, {_id: undefined}), {params: defaultParams});
        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
      };

//    Resource.prototype.$remove = function (successcb, errorcb) {
//      var httpPromise = $http['delete'](url + "/" + this.$id() + "/", {params: defaultParams});
//      return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
//    };

      return Resource;
    }

    return RestResourceFactory;
  });
