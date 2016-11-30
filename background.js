(function() {
console.log('hello');

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    
     
	gwUrl = message.url + '/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/' ;
	console.log(gwUrl);
	var xsrftoken;
	_this = this;
// Get XSRF Token and check is system is reachable	
	$.ajax({    async: true,  
			    url: gwUrl ,
                type: "GET"	,
				context: _this ,
				beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-Token', 'Fetch');},
				success: function(res, status, xhr) {
					console.log("response: ");					
					console.log(res);
					
					console.log("status: ");					
					console.log(status);
					
					
					console.log("XHR: ");					
					console.log(xhr);
					
					console.log("Response Headers: XSRF Token ");
					console.log(xhr.getResponseHeader('X-CSRF-Token'));
					
					this.xsrftoken = xhr.getResponseHeader('X-CSRF-Token') ;
					 //Use Promise
					 postData2GW();
				},
				error: function(err) {
					console.log(err);
				}
				}) ;
				
				
	
	
	function postData2GW(){
		
		if ( this.xsrftoken.length == 0)	 { console.log("XSRF Token fetch failed"); }
	
//Make the JSON RPC call
    gwUrl = message.url + '/sap/gw/jsonrpc' ;
	console.log( gwUrl);
		 _this = this; 
		 var oData = {jsonrpc: "2.0", method: "RFC.bapi_user_get_detail", id: 1 , params: {USERNAME: "MALLIKA"}};
		 $.ajax({    async: true,  
			    url: gwUrl ,
                type: "POST"	,
				context: _this,
				data : "{\"jsonrpc\": \"2.0\", \"method\": \"RFC.bapi_user_get_detail\", \"id\": \"1\" , \"params\": {\"USERNAME\": \"MALLIKA\"}}"  ,
				beforeSend: function(xhr){
					xhr.setRequestHeader('X-CSRF-Token',  this.xsrftoken );
					xhr.setRequestHeader('Content-Type','application/json');
					},
				success: function(res, status, xhr) {
					console.log("response: ");					
					console.log(res);
					
					console.log("status: ");					
					console.log(status);
					
					
					console.log("XHR: ");					
					console.log(xhr);
					
					//If no error then test case created Successfuly!!

				},
				error: function(err) {
					console.log(err);
				}
				}) ;

		
	}
	
   
	
    return true;
});

})();