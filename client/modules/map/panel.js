import React, { Component } from 'react';
import style from './panel.css';

export default class Panel extends Component {

  constructor(props){
    super(props);
    this.state = { places: [] };
  }

  componentDidMount() {
    const self = this;
    this.props.socket.on('response:add', evt => {
      if (evt.type === 'add:donors' && evt.data !== undefined) {
        const p = self.state.places;
        p.push(evt.data);
        self.setState({ places: p })
      }
    });
  }

  edit = ( e ) => {
    e.preventDefault();
  }

  delete = ( e ) => {
    e.preventDefault();
  }

  list = () => {
    const listItems = this.state.places.map((dn, index) =>
      <li key={dn.cuid}>
          {dn.address}
          <a  onClick={this.edit}><img width="16" height="16" src="/images/edit.png"></img></a>
          <a  onClick={this.delete}><img key={index} width="16" height="16" src="/images/trash.png"></img></a>
      </li>
    );
    return listItems;
  }

  render() {
    const itens = this.list();
    return (this.state.places.length > 0 ? <div>
      <div className={style.wrapper}>
        <div className={style.txt}>
          <h5 className={style.h5}>My Places</h5>
          <div><ul>{itens}</ul></div>
        </div>
      </div>
    </div> : <div></div>);
  }
}
