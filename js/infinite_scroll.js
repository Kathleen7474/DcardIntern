function Spot(props) {
  console.log('output');
  console.log(props.output);
  let output_id = 'output ' + props.count;
  let tail_id = 'tail_' + props.count;
  return [
    <div id={output_id}>{props.output}</div>,
    <div id={tail_id}>我是屁股</div>,
  ];
}
class Show extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      output: null,
    };
  }
  componentDidMount() {
    fetch(this.props.url)
      .then((response) => response.json())
      .then((jsonData) => {
        this.setState({ data: jsonData });
        let e;
        let output = [];
        for (let i = 0; i < jsonData.length; i++) {
          e = jsonData[i];
          output.push(
            <dl key={this.props.count * 30 + i} id={this.props.count * 30 + i}>
              <dt>{e.Name}</dt>
              <dd>-{e.Description}</dd>
            </dl>
          );
        }
        let count = this.props.count + 1;
        this.setState({ output: output });
        this.setState({ count: count });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    console.log('屁股的屁股' + this.props.count);
    return <Spot output={this.state.output} count={this.props.count} />;
  }
}
class InitShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0, //幾次request
      total: 0, //總共幾筆資料(感覺不會用到)
      url:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$skip=0&$format=JSON',
      data: null,
      output: null,
    };
  }
  componentDidMount() {
    fetch(this.state.url)
      .then((response) => response.json())
      .then((jsonData) => {
        this.setState({ data: jsonData });
        let e;
        let output = [];
        for (let i = 0; i < jsonData.length; i++) {
          e = jsonData[i];
          output.push(
            <dl key={this.state.count * 30 + i} id={i}>
              <dt>{e.Name}</dt>
              <dd>-{e.Description}</dd>
            </dl>
          );
        }
        let count = 1;
        this.setState({ output: output });
        this.setState({ count: count });
        console.log('in mount' + this.state.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.count != this.state.count) {
      console.log('不要刷新');
      console.log(this.state.count);
      return false;
    } else {
      return true;
    }
  }
  send_request() {
    let i = 1;
    let tmp_url =
      'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=' +
      30 * (this.state.count + 1) +
      '&$skip=' +
      30 * this.state.count +
      '&$format=JSON';
    // this.setState({ data: null });
    // this.setState({ url: tmp_url });
    let tail = 'tail_' + (this.state.count - 1);
    console.log(tail);
    ReactDOM.render(
      <Show count={this.state.count} url={tmp_url} />,
      document.getElementById(tail)
    );

    let count = this.state.count + 1;
    this.setState({ count: count });
  }
  render_spot() {
    if (this.state.data == null) {
      console.log('資料還沒好');
      return <h4>-loading-</h4>;
    } else {
      console.log('重新render' + this.state.count);
      return <Spot output={this.state.output} count={this.state.count} />;
    }
  }
  handle_scroll() {
    let o = document.getElementById('list_inner');
    let rect = o.getBoundingClientRect();
    let inner_bottom = rect.bottom; //y
    let oo = document.getElementById('scroll_list_outter');
    rect = oo.getBoundingClientRect();
    let outer_bottom = rect.bottom; //yy
    if (inner_bottom - outer_bottom <= 2) {
      console.log('get to bottom');
      this.send_request();
    }
  }

  render() {
    return (
      <div className="container">
        <h2>Scienic Spots</h2>
        <div
          id="scroll_list_outter"
          className="scroll_list_outter"
          style={{ overflow: 'scroll', background: 'peachpuff', height: 500 }}
          onScroll={() => {
            this.handle_scroll();
          }}
        >
          <div id="list_inner" className="list_inner">
            {this.render_spot()}
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<InitShow />, document.getElementById('root'));
