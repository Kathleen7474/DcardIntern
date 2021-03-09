$(document).ready(function () {
  $(document).on('change', '#select_bar', function () {
    console.log(this.value);
    let tmp_url =
      'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/' +
      this.value +
      '?$top=30&$skip=0&$format=JSON';
    ReactDOM.render(
      <InitShow city={this.value} url={tmp_url} />,
      document.getElementById('root2')
    );
  });
});
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
      data: null,
      output: null,
      count: 0,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('in update');
    console.log(prevProps);
    console.log(this.props);
    if (
      (this.props.city != null || this.props.city != '-選擇城市-') &&
      this.props.city != prevProps.city
    ) {
      fetch(this.props.url)
        .then((response) => response.json())
        .then((jsonData) => {
          this.setState({ data: jsonData });
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
          let count = this.state.count + 1;
          this.setState({ output: output });
          this.setState({ count: count });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  send_request() {
    let i = 1;
    let tmp_url =
      'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot' +
      this.props.city +
      '?$top=' +
      30 * (this.state.count + 1) +
      '&$skip=' +
      30 * this.state.count +
      '&$format=JSON';
    // this.setState({ data: null });
    // this.setState({ url: tmp_url });
    let tail = 'tail_' + (this.state.count - 1);
    console.log(tail);
    ReactDOM.render(
      <Show count={this.state.count} city={this.props.city} url={tmp_url} />,
      document.getElementById(tail)
    );

    let count = this.props.count + 1;
    this.setState({ count: count });
  }
  render_spot() {
    if (this.props.city == null || this.props.city == '-選擇城市-') {
      console.log(this.props.city);
      return <h4>-先選擇城市-</h4>;
    }
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
      </div>
    );
  }
}
ReactDOM.render(
  <InitShow city={null} url={''} />,
  document.getElementById('root2')
);
