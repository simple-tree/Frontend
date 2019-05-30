import React, { Component } from 'react';
import ReactJson from 'react-json-view'
import Axios from 'axios';

const url = 'https://simple-tree-backend.herokuapp.com/';

export default class Tree extends Component {
  state = {
    trees: [],
    parent: null,
    text: ''
  }

  componentDidMount() {
    Axios.get(url)
      .then(res => {
        const trees = res.data;
        this.setState({ trees });
      })
  }

  onEdit = e => {
    const tree = e.updated_src[+e.namespace[0]];
    Axios.put(`${url}${tree.id}`, tree)
      .then(res => {
        const trees = e.updated_src;
        this.setState({ trees });
        console.log(this.state.trees);
      })
  }

  addNew = event => {
    const { text, parent } = this.state;
    Axios.post(url, { parent, text })
      .then(res => {
        const tree = res.data;
        let trees  = this.state.trees;
        trees.push(tree);
        this.setState({ trees })
      })
    event.preventDefault();
  }

  onDelete = e => {
    const tree = e.existing_value;
    Axios.delete(`${url}${tree.id}`)
      .then(res => {
        let trees = this.state.trees;
        const index = trees.indexOf(tree);
        trees.splice(index, 1);
        this.setState({ trees })
      })
  }

  render() {
    const {
      collapseStringsAfter,
      onEdit,
      onDelete,
      displayObjectSize,
      enableClipboard,
      theme,
      iconStyle,
      collapsed,
      indentWidth,
      displayDataTypes
    } = this.props;
    const { trees } = this.state;
    return (
      <div>
        <ReactJson name={false}
        collapsed={collapsed}
        style={style}
        theme={theme}
        src={trees}
        collapseStringsAfterLength={collapseStringsAfter}
        onEdit={ onEdit ? e => this.onEdit(e) : false }
        onDelete={ onDelete ? e => this.onDelete(e) : false }
        displayObjectSize={displayObjectSize}
        enableClipboard={enableClipboard}
        indentWidth={indentWidth}
        displayDataTypes={displayDataTypes}
        iconStyle={iconStyle} />
        <form onSubmit={this.addNew}>
          <label>
            parent:
            <input type="number" name="parent" onChange={(e) => this.setState({ parent: e.target.value })} />
          </label>
          <label>
            text:
            <input type="text" name="text" onChange={(e) => this.setState({ text: e.target.value })} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }

  static defaultProps = {
    theme: "monokai",
    src: null,
    collapsed: false,
    collapseStringsAfter: 15,
    onAdd: true,
    onEdit: true,
    onDelete: true,
    displayObjectSize: true,
    enableClipboard: true,
    indentWidth: 4,
    displayDataTypes: true,
    iconStyle: "triangle"
  }
}

const style = {
  padding: "10px",
  borderRadius: "3px",
  margin: "10px 0px"
}