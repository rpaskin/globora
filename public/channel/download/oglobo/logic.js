function trackingTypeToAnalyticsType(trackingState)
{
  var result = 'UNKOWN['+trackingState+']';
  switch (trackingState)
  {
    case arel.Tracking.MARKERLESS_3D:
      result = arel.Plugin.Analytics.Category.TYPE_ML3D;
      break;
    case arel.Tracking.MARKERLESS_2D:
      result = arel.Plugin.Analytics.Category.TYPE_ML2D;
      break;
    case arel.Tracking.BARCODE_QR:
      result  = arel.Plugin.Analytics.Category.TYPE_CODE;
      break;
    case arel.Tracking.MARKER:
      result = arel.Plugin.Analytics.Category.TYPE_MARKER;
      break;
  }
  return result;
}
function _GET(key)
{
  var getParameterString = window.location.search.substring(1);
  var getParameters = getParameterString.split('&');
  for (var i in getParameters)
  {
    var keyValuePair = getParameters[i].split('=');
    if (keyValuePair[0] == key)
    {
      return keyValuePair[1];
    }
  }
  return undefined;
}
isAndroid = _GET('device') == 'android';
function openYouTubeVideo(youTubeLink,name)
{
  var isUIWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
  arel.Media.openWebsite(youTubeLink, !isUIWebView);
  googleAnalytics.logYouTubeVideo(encodeURIComponent(name));
}
ACCOUNT_ID = google_analytics_id;
googleAnalytics =  new arel.Plugin.Analytics (ACCOUNT_ID, arel.Plugin.Analytics.EventSampling.ONCE, 'OGlobo');
arel.sceneReady(function()
{
  arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
  arel.Scene.getTrackingValues(function(param){trackingHandler('dummy', param);});
  var sceneObjects = arel.Scene.getObjects();
  for (var i in sceneObjects)
  {
    arel.Events.setListener(sceneObjects[i], handleObjectCallbacks);
  }
  
  googleAnalytics.logSceneReady();
});

function trackingHandler(type, param)
{
  try
  {
    if (!type || !param[0]) return;
    var cosId = param[0].getCoordinateSystemID();
    var cosName = param[0].getCoordinateSystemName();
    var state = param[0].getState();
    var trackingMethod  = param[0].getType();
    if (2 == cosId)
    {
      switch(state)
      {
        case arel.Tracking.STATE_TRACKING:
          arel.Scene.getObject('7dc16649eac2eea844a86d241e514bcf').startMovieTexture(true);
          arel.Scene.getObject('7dc16649eac2eea844a86d241e514bcf').isStarted = true;
          googleAnalytics.logVideo('anima1');;
          break;
        case arel.Tracking.STATE_NOTTRACKING:
          arel.Scene.getObject('7dc16649eac2eea844a86d241e514bcf').pauseMovieTexture();
          arel.Scene.getObject('7dc16649eac2eea844a86d241e514bcf').isStarted = false;
          break;
      }
    }
    if (1 == cosId)
    {
      switch(state)
      {
        case arel.Tracking.STATE_TRACKING:
          arel.Scene.getObject('0e42e41cdf80d8940d2a592da6c6ed0c').startMovieTexture(true);
          arel.Scene.getObject('0e42e41cdf80d8940d2a592da6c6ed0c').isStarted = true;
          googleAnalytics.logVideo('maracanaGlobo');;
          break;
        case arel.Tracking.STATE_NOTTRACKING:
          arel.Scene.getObject('0e42e41cdf80d8940d2a592da6c6ed0c').pauseMovieTexture();
          arel.Scene.getObject('0e42e41cdf80d8940d2a592da6c6ed0c').isStarted = false;
          break;
      }
    }
    var gaTrackingMethod = trackingTypeToAnalyticsType(trackingMethod);
    googleAnalytics.logTrackingEvent(gaTrackingMethod, arel.Plugin.Analytics.Action.STATE_TRACKING, cosId, cosName);
  }
  catch(e)
  {
    alert(e.message);
  }
}
function handleObjectCallbacks(obj, type, params)
{
  try
  {
    var objectId = obj.getID();
    if (arel.Events.Object.ONTOUCHSTARTED == type)
    {
      googleAnalytics.logUIInteraction(arel.Plugin.Analytics.Action.TOUCHSTARTED, objectId)
    }
    else if (arel.Events.Object.TOUCHENDED == type)
    {
      googleAnalytics.logUIInteraction(arel.Plugin.Analytics.Action.TOUCHENDED, objectId)
    }
    
  }
  catch(e)
  {
    alert(e.message);
  }
}
function handleMediaCallbacks(eventType, mediaURL)
{
  try
  {
    arel.Events.removeListener(mediaURL);
  }
  catch(e)
  {
    alert(e.message);
  }
}
