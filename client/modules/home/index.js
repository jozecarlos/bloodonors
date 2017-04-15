import React, { Component } from 'react';
import Home from './home';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const uri = 'http://localhost:8000';
const socket = io.connect(uri);

export default class Container extends Component {

  render() {
    return (
      <SocketProvider socket={socket}>
          <Home />
      </SocketProvider> );
   }
}
