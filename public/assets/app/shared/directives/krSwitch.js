
    angular.module('karizma.shared')
    .directive('krSwitch', function($timeout) {
        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
               
            },
            link: function(scope, element, attr) {
                
               element.bootstrapSwitch({
                   state:scope.ngModel,
                   onColor:"danger",
                   offColor:"success",
                   onSwitchChange:switchChange
               });
               function switchChange(event,state){
                // scope.onSwitchChange({state:state});  
                  $timeout(function() {
                      scope.ngModel=state;
                  });
               }
              
            }
        };
    });