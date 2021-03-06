import 'rc-tree/assets/index.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import { gData, /* filterParentPosition, getFilterExpandedKeys,*/ getRadioSelectKeys } from './util';
import 'rc-dialog/assets/index.less';
import Modal from 'rc-dialog';

const Demo = React.createClass({
  propTypes: {
    multiple: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      visible: false,
      multiple: true,
    };
  },
  getInitialState() {
    return {
      // expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
      expandedKeys: ['0-0-0-key'],
      autoExpandParent: true,
      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
      checkedKeys: ['0-0-0-key'],
      checkStrictlyKeys: {},
      selectedKeys: [],
    };
  },
  onExpand(expandedKeys) {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded chilren keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  },
  onCheck(checkedKeys) {
    this.setState({
      checkedKeys,
    });
  },
  onCheckStrictly(checkedKeys, /* extra*/) {
    console.log(arguments);
    // const { checkedNodesPositions } = extra;
    // const pps = filterParentPosition(checkedNodesPositions.map(i => i.pos));
    // console.log(checkedNodesPositions.filter(i => pps.indexOf(i.pos) > -1).map(i => i.node.key));
    const cks = {
      checked: checkedKeys.checked || checkedKeys,
      halfChecked: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
    };
    this.setState({
      // checkedKeys,
      checkStrictlyKeys: cks,
      // checkStrictlyKeys: checkedKeys,
    });
  },
  onSelect(selectedKeys, info) {
    console.log('onSelect', selectedKeys, info);
    this.setState({
      selectedKeys,
    });
  },
  onRbSelect(selectedKeys, info) {
    let _selectedKeys = selectedKeys;
    if (info.selected) {
      _selectedKeys = getRadioSelectKeys(gData, selectedKeys, info.node.props.eventKey);
    }
    this.setState({
      selectedKeys: _selectedKeys,
    });
  },
  onClose() {
    this.setState({
      visible: false,
    });
  },
  handleOk() {
    this.setState({
      visible: false,
    });
  },
  showModal() {
    this.setState({
      expandedKeys: ['0-0-0-key', '0-0-1-key'],
      checkedKeys: ['0-0-0-key'],
      visible: true,
    });
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return (<TreeNode key={item.key} title={item.title}
                            disableCheckbox={item.key === '0-0-0-key' ? true : false}>
            {loop(item.children)}
          </TreeNode>);
        }
        return <TreeNode key={item.key} title={item.title}/>;
      });
    };
    // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
    return (<div style={{padding: '0 20px'}}>
      <h2>dialog</h2>
      <button className="btn btn-primary" onClick={this.showModal}>show dialog</button>
      <Modal title="TestDemo" visible={this.state.visible}
        onOk={this.handleOk} onClose={this.onClose}>
        <Tree checkable className="dialog-tree"
              onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}>
          {loop(gData)}
        </Tree>
      </Modal>
      <h2>controlled</h2>
      <Tree checkable multiple={this.props.multiple}
            onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}>
        {loop(gData)}
      </Tree>
      <h2>checkStrictly</h2>
      <Tree checkable multiple={this.props.multiple} defaultExpandAll
            onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
            onCheck={this.onCheckStrictly}
            checkedKeys={this.state.checkStrictlyKeys}
            checkStrictly>
        {loop(gData)}
      </Tree>
      <h2>radio's behavior select (in the same level)</h2>
      <Tree multiple defaultExpandAll
            onSelect={this.onRbSelect}
            selectedKeys={getRadioSelectKeys(gData, this.state.selectedKeys)}>
        {loop(gData)}
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
