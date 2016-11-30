
(function() {
    
	function initEvents() {
	
		addEvt('clearBtn', 'click', resetList);
		addEvt('gwBtn', 'click', pushtoGw );
		addEvt('gwDetect', 'click', detectGWSystem );

		
		chrome.devtools.network.onNavigated.addListener(resetList);
		chrome.devtools.network.onRequestFinished.addListener(requestFinished);
	}
    function addEvt(sel, evt, func) {
		document.getElementById(sel).addEventListener(evt, func);
	}
	function isUrl(url , filterGWOdata) {
		isUrl =  /^https?:\/\//i.test(url);
		isGWOdataUrl = true;
        return  ( isUrl && isGWOdataUrl );
		 
		}

	function resetList() {
		console.log('readlist');
		//reqList = [];
		var scope = angular.element('[ng-controller="mycontroller"]').scope();
		scope.clear();
		scope.$apply();
	}
   function detectGWSystem(){
	    var scope = angular.element('[ng-controller="mycontroller"]').scope();
		var urls = scope.urls;
		var gwSystem = [];//scope.gwSystem;
		var gwSystemAss = [];// Associative Array
		var sysaddr ;
		//in loop
		for (var x = 0; x < urls.length; x++) {
			sysaddr = scope.urls[x].URL.slice(0, scope.urls[x].URL.indexOf('/sap/opu/odata')) ;
			if ( gwSystemAss[ sysaddr ] == undefined ) {
				gwSystemAss[ sysaddr ] = sysaddr ;
				gwSystem.push( sysaddr );
			} 
			
		} 
		
		
			   if(gwSystem.length > 1)
		{
			console.log('multiple GW systems found, additional action needed');
			
		}	
		
		//Set the final GW system to Scope
		angular.element('[ng-controller="mycontroller"]').scope().gwSystem = gwSystem[0];
		return gwSystem[0];
		
   }
	
   function getGWSystem(){
	   
      var gwSystemUrl = detectGWSystem();
	  //Testing against G1Y system
	  gwSystemUrl = 'http://ldai1g1y.wdf.sap.corp:50056'; 
	  return gwSystemUrl ;
	   
   }	
   function   pushtoGw(){
	   debugger ;
	   var scope = angular.element('[ng-controller="mycontroller"]').scope();
	   console.log(scope.urls);
	   
	   chrome.extension.sendMessage({
            url:getGWSystem() ,
			request: scope.urls
        });
	      
   }
	
	
	function prepareTeseCase(){
		
		var scope = angular.element('[ng-controller="mycontroller"]').scope();
		var urls = scope.urls ;
		
	}
	
	
	function requestFinished(request){
	 			   
			    isUrl =  /^https?:\/\//i.test(request.request.url);
				if (isUrl)
				{   var odata = /sap\/opu\/odata/i;
					isGWOdataUrl =  odata.test(request.request.url);
					if (isGWOdataUrl != true)
						return;
					
				}
		        
				if ( isUrl && isGWOdataUrl )
			    {
			    console.log('Update List with new url');
				 var scope = angular.element('[ng-controller="mycontroller"]').scope();
				 scope.addNewRequest(request);
				 scope.$apply();
				
				return;
				}
			}
			
		
	window.addEventListener('load', initEvents);
})();

//Angular Controller
function mycontroller($scope){
	
	    $scope.counter= 1;
		$scope.urls = [];
		$scope.gwSystem = [];
		
		$scope.addNewRequest=function(request){
            $scope.urls.push({select : true, id: $scope.counter ,  URL : request.request.url , Method:request.request.method , reqHeader: request.request.headers , postdata:request.request.postData });
			$scope.counter = $scope.counter + 1;
        }
		
		$scope.clear=function(){
            $scope.urls= [];
			$scope.counter = 1;
        }
}		

$(function(){
     $(document).on('click', 'input:checkbox', function(){
       
		
		var liNode = this.parentNode;
		if(liNode && liNode.className === "uncheckedUrl"){
			liNode.className = "checkedUrl" ;
		}
		else if(liNode && liNode.className === "checkedUrl"){
			liNode.className = "uncheckedUrl" ;
		}
        
    })
});




$(document).ready(function() {
  
});