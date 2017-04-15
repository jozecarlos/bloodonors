import React from 'react';
import EsriLoader from 'esri-loader-react';
import { dojoRequire } from 'esri-loader';
import style from './map.css';
import {geolocated} from 'react-geolocated';
import Modal from './form';


class ArcGis extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false, points: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.points.length !== this.state.points.length) {
      this.setState({ points: nextProps.points });
    }
  }

  hideModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  onSubmit = (donor) => {
    this.props.onSubmit(donor);
  }

  createMap = () => {

    dojoRequire([
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
      ], (
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
      ) => {

      var self = this;

      var map = new Map({ basemap: 'topo'});

      var view = new MapView({
        container: this.mapContainer,
        map: map,
        center: [this.props.coords.longitude, this.props.coords.latitude],
        zoom: 14
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
              content: "State: {Region}",
              overwriteActions: true,
              actions: [{
                title: "Zoom out",
                id: "zoom-out",
              }]
          },
          placeholder: "Yeahh porra",
          maxResults: 3,
          outFields: ["*"],
          maxSuggestions: 6,
          suggestionsEnabled: false,
          minSuggestCharacters: 0,
          resultSymbol: new PictureMarkerSymbol({
            url: "images/heart.png",
            height: 36,
            width: 36
          })}]
        });

       view.ui.add(homeBtn, "top-left");
       view.ui.add(searchWidget, { position: "top-right", index: 0 });

       view.popup.on("trigger-action", function(evt){
          if(evt.action.id === "zoom-out"){
            self.setState( { modalIsOpen: true } );
            console.log(evt);
            console.log( evt.detail.widget.location.latitude);
          }
       });

       this.props.socket.on('response:points', evt => {
         console.log( evt );
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

      view.on("pointer-up", function(evt) {
        if(evt.action === 'end'){

        }
       console.log(evt);
      });

      view.then( () => {
         self.props.onLoad({ loc: [this.props.coords.longitude, this.props.coords.latitude]});
      }, function(error){
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
          : <div>Loading..</div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000
})(ArcGis);
