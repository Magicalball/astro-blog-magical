import { h, Component } from "preact";

class DateTimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),// time
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
    const year = new Date().getFullYear(); // year
    const month = new Date().getMonth() + 1; // month
    const day = new Date().getDate(); // day
    const week = new Date().getDay(); // week
    const weekName = ["日", "一", "二", "三", "四", "五", "六"];
    return (
      <div>
        <p>今天是{year}年{month}月{day}日 星期{weekName[week]} {this.state.date.toLocaleTimeString()}</p>  
      </div>
    );
  }
}

export default DateTimeComponent;