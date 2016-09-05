'use strict';

angular.module('vlui')
  .directive('vlPlotGroupList', function (vl, cql, jQuery, consts, _, Logger, Pills, Chart, $timeout) {
    return {
      templateUrl: 'components/vlplotgrouplist/vlplotgrouplist.html',
      restrict: 'E',
      replace: true,
      scope: {
        /** An instance of specQueryModelGroup */
        enablePillsPreview: '<',
        initialLimit: '<',
        listTitle: '<',
        hideListTitle: '<',
        charts: '<',
        priority: '<',
        showMore: '<',
        postSelectAction: '&',
        showQuerySelect: '<',
        query: '='
      },
      link: function postLink(scope /*, element, attrs*/) {
        scope.consts = consts;
        scope.limit = scope.initialLimit || 4;

        // Functions
        scope.getChart = Chart.getChart;
        scope.increaseLimit = increaseLimit;
        scope.isInlist = isInList;
        scope.Pills = Pills;

        scope.select = function() {
          Logger.logInteraction(Logger.actions.QUERY_SELECT, cql.query.shorthand.spec(scope.query), {
            list: scope.listTitle
          });
          Pills.selectQuery(scope.query);

          // scroll to top if parent action is provided.
          if (scope.postSelectAction) {
            scope.postSelectAction();
          }
        };

        var previewPromise = null;

        scope.enablePreview = function() {
          previewPromise = $timeout(function() {
            Pills.previewQuery(true, scope.query, scope.listTitle);
          }, 500);

        };

        scope.disablePreview = function() {
          if (previewPromise) {
            $timeout.cancel(previewPromise);
          }
          previewPromise = null;

          Pills.previewQuery(false, scope.query, scope.listTitle);
        };

        // element.bind('scroll', function(){
        //    if(jQuery(this).scrollTop() + jQuery(this).innerHeight() >= jQuery(this)[0].scrollHeight){
        //     if (scope.limit < scope.modelGroup.charts.length) {
        //       scope.increaseLimit();
        //     }
        //    }
        // });

        function increaseLimit() {
          scope.limit += 4;
          Logger.logInteraction(Logger.actions.LOAD_MORE, scope.limit, {
            list: scope.listTitle
          });
        }

        /** return if the plot is still in the view, so it might be omitted from the render queue if necessary. */
        function isInList(chart) {
          for (var i = 0; i < scope.charts.length; i++) {
            if(chart.shorthand === scope.charts[i].shorthand) {
              return true;
            }
          }
          return false;
        }
      }
    };
  });
