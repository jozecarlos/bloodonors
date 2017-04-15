import React, { Component } from 'react';
import ArcGis from '../map/';
import style from '../../styles/main.css';
import { socketConnect } from 'socket.io-react';

class Home extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { points: [] };
  }

  saveDonor = (donor ) => {
    this.props.socket.emit('add:donor', donor);
  }

  onLoad = ( evt ) => {
    this.props.socket.emit('list:donor', evt.loc);
  }

  render() {
    return (
      <div className={style.wrap}>
        <div className={style.header}><h1 className={style.h1}>Simple 2 column CSS layout, romario</h1></div>
        <div className={style.nav}>
          <ul>
            <li><a href="/">Option 1</a></li>
            <li><a href="/">Option 2</a></li>
            <li><a href="/">Option 3</a></li>
            <li><a href="/">Option 4</a></li>
            <li><a href="/">Option 5</a></li>
          </ul>
        </div>
        <div className={style.main}>
           <ArcGis
                  points={this.state.points}
                  onSubmit={this.saveDonor}
                  onLoad={this.onLoad}
                  socket={this.props.socket} />
        </div>
        <div className={style.footer}>
          <p>Footer</p>
        </div>
      </div>
    );
  }
}

export default socketConnect(Home);
