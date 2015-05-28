// Version 0.0.5
// AngularJS simple hash-tag scroll alternative
// this directive uses click event to scroll to the target element
//
// <div ng-app="app">
//   <div ng-controller="myCtrl">
//     <a scroll-to="section1">Section 1</a>
//   </div>
//   ...
//   <div id="section1">
//      <h2>Section1</h2>
//      <a scroll-to="">Back to Top</a>
//   </div>
//  ...
//   <div id="section1">
//      <h2>Section1</h2>
//      <a scroll-to="section1" offset="60">Section 1 with 60px offset</a>
//   </div>
// </div>

angular.module('ngScrollTo', [])
    .directive('scrollTo', ['scrollToService', function(scrollToService){
      return {
        restrict : "A",
        compile : function(){
          return function(scope, element, attr) {
            element.bind("click", function(){
              //Check the if condition, break if false
              if(attr.scrollToIf && !scope.$eval(attr.scrollToIf)){
                return;
              }
              scrollToService.element(attr.scrollTo, attr.offset);
            });
          };
        }
      };
    }])
    .service('scrollToService', ['$window', 'ngScrollToOptions', function($window, ngScrollToOptions) {

      this.element = function (querySelector, offset, focus) {//find element with the given id or name and scroll to the first element it finds

        if(!querySelector) {//move to top if a selector is not provided
          $window.scrollTo(0, 0);
        }

        if(focus === undefined) { //set default action to focus element
          focus = true;
        }

        // check if an element can be found with the selector
        var el = $(querySelector);
        if(el && el.length)
          el = el[0];
        else
          el = null;

        if(el) { //if an element is found and not in viewport, scroll to the element
          // check if element is in view
          var rect = el.getBoundingClientRect();
          var inViewPort = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= ($window.innerHeight || $window.document.documentElement.clientHeight) && /*or $(window).height() */
          rect.right <= ($window.innerWidth || $window.document.documentElement.clientWidth) /*or $(window).width() */
          );
          if (!inViewPort) {
            if (focus) {
              el.focus();
            }

            ngScrollToOptions.handler(el, offset);
          }

        }

        //otherwise, ignore
      }

    }])
    .provider("ngScrollToOptions", function() {
      this.options = {
        handler : function(el, offset) {
          if (offset) {
            var top = $(el).offset().top - offset;
            window.scrollTo(0, top);
          }
          else {
            el.scrollIntoView();
          }
        }
      };
      this.$get = function() {
        return this.options;
      };
      this.extend = function(options) {
        this.options = angular.extend(this.options, options);
      };
    });

