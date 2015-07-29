// Custom version of https://github.com/iameugenejo/ngScrollTo
angular.module('nib.scrollTo', [])
    .directive('nibScrollTo', ['scrollTo', function(scrollTo){
      return {
        restrict : "A",
        compile : function(){
          return function(scope, element, attr) {
            element.bind("click", function(){
              //Check the if condition, break if false
              if(attr.nibScrollToIf && !scope.$eval(attr.nibScrollToIf)){
                return;
              }
              scrollTo.element(attr.nibScrollTo, attr.offset);
            });
          };
        }
      };
    }])
    .service('scrollTo', ['$window', 'ngScrollTo', function($window, ngScrollTo) {

      this.element = function (querySelector, offset) {//find element with the given id or name and scroll to the first element it finds

        if(!querySelector) {//move to top if a selector is not provided
          return ngScrollTo('body');
        }

        // check if an element can be found with the selector
        var el = $window.document.querySelector(querySelector);
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
            ngScrollTo(el, offset);
          }

        }

        //otherwise, ignore
      }

    }])
    .factory("ngScrollTo", ['$timeout', function($timeout) {
      return function(el, scrollOffset, duration){
        // set a timeout so that digest cycle can run before attempting to scroll
        $timeout(function(){
          duration = duration || 600;
          scrollOffset = scrollOffset == null ? 0 : scrollOffset;
          el = el.nodeName ? el : document.querySelector(el);
          if(el){
            var easing = function(n){
              n *= 2;
              if (n < 1) return 0.5 * n * n;
              return - 0.5 * (--n * (n - 2) - 1);
            };
            var stop = false;
            var start = Date.now();
            var html = document.getElementsByTagName('html')[0];
            var fromY = document.body.scrollTop || html.scrollTop;
            var toY = fromY + el.getBoundingClientRect().top + scrollOffset;

            var updatePosition = function(){
              var now = Date.now();
              if (now - start >= duration) stop = true;
              var p = (now - start) / duration;
              var tick = Math.round(fromY + (toY - fromY) * easing(p));
              document.body.scrollTop = tick;
              html.scrollTop = tick;
              $timeout(function() {
                if(stop) return;
                updatePosition();
              }, 10);
            };
            updatePosition();
          }
        }, 10);
      }
    }]);
	
	if(module && module.exports){
		module.exports = 'nib.scrollTo';
	}
