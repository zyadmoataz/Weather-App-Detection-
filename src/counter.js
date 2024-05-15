//in 2019 we were building component with js classes in functions
//we will extend react. component as it has methods we wanna use as render so we must import react
import React from "react";

class Counter extends React.Component {
  //to add hooks we must use constructor function
  constructor(props) {
    super(props);

    //initialize state here in the constructr as each time a new object istantiated from this class
    this.state = { count: 5 };
    this.handleDecrement = this.handleDecrement.bind(this); //to give to that handler the acces to the current component instance
    this.handleIncrement = this.handleIncrement.bind(this); //to give to that handler the acces to the current component instance
  }

  handleDecrement() {
    //1-we can pass the new state
    // this.setState({count:10});

    //2- pass a callback function based on the current state
    // console.log(this); //this keyword points to the current component instance
    // this.setState((currentState) => return {count: currentState.count -1});
    this.setState((currentState) => ({ count: currentState.count - 1 }));
  }

  handleIncrement() {
    this.setState((currentState) => ({ count: currentState.count + 1 }));
  }

  //render method is like function body of function component
  //every class component needs to have a render method which returns some jsx
  //this render must contain small render logic as possible and dont write handlers inside it
  //all handlers that are called inside the jsx will lose their binding to the this keyword
  //so we will manually bind it in the constructor
  render() {
    //some simple logic can be applied
    const date = new Date("march 3 2024");
    date.setDate(date.getDate() + this.state.count);
    return (
      <div>
        <button onClick={this.handleDecrement}>-</button>
        <span>{date.toDateString()}</span>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
}

export default Counter;
