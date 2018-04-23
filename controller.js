angular.module('knowGod', ['ngRoute'])
  .config( function ($locationProvider, $httpProvider, $qProvider, $routeProvider) {
    $locationProvider.html5Mode(true).hashPrefix('');
    $httpProvider.useApplyAsync(true);

/*    $routeProvider
      .when('/en', {
        title: 'KnowGod.com'
      })*/
      

  })
  .factory('page', function ($http, $q) {
    var service = {};
    var baseUrl = 'http://0.0.0.0:8000/knowGodResource/';
    var _url = '';
    var _finalUrl = '';

    var makeUrl = function () {
      _finalUrl = baseUrl + _url;
      return _finalUrl;
    }

    service.setUrl = function (url) {
      _url = url;
    }

    service.getUrl = function () {
      return _url;
    }

    service.loadPage = function () {
      makeUrl();
      var deferred = $q.defer();
      $http.get(_finalUrl, 
      {
        transformResponse: function (cnv) {
          var x2js = new X2JS();
          var aftCnv = x2js.xml_str2json(cnv);
          return aftCnv;
        }
      })
      .then(function(data) {
        deferred.resolve(data);
      })
      return deferred.promise;
    }
    return service;
  })
  .factory('manifest', function ($http, $q, $window) {
    var service = {};
    var baseUrl = 'http://0.0.0.0:8000/knowGodResource/';
    var _url = '392380f776ebdffe4a0fd286e522d5cad5930f0b14db0554debf409bc7218c3a.xml';
    var _finalUrl = '';
    var _manifest = '';

    var makeUrl = function () {
      _finalUrl = baseUrl + _url;
      return _finalUrl;
    }

    service.setUrl = function (url) {
      _url = url;
    }

    service.getUrl = function () {
      return _url;
    }

    service.loadManifest = function () {
      makeUrl();
      var deferred = $q.defer();
      $http.get(_finalUrl/*, 
      {
        transformResponse: function (cnv) {
          var x2js = new X2JS();
          var aftCnv = x2js.xml_str2json(cnv);
          return aftCnv;
        }
      }*/)
      .then(function(data) {
        deferred.resolve(data);
        _manifest = $(data.data);
      })
      return deferred.promise;
    }

    service.lookup = function (filename) {
      var src = _manifest.find("[filename=\""+filename+"\"]").attr("src");
      return baseUrl+src;
    }
    service.percent = function () {
      return _manifest.find('page').length;
    }
    return service;
  })
  .controller('KnowGodController', function($scope, $http, $window, page, manifest) {
    var knowGod = this;

    manifest.loadManifest().then(function(data){
      knowGod.manifest = manifest;
    })

//    page.setUrl('743fa53e8470cd67e1ca12ea05fbd4bd64dea08b7326691cbd888b107a2836ce.xml');
    page.setUrl('f1165b62b93e61461f64446b3198c3a9245c9f784c1fcf25efa7fd71b85e21f0.xml');
//    page.setUrl('908a4c4c092d97db3f3c7b59a3fdb03ecf4da204bfd3f283568b7a2614635ee4.xml');
//    page.setUrl('90feba69d384d8d99f67f7ad024797577c3ca46be73a3c0f7928b63fc316669e.xml');
    knowGod.loadPage = function () {
      page.loadPage()
        .then(function (data) {
          knowGod.page = data.data.page;
        }, function (data) {
        })
    }
    knowGod.loadPage();


    var languages = function() {
      var url = 'https://mobile-content-api.cru.org/languages/';
      $http.get(url).then(function(response){
        knowGod.languages = response.data;
      });
    }
    languages();

    var translations = function(language) {
  //    var url = 'https://mobile-content-api.cru.org/languages/'+language+'?include=custom_pages'  ;
      var url = 'https://mobile-content-api.cru.org/translations';
      $http.get(url).then(function(response){
        knowGod.translations = response.data;
      });      
    };
    translations(1);

  });



function getGoogle(url){
  return $http.get(url, {
    cache: true
  });
}

