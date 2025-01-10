import { h, Component } from "preact";

class DateTimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>当前时间是：{this.state.date.toLocaleTimeString()}</h1>
      </div>
    );
  }
}

export default DateTimeComponent;