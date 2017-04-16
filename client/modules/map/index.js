import React from 'react';
import EsriLoader from 'esri-loader-react';
import { dojoRequire } from 'esri-loader';
import style from './map.css';
import {geolocated} from 'react-geolocated';
import Modal from './form';
import axios from 'axios';


class ArcGis extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false, coord: [] };
  }

  hideModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  onSubmit = (donor) => {
    self = this;
    axios.get('//ipinfo.io/json')
      .then( res => {
        donor.ip = res.data.ip;
        donor.location = this.state.coord;
        self.props.onSubmit(donor);
    });
  }

  createMap = () => {

    dojoRequire([
        'dojo/dom-construct',
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Search',
        'esri/PopupTemplate',
        'esri/widgets/Home',
        'esri/layers/FeatureLayer',
        'esri/symbols/PictureMarkerSymbol',
        'esri/tasks/Locator',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
        'esri/core/watchUtils',
      ], (
        domConstruct,
        Map,
        MapView,
        Search,
        PopupTemplate,
        Home,
        FeatureLayer,
        PictureMarkerSymbol,
        Locator,
        Point,
        SimpleMarkerSymbol,
        Graphic,
        GraphicsLayer,
        watchUtils,
      ) => {

      var self = this;

      var map = new Map({ basemap: 'dark-gray'});

      var view = new MapView({
        container: this.mapContainer,
        map: map,
        center: [this.props.coords.longitude, this.props.coords.latitude],
        zoom: 8
      });

      var homeBtn = new Home({ view: view });

      var donorsLayer = new GraphicsLayer({ id: 'donors_layer'});

      var markerSymbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      });

      var searchWidget = new Search({
        view: view,
        allPlaceholder: "District or Senator",
        sources:[{
          locator: new Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer") ,
          singleLineFieldName: "SingleLine",
          name: "Custom Geocoding Service",
          localSearchOptions: {
            minScale: 300000,
            distance: 50000
          },
          popupTemplate: {
              title: "{PlaceName}",
              content: "To ensure the safety of blood donation for both donors and recipients,"+
              "all volunteer blood donors must register yourself in this app, clicking in the button below.",
              overwriteActions: true,
              actions: [{
                title: "Become a Donor",
                id: "donor-bt",
              }]
          },
          placeholder: "Find a Andress",
          maxResults: 3,
          outFields: ["*"],
          maxSuggestions: 6,
          suggestionsEnabled: false,
          minSuggestCharacters: 0,
          resultSymbol: new PictureMarkerSymbol({
            url: "images/marker.png",
            height: 36,
            width: 36
          })}]
        });

       view.ui.add(homeBtn, "top-left");
       view.ui.add(searchWidget, { position: "top-right", index: 0 });

       view.popup.on("trigger-action", function(evt){
          if(evt.action.id === "donor-bt"){
            self.setState({
                modalIsOpen: true,
                coord: [
                  evt.detail.widget.location.longitude,
                  evt.detail.widget.location.latitude
                ]
             });
            console.log(evt);
            console.log( evt.detail.widget.location.latitude);
          }
       });

       this.props.socket.on('response:points', evt => {
          if( evt.type === 'list:donors' && evt.data.length > 0){

              evt.data.forEach(function (value) {

                donorsLayer.add(new Graphic({
                  geometry: new Point({
                    longitude: value.location[0],
                    latitude: value.location[1]
                  }),
                  symbol: markerSymbol,
                  attributes: value,
                  popupTemplate: { // autocasts as new PopupTemplate()
                    title: "{firstName} {lastName}",
                    content: [{ type: "fields",
                      fieldInfos: [
                        { fieldName: "bloodGroup"},
                        {fieldName: "contactNumber"},
                        {fieldName: "email"},
                        {fieldName: "address"}]
                     }]
                  }
                }));
              });

              map.layers.add(donorsLayer);
          }
       });

      view.then( () => {
         self._points = view.center;
         this.props.socket.emit('list:donor', [this.props.coords.longitude, this.props.coords.latitude]);
         watchUtils.whenTrue(view, "stationary", () => {
             if(view.center){
                if(view.center.longitude !== self._points.longitude && view.center.latitude !== self._points.latitude){
                   var loc = [view.center.longitude, view.center.latitude];
                   this.props.socket.emit('list:donor', loc);
                }
             }
         });
      },
      (error) =>{
        console.log("The map view resources failed to load: ", error);
      });

    });
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.3/'
    };

    return (
      !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ?
          <div>
            <EsriLoader options={options} ready={this.createMap} />
            <div ref={node => this.mapContainer = node} className={style.map_view}></div>
            <Modal
               onSubmit={this.onSubmit}
               isOpen={this.state.modalIsOpen }
               hideModal={this.hideModal} />
          </div>
          : <div className={style.wrapper}><div className={style.loader}></div></div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000
})(ArcGis);
