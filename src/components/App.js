import React from 'react'
import vis from 'vis'
import wiki from 'wikijs'
import { Loader } from 'semantic-ui-react'

class App extends React.Component {
  constructor() {
    super();
    this.state = {  loading: false,
                    employees: null };
    this.nodes = new vis.DataSet([{id: 'Tim', label: 'Tim Tregubov', fixed: true, image:'http://mappy.dali.dartmouth.edu/images/tim_round.jpg'}]);
    this.edges = new vis.DataSet([]);
    this.imgDir =  'http://mappy.dali.dartmouth.edu/';
    this.employees = null;
    this.NUM_ADD = 3;
    this.lastRoundOfEmployees = [{name: 'Tim'}];
    this.nextRoundOfEmployees = [];
    // this.employeesInGraph = [];
    // this.wiki = wiki();
  }

  componentDidMount() {
    this.loadJSON();
    const options = {
      edges:{
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
        this.addMember(params.nodes[0]);
        // this._addWikiNode(params.nodes[0]);
      }
    });
  }

  addMember(fromNodeTitle) {
    let counter = 1;
    this.setState({loading: true});
    console.log("last round len", this.lastRoundOfEmployees.length)
    for (let i = 0; i < this.lastRoundOfEmployees.length; i++) {
      console.log("i", i);
      let oldNode = this.lastRoundOfEmployees.splice(0, 1);
      console.log(oldNode)
      for (let j = 0; j < this.NUM_ADD; j++) {
        if (this.state.employees.length < 1) return;
        let randIndex = Math.random() * this.state.employees.length;
        let nextEmployee = this.state.employees.splice(randIndex, 1);
        try {
          this.nodes.add({id:nextEmployee[0].name, label:nextEmployee[0].name,
              image:this.imgDir + nextEmployee[0].iconUrl});
        } catch(error) {
          console.log(error);
        }
        this.edges.add({from:oldNode[0].name, to: nextEmployee[0].name});
        this.nextRoundOfEmployees.push(nextEmployee[0]);
      }
    }
    this.lastRoundOfEmployees = this.nextRoundOfEmployees.slice(0);
    this.nextRoundOfEmployees.splice(0, this.nextRoundOfEmployees.length);

    // this.edges.add({from: fromNodeTitle, to: nextEmployee[0].name});
  }

  // isOutOfEmployees() {
  //   console.log("last round",this.lastRoundOfEmployees.length)
  //   console.log("employees len",this.state.employees.length)
  //   return (this.lastRoundOfEmployees.length < 1 || this.state.employees.length < 1)
  // }

  loadJSON() {
    let requestURL = 'http://mappy.dali.dartmouth.edu/members.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    let theApp = this;
    request.onload = function() {
      theApp.setState({
        employees: request.response,
      }, () => theApp.removeDuplicateNames());
      console.log(theApp.state.employees[0]);
    }
  }

  removeDuplicateNames() {
    let timIndex = this.state.employees.findIndex(employee => {
      return (employee.name == "Tim");
    });
    this.state.employees.splice(timIndex, 1);
    let emmaIndex = this.state.employees.findIndex(employee => {
      return (employee.name == "Emma");
    });
    this.state.employees.splice(emmaIndex, 1);
  }

  _addWikiNode(fromNodeTitle) {
    this.setState({loading: true});
    this.wiki.page(fromNodeTitle).then(page =>
      page.links()
    ).then(links => {
      this.setState({loading: false});
      const randomLink = links[Math.floor(Math.random()*links.length)];
      console.log(randomLink);
      this.nodes.add({id:randomLink, label:randomLink});
      this.edges.add({from: fromNodeTitle, to: randomLink});
    }).catch(error =>
      console.log(error)
    )
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
