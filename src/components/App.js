import React from 'react'
import vis from 'vis'
import wiki from 'wikijs'
import { Loader } from 'semantic-ui-react'

class App extends React.Component {
  constructor() {
    super();
    this.state = {loading: false};
    this.nodes = new vis.DataSet([{id: 'Tim', label: 'Tim Tregubov', fixed: true}]);
    this.edges = new vis.DataSet([]);
  }

  componentDidMount() {
    const options = {
      edges:{
        arrows: 'to',
        smooth: true,
        width: 1
      },
      nodes: {
        color: '#FFFFFF',
        font: {
          face: 'Lato'
        },
        shadow: true,
        shape: 'box',
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
        this.addMember(params.nodes[0])
      }
    });

  }

  addMember(fromNodeTitle) {
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
