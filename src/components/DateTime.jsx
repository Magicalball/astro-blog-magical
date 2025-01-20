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
    const year = this.state.date.getFullYear(); // year
    const month = this.state.date.getMonth() + 1; // month
    const day = this.state.date.getDate(); // day
    const week = this.state.date.getDay(); // week
    const weekName = ["日", "一", "二", "三", "四", "五", "六"];
    return (
      <div class="date-time" style=" display: flex;" >
        <p>今天是{year}年{month}月{day}日 星期{weekName[week]} {this.state.date.toLocaleTimeString()}</p>  
      </div>
    );
  }
}

export default DateTimeComponent;