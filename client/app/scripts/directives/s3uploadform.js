angular.module('directives.s3uploadform', [])
  .directive('s3uploadform', function ($timeout, $route, APP_CONFIG, s3uploadservice, $http, Projects, httpRequestTracker) {
    "use strict";

    return {
      templateUrl: 'directives/s3uploadform.tpl.html',
      restrict: 'A',
      replace: true,

      scope: {
        onuploadcomplete: "&",
        onuploadstart: "&",
        onuploadcancel: "&",
        filetype: "@"
      },

      link: function (scope, elem, attrs) {
        var projectid = Projects.getResolvedCurrentProject()._id,
          uploader,
          updateProgressPercentage,
          getFileSizeInAllBrowsers,
          s3config,
          s4,
          guid,
          handleUploadError;

        s3config = {
          request: {
            endpoint: "https://" + APP_CONFIG.AmazonS3Config.bucket + '.s3.amazonaws.com/',
            accessKey: APP_CONFIG.AmazonS3Config.accesskey
          },
          signature: {
            endpoint: APP_CONFIG.APIUrl + 's3/s3handler/'
          },
          iframeSupport: {
            localBlankPagePath: '/static/ieuploadsuccess.html'
          }
        };

        scope.s3uploadservice = s3uploadservice[scope.filetype];

        /*
         generate uuid
         */
        s4 = function () {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        };

        guid = function () {
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        };

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
        function encodeRFC5987ValueChars(str) {
          return encodeURIComponent(str).
            // Note that although RFC3986 reserves "!", RFC5987 does not, so we do not need to escape it
            replace(/['()]/g, escape). // i.e., %27 %28 %29
            replace(/\*/g, '%2A').
            // The following are not required for percent-encoding per RFC5987, so we can allow for a little better readability over the wire: |`^
            replace(/%(?:7C|60|5E)/g, unescape);
        }

        handleUploadError = function () {
          scope.uploadinprogress = false;
          scope.uploadsaving = false;
          scope.uploadcompleted = false;
          scope.uploaderror = true;
        };

        updateProgressPercentage = function (percentage) {
          $timeout(function () {
            scope.progresscss = {'width': percentage.toString() + '%'};
            scope.uploadprogressmessage = percentage.toString() + "%";
          });
        };

        getFileSizeInAllBrowsers = function (filesize) {
          var returnfilesize = "3000000"; // 3MB in Bytes for IE8/9 and Opera12;
          if (filesize) {
            returnfilesize = filesize;
          }
          return returnfilesize;
        };

        uploader = new qq.s3.FineUploaderBasic({
          debug: false,
          element: elem[0].querySelector('.s3fineuploader'),
          button: elem[0].querySelector('.button_fileinput'),
          request: {
            endpoint: s3config.request.endpoint,
            accessKey: s3config.request.accessKey
          },
          //  do not force upload via cors - breaks IE8/9 upload due to auth failure on server
          cors: {
            expected: true,
            allowXdr: true,
            sendCredentials: true
          },
          signature: {
            endpoint: s3config.signature.endpoint
          },
          iframeSupport: {
            localBlankPagePath: s3config.iframeSupport.localBlankPagePath
          },
          classes: {
            success: 'alert alert-success',
            fail: 'alert alert-error'
          },
          objectProperties: {
            key: function () {
              var uuid = guid();
              return projectid + "/" + uuid;
            }
          },
          validation: {
            itemLimit: 1,
            sizeLimit: 1073741824 // 1GB = 1024 * 1024 * 1024 bytes
//            allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
          },
          callbacks: {
            onSubmit: function (id, fileName) {
              var contentDisposition = "attachment; filename*=UTF-8''" + encodeRFC5987ValueChars(fileName);

              uploader.setParams({
                "Content-Disposition": contentDisposition,
                "filesize": getFileSizeInAllBrowsers(uploader.getSize(id))
              }, id);
            },
            onUpload: function (id, fileName) {
              updateProgressPercentage(0);
              $timeout(function () {
                scope.uploadinprogress = true;
                scope.uploadsaving = false;
                scope.uploadcompleted = false;
                scope.uploaderror = false;
                scope.s3uploadservice.filename = fileName;
                scope.s3uploadservice.uploadrunning = true;
              });
              httpRequestTracker.addPendingRequest();
            },
            onProgress: function (id, fileName, loaded, total) {
              var percentage = Math.floor((loaded / total) * 100);
              updateProgressPercentage(percentage);

              if (percentage === 100) {
                scope.uploadsaving = true;
              }
            },
            onComplete: function (uploadedfileid, fileName, responseJSON, xhr) {
              var uploadedobjectkey,
                filesize;
              uploadedobjectkey = uploader.getKey(uploadedfileid);
              filesize = getFileSizeInAllBrowsers(uploader.getSize(uploadedfileid));

              httpRequestTracker.removePendingRequest();

              if (responseJSON.success) {
                $timeout(function () {
                  scope.uploadinprogress = false;
                  scope.uploadsaving = false;
                  scope.uploadcompleted = true;

                  scope.s3uploadservice.uploadcompleted = true;
                  scope.s3uploadservice.uploadrunning = false;
                  scope.s3uploadservice.filename = fileName;
                  scope.s3uploadservice.filesize = filesize; // in bytes
                  scope.s3uploadservice.key = uploadedobjectkey;
                });

              } else {
                // handle upload error
                handleUploadError();
              }
            },
            onError: function (id, name, reason, xhr) {
              handleUploadError();
            }
          }
        });

        new qq.DragAndDrop({
          dropZoneElements: [elem[0].querySelector('.dropzone')],
          allowMultipleItems: true,
          classes: {
            dropActive: "dragover"
          },
          callbacks: {
            processingDroppedFiles: function () {
            },
            processingDroppedFilesComplete: function (files) {
              // allow only one file to be uploaded
              // allowMultipleItems option is useless to implement this correctly
              if (files.length < 2) {
                // first cancel any running upload
                scope.cancel();
                //this submits the dropped files to Fine Uploader
                uploader.addFiles(files);
              } else {
                alert("Es kann nur eine Datei hochgeladen werden.");
              }
            },
            dropError: function (err) {
              // does not work correctly - still processes first file in dropped files array
              if (err === "tooManyFilesError") {
                alert("Es kann nur eine Datei hochgeladen werden.");
              }
            }
          }
        });

        scope.cancel = function () {
          scope.uploadinprogress = false;
          scope.uploadsaving = false;
          scope.uploadcompleted = false;
          scope.uploaderror = false;
          uploader.reset();
          httpRequestTracker.removePendingRequest();
          scope.s3uploadservice.reset();
        };

        //listen to $destroy event of directive and cancel upload
        scope.$on('$destroy', function () {
          scope.cancel();
        });

      }//link()
    };

  });