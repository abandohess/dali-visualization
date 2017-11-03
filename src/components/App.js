import React from 'react'
import vis from 'vis'
import wiki from 'wikijs'
import { Loader } from 'semantic-ui-react'

class App extends React.Component {
  constructor() {
    super();
    this.state = {  loading: false };
    this.nodes = new vis.DataSet([{id: 'Tim', label: 'Tim Tregubov', fixed: true, image:'http://mappy.dali.dartmouth.edu/images/tim_round.jpg'}]);
    this.edges = new vis.DataSet([]);
    this.imgDir =  'http://mappy.dali.dartmouth.edu/';
    this.employees = null;
  }

  componentDidMount() {
    let requestURL = 'http://mappy.dali.dartmouth.edu/members.json';
    let request = new XMLHttpRequest();
    this.loadJSON();
    const options = {
      edges:{
        arrows: 'to',
        smooth: true,
        width: 1
      },
      nodes: {
        shape: 'circularImage',
        color: '#FFFFFF',
        font: {
          face: 'Lato'
        },
        shadow: true,
      }
    };

    const container = document.getElementById('daliEmpoyees');
    const network = new vis.Network(
      container,
      {nodes: this.nodes, edges: this.edges},
      options
    );

    network.on("doubleClick", (params) => {
      if (params.nodes.length > 0) {
        console.log(this.employees[0]);
        // this.addMember(params.nodes[0]);
      }
    });

  }

  addMember(fromNodeTitle) {
  }

  loadJSON() {
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      this.employees = request.response;
      console.log(this.employees[0]);
    }
  }

  render() {
    return (
      <div>
        <div
          id="daliEmpoyees"
          style={{width: window.innerWidth, height: window.innerHeight}}/>
        <Loader active={this.state.loading} style={{position: 'absolute', top:25}}/>
      </div>
    );
  }

}

export default App;
