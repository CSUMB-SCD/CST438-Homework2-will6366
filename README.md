## Christopher Williams
## CST438 Homework 2: Twitter+Getty API App

## Theme:
* The theme I selected for my dynamic display is gaming. 
    * The images are generic "gaming" pictures selected by a "most popular" filter
    * The twitter messages are filtered based on a "twitch" query. Twitch is a live streaming video platform popularly used for gamers. 
    
## Principles:
* Oauth2
   * Twitter: application-only (we have the authorization code: consumer key & consumer secret). We exchange our authorization code
   for a access/bearer token which is then used for the Twitter Api call.
   * Getty Images: application-only. Access token (api-key) provided. 
* Server Requests
   * Built/Modified HTTP request messages:
      * Included application specific headers
      * specified connection for HTTPS (port 443)
      * Method: POST (for getting bearer token) and GET (for api calls)
      * Message Body
    
## Known Issues:
   * Occasionally a completely black image will be generated.
   * With the filters being based on popularity, there is occasional repitition. Usually only the same quote OR image in a row.
    
    
## Improvements:
   * Perhaps design the homework with more function (ex. the user can input query terms or append a url id)
