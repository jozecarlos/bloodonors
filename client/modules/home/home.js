import React, { Component } from 'react';
import ArcGis from '../map/';
import style from '../../styles/main.css';
import { socketConnect } from 'socket.io-react';

class Home extends Component {

  constructor(props, context) {
    super(props, context);
  }

  saveDonor = (donor ) => {
    this.props.socket.emit('add:donor', donor);
  }

  render() {
    return (
      <div>
        <div className={style.header_container}>
          <div className={style.header}>
            <div className={style.alignleft}>
              <img src="/images/logo.gif" height="50" width="100"></img>
            </div>
            <div className={style.alignright}>
               <p className={style.txt}>This project is Mern created using the map ArcGIS
               <br />author: José Carlos
               <br />email: jozecarlos.it@gmail.com</p>
            </div>
            <div className={style.clear}></div>
          </div>
        </div>
        <div className={style.container}>
          <div className={style.content}>
            <ArcGis onSubmit={this.saveDonor} socket={this.props.socket} />
          </div>
        </div>
        <div className={style.footer_container}>
          <div className={style.footer}>
            <div className={style.alignleft}>
              <ul className={style.list}>
                <li><a href="#"><img src='/images/node.png' height="50" width="50"></img></a></li>
                <li><a href="#"><img src='/images/mongodb.png' height="40" width="40"></img></a></li>
                <li><a href="#"><img src='/images/react.png' height="40" width="40"></img></a></li>
                <li><a href="#"><img src='/images/expressjs.png' height="40" width="40"></img></a></li>
              </ul>
            </div>
            <div className={style.alignright}>
               <p className={style.footerTxt}>
                 <a href="#"><img src='/images/github.png' height="30" width="30"></img></a>
               </p>
            </div>
            <div className={style.clear}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default socketConnect(Home);
