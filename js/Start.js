//共用
let last = false;
function Spot(props) {
  let output_id = 'output ' + props.count;
  let tail_id = 'tail_' + props.count;
  if (props.last == true) {
    return <div id={tail_id}>資料底端</div>;
  }
  return [
    <div id={output_id}>{props.output}</div>,
    <div id={tail_id}>-loading-</div>,
  ];
}
//ALL為顯示所有
class Show_All extends React.Component {
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
        if (jsonData == '') {
          last = true;
        }
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
    return (
      <Spot output={this.state.output} count={this.props.count} last={last} />
    );
  }
}
class InitShow_All extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0, //幾次request
      url:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$skip=0&$format=JSON',
      data: null,
      output: null,
    };
  }
  componentDidMount() {
    last = false;
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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.count != this.state.count) {
      return false;
    } else {
      return true;
    }
  }
  send_request() {
    let i = 1;
    let tmp_url =
      'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$skip=' +
      30 * this.state.count +
      '&$format=JSON';
    // this.setState({ data: null });
    // this.setState({ url: tmp_url });
    let tail = 'tail_' + (this.state.count - 1);
    ReactDOM.render(
      <Show_All count={this.state.count} url={tmp_url} />,
      document.getElementById(tail)
    );

    let count = this.state.count + 1;
    this.setState({ count: count });
  }
  render_spot() {
    if (this.state.data == null) {
      return <h4>-loading-</h4>;
    } else {
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
      if (last == false) this.send_request();
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

//City為城市
class Show_City extends React.Component {
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
        if (jsonData == '') {
          last = true;
        }
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
        this.setState({ output: output });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    return (
      <Spot output={this.state.output} count={this.props.count} last={last} />
    );
  }
}

class InitShow_City extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/' +
        this.props.match.params.city +
        '?$top=30&$skip=0&$format=JSON',
      data: null,
      output: null,
      count: 0,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.city != prevProps.match.params.city) {
      this.setState({
        url:
          'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/' +
          this.props.match.params.city +
          '?$top=30&$skip=0&$format=JSON',
        data: null,
        output: null,
        count: 0,
      });
      last = false;
      fetch(
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/' +
          this.props.match.params.city +
          '?$top=30&$skip=0&$format=JSON'
      )
        .then((response) => response.json())
        .then((jsonData) => {
          this.setState({ data: jsonData });
          this.setState({ count: 0 });
          let e;
          let output = [];
          for (let i = 0; i < jsonData.length; i++) {
            e = jsonData[i];
            output.push(
              <dl
                key={this.state.count * 30 + i}
                id={this.state.count * 30 + i}
              >
                <dt>{e.Name}</dt>
                <dd>-{e.Description}</dd>
              </dl>
            );
          }
          this.setState({ output: output });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  componentDidMount() {
    {
      last = false;
      fetch(this.state.url)
        .then((response) => response.json())
        .then((jsonData) => {
          this.setState({ data: jsonData });
          this.setState({ count: 0 });
          let e;
          let output = [];
          for (let i = 0; i < jsonData.length; i++) {
            e = jsonData[i];
            output.push(
              <dl
                key={this.state.count * 30 + i}
                id={this.state.count * 30 + i}
              >
                <dt>{e.Name}</dt>
                <dd>-{e.Description}</dd>
              </dl>
            );
          }
          this.setState({ output: output });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  send_request() {
    let i = 1;
    let tmp_url =
      'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/' +
      this.props.match.params.city +
      '?$top=30&$skip=' +
      30 * (this.state.count + 1) +
      '&$format=JSON';
    // this.setState({ data: null });
    // this.setState({ url: tmp_url });
    let tail = 'tail_' + this.state.count;
    ReactDOM.render(
      <Show_City
        count={this.state.count + 1}
        city={this.props.match.params.city}
        url={tmp_url}
      />,
      document.getElementById(tail)
    );

    let count = this.state.count + 1;
    this.setState({ count: count });
  }
  render_spot() {
    if (this.state.data == null) {
      return <h4>-loading-</h4>;
    } else {
      return <Spot output={this.state.output} count={0} />;
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
      if (last == false) this.send_request();
    }
  }

  render() {
    return [
      <div className="container">
        <h2>Scienic Spots(Cites)</h2>
        <div
          id="scroll_list_outter"
          className="scroll_list_outter"
          style={{ overflow: 'scroll', background: 'khaki', height: 500 }}
          onScroll={() => {
            this.handle_scroll();
          }}
        >
          <div id="list_inner" className="list_inner">
            {this.render_spot()}
          </div>
        </div>
      </div>,
    ];
  }
}
const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
class Start extends React.Component {
  render() {
    return (
      <ReactRouterDOM.HashRouter>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/scenicSpot">全部景點</Link>
          </li>
        </ul>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/scenicSpot/Taipei">-臺北市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/NewTaipei">-新北市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Taoyuan">-桃園市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Taichung">-臺中市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Tainan">-臺南市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Kaohsiung">-高雄市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Keelung">-基隆市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Hsinchu">-新竹市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/HsinchuCounty">-新竹縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/MiaoliCounty">-苗栗縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/ChanghuaCounty">-彰化縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/NantouCounty">-南投縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/YunlinCounty">-雲林縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/ChiayiCounty">-嘉義縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/Chiayi">-嘉義市-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/PingtungCounty">-屏東縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/YilanCounty">-宜蘭縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/HualienCounty">-花蓮縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/TaitungCounty">-臺東縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/KinmenCounty">-金門縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/PenghuCounty">-澎湖縣-</Link>
          </li>
          <li className="nav-item">
            <Link to="/scenicSpot/LienchiangCounty">-連江縣-</Link>
          </li>
        </ul>
        <Route
          path="/scenicSpot/:city"
          render={(props) => <InitShow_City {...props} />}
        />

        <Route exact path="/scenicSpot" render={(props) => <InitShow_All />} />
      </ReactRouterDOM.HashRouter>
    );
  }
}

ReactDOM.render(<Start />, document.querySelector('#root'));
