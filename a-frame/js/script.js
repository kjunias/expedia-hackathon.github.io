var currentLocationId;
var currentBackgroundIndex;
var previousLocationsId = [];
var allLocationsId = [];
var cachedLocationsData = {};
var currentRegion = "Global";

var locationCardName = $("#location-card-name");
// console.log(locationCardName);
var locationCardThumbnail = $("#location-card-thumbnail");
var locationCardInfoButton = $("#button-location-info");
var locationCardBookButton = $("#button-location-card-book");
var locationModalTitle = $("#modal-location-info-long-title");
var locationModalThumbnail = $("#modal-location-thumbnail");
var locationModalDescription = $("#modal-location-description");
var previousLocationButton = $("#button-previous-location");

var regionButton = $("#button-region");

var googleMap = $("#google-map")

var locationCardCountry = $("#location-card-country");
var locationModalCountry = $("#modal-location-country");
var locationModalDescriptionTitle = $("#modal-location-description-title");

var cardSummary = $("#card-summary");
console.log(cardSummary);


function getLocationsData(onSuccess, onError){
  fetch('json/locations.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    if(onSuccess!=null){
      onSuccess(json);
    }

  })
  .catch(error=>{
    if(onError!=null){
      onError(error);
    }
  });
}

function getRandomLocation(){

  let locationIndex = Math.floor(Math.random() * allLocationsId.length);
  return allLocationsId[locationIndex];
}

function getLocationData(locationId, onSuccess, onError){
  if(cachedLocationsData==null){
    if(onError!=null) onError(new Error("cachedLocationsData is null!"));
    return;
  }

  onSuccess(cachedLocationsData[locationId]);
}

function setCurrentLocation(newLocationId){

  currentLocationId = newLocationId;
  let locationData = cachedLocationsData[currentLocationId];

  locationCardName.css("display","inline");
  locationCardName.html(locationData.cityName);

  locationCardThumbnail.attr("src", locationData.thumbnail);
  locationCardInfoButton.removeClass("disabled");
  locationCardBookButton.removeClass("disabled");

  locationModalTitle.html(locationData.cityName);
  locationModalThumbnail.attr("src", locationData.thumbnail);
  locationModalDescription.html(locationData.description);

  locationCardCountry.html(locationData.country);
  locationModalCountry.html(locationData.country);
  locationModalDescriptionTitle.html(locationData.title);

  googleMap.attr("src",locationData.googleMapEmbedUrl);

  let newCardSummary = locationData.title.substring(0, locationData.title.length-1);

  cardSummary.contents().filter(function(){ return this.nodeType == 3; }).first().replaceWith(newCardSummary+"... ");

  currentBackgroundIndex=0;
  setSkyboxTexture(locationData.backgrounds[currentBackgroundIndex].panorama);
  setParticles(locationData.backgrounds[currentBackgroundIndex].particles);
}

// setCurrentPanorama(currentBackgroundIndex){
//
// }

// getLocationsData((data)=>{
//   data.destinations.forEach(locationData=>{
//     cachedLocationsData[locationData.cityName] = locationData;
//     allLocationsId.push(locationData.cityName);
//   });
//
//   let newLocationId = getRandomLocation();
//
//   setCurrentLocation(newLocationId);
//
// },(error)=>{
//   console.log("Failed to get locations data",error);
// });

function onClickBookVacationButton(){
  console.log("onClickBookVacationButton");
  window.open(cachedLocationsData[currentLocationId]["bookLink"],'_blank')
}

function onClickChangeBackgroundButton(){

  let locationData = cachedLocationsData[currentLocationId];
  currentBackgroundIndex=(currentBackgroundIndex+1)%locationData.backgrounds.length;
  console.log(currentBackgroundIndex);
  console.log(locationData.backgrounds[currentBackgroundIndex]);
  setSkyboxTexture(locationData.backgrounds[currentBackgroundIndex].panorama);
  setParticles(locationData.backgrounds[currentBackgroundIndex].particles);
}

function onClickNextLocationButton(){
  if(allLocationsId.length==0){
    console.log("allLocationsId.length==0!");
    getLocationsData((data)=>{
      data.destinations.forEach(locationData=>{
        cachedLocationsData[locationData.cityName] = locationData;
        allLocationsId.push(locationData.cityName);
      });
      onClickNextLocationButton();

    },(error)=>{
      console.log("Failed to get locations data",error);
    });
    return;
  }

  let newLocationId;
  while(true){
    newLocationId = getRandomLocation();
    if(newLocationId!=currentLocationId){
      break;
    }
  }

  previousLocationsId.push(currentLocationId);
  console.log(previousLocationButton);
  previousLocationButton.removeClass("disabled");

  setCurrentLocation(newLocationId);
}

function onClickPreviousLocationButton(){
  if(previousLocationsId.length==0) {
    previousLocationButton.addClass("disabled");
    console.log("There is no previous location!");
    return;
  }

  let previousLocationId = previousLocationsId.pop();
  if(previousLocationId==null){
    previousLocationButton.addClass("disabled");
    return;
  }
  setCurrentLocation(previousLocationId);

  if(previousLocationsId.length==0) {
    previousLocationButton.addClass("disabled");
  }
}

function onClickRegionOption(region){
  console.log("onClickRegionOption",region);
  currentRegion = region;
  regionButton.html("Region: "+region);
}
