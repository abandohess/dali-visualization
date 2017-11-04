import React from 'react'
import vis from 'vis'
import wiki from 'wikijs'
import { Card, Icon } from 'semantic-ui-react'
import EmployeeModal from './EmployeeModal.js'

class App extends React.Component {
  constructor() {
    super();
    this.state = {  loading: false,
                    employees: null };
    this.nodes = new vis.DataSet([{id: 'Tim', label: 'Tim Tregubov', fixed: true, image:'http://mappy.dali.dartmouth.edu/images/tim_round.jpg'}]);
    this.edges = new vis.DataSet([]);
    this.imgDir =  'http://mappy.dali.dartmouth.edu/';
    this.NUM_ADD = 3;
    this.lastRoundOfEmployees = [{name: 'Tim'}];
    this.nextRoundOfEmployees = [];
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

    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        document.getElementById(params.nodes[0] + 'Button').click();
      }
    });

    this.interval = setInterval(() => {
      this.addMember();
    }, 4000);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addMember() {
    let len = this.lastRoundOfEmployees.length;
    for (let i = 0; i < len; i++) {
      let oldNode = this.lastRoundOfEmployees.splice(0, 1);
      this.addAtLeaf(oldNode);
    }
    this.lastRoundOfEmployees = this.nextRoundOfEmployees.slice(0);
    this.nextRoundOfEmployees.splice(0, this.nextRoundOfEmployees.length);
  }

  addAtLeaf(oldNode) {
    for (let j = 0; j < this.NUM_ADD; j++) {
      if (this.state.employees.length < 1) return;
      let randIndex = Math.random() * this.state.employees.length;
      let nextEmployee = this.state.employees.splice(randIndex, 1);
      this.nodes.add({id:nextEmployee[0].name, label:nextEmployee[0].name,
            image:this.imgDir + nextEmployee[0].iconUrl});
      this.edges.add({from:oldNode[0].name, to: nextEmployee[0].name});
      this.nextRoundOfEmployees.push(nextEmployee[0]);
    }
  }

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

  renderModals() {
    if (this.state.employees == null) return;
    let theApp = this;
    return (
      <div>
        { this.state.employees.map(function(employee) {
          console.log(employee)
          return (
            <EmployeeModal
              image={theApp.imgDir + employee.iconUrl}
              id={employee.name + 'Button'}
              key={employee.name}
              name={employee.name}
              projects={employee.project}
              term={employee.terms_on}
              message={employee.message}
              />
          )
        }) }
      </div>
    );
  }
  render() {

    return (
      <div>
        <div
          id="daliEmpoyees"
          // style={{width: window.innerWidth, height: window.innerHeight}}/>
          style={{width: window.innerWidth, height: window.innerHeight}}/>

        {this.renderModals()}
      </div>

    );
  }

}

export default App;
