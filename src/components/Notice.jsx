import { h, Component } from "preact";

class NoticeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiable: !localStorage.getItem("popClosed"),
    };
  }

  closeNotice = () => {
    this.setState({
      isVisiable: false,
    });
    localStorage.setItem("popClosed", "true");
  };

  render() {
    const { isVisiable } = this.state;
    return (
      <>
        {isVisiable && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              <p>站点正在施工中，敬请期待</p>
              <p>{this.props.noticeText}</p>
              <button style={styles.button} onClick={this.closeNotice}>
                关闭
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default NoticeComponent;
