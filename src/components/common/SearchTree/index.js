import React, {Component} from 'react';
import {Tree, Input} from 'antd';
import styles from './index.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const getParentKey = (title, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.title === title)) {
        parentKey = node.key;
      } else if (getParentKey(title, node.children)) {
        parentKey = getParentKey(title, node.children);
      }
    }
  }
  return parentKey;
};

const dataList = [];

const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({key, title: node.title});
    if (node.children) {
      generateList(node.children);
    }
  }
};

/*对于异步加载的子节点使用该key进行自增赋值*/
let key = 10;

class SearchTree extends Component {
  state = {
    expandedKeys: [],
    searchValue: ' ',
    autoExpandParent: true,
    gData: this.props.dataList || [],
    selectedKeys: [],
    checkedKeys: []
  };

  componentDidMount() {
    const {gData} = this.state;
    const {checkedList,dataList} = this.props;
    const checkedKeys = [];
    if (checkedList && checkedList.length) {
      checkedList.map((val, index) => {
        checkedKeys.push(val.key);
      });
    }
    let expandedKeys = [];
    if (dataList.length) {
      dataList.map((val, index) => {
          expandedKeys.push(`${val.key}`)
      });
    }
    this.setState({
      checkedKeys,
      selectedKeys: checkedKeys,
      expandedKeys:expandedKeys
    });
  }

  componentWillReceiveProps(nextProps) {
    const {checkedList, dataList} = nextProps;
    const checkedKeys = [];
    if (checkedList) {
      checkedList.map(val => {
        checkedKeys.push(val.key);
      });
    }
    let expandedKeys = [];
    if (dataList.length && this.props.dataList.length !== dataList.length) {
      dataList.map((val, index) => {
          expandedKeys.push(`${val.key}`)
      });
      this.setState({
        expandedKeys
      })
    }
      
    this.setState({
      checkedKeys,
      selectedKeys: checkedKeys,
      gData: dataList,
      
    });
  }

  onSelect = (father, choose, selectedKeys, info) => {
    const checked = [];
    if (father) {
      if (choose) {
        info.selectedNodes.map(val => {
          if (val.props.dataRef.attributes.select && !val.props.dataRef.disabled) {
            checked.push(val.props.dataRef);
          }
        });
      } else {
        info.selectedNodes.map(val => {
          checked.push(val.props.dataRef);
        });
      }
    } else {
      info.selectedNodes.map(val => {
        if (!val.props.children || !val.props.children.length) {
          checked.push(val.props.dataRef);
        }
      });
    }
    this.props.getChecked(checked);
    this.setState({selectedKeys});
  };

  onCheck = (father, choose, checkedKeys, info) => {
    const checked = [];
    if (father) {
      if (choose) {
        info.checkedKeys.map(val => {
          if (val.props.dataRef.attributes.select && !val.props.dataRef.disabled) {
            checked.push(val.props.dataRef);
          }
        });
      } else {
        info.checkedKeys.map(val => {
          checked.push(val.props.dataRef);
        });
      }
    } else {
      info.checkedNodes.map(val => {
        if (!val.props.children || !val.props.children.length) {
          checked.push(val.props.dataRef);
        }
      });
    }
    this.props.getChecked(checked);
    this.setState({checkedKeys});
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.title, this.state.gData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  loop = data => data.map((item) => {
    let { searchValue } = this.state;
    item.title = item.title ? item.title : '';
    const index = item.title.indexOf(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title = index > -1 ? (
      <span title={item.title}>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}{item.otherContent}
      </span>
    ) : <span title={item.title}>{item.title}{item.otherContent}</span>;
    if (item.children) {
      return (
        <TreeNode key={item.key} title={title} dataRef={item} disabled={item.disabled} switcherIcon={item.icon}>
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode dataRef={item} key={item.key} title={title} disabled={item.disabled}  switcherIcon={item.icon}/>;
  });

  render() {
    const {expandedKeys, autoExpandParent, gData, checkedKeys, selectedKeys} = this.state;
    const {style, checkable, father, choose, hideSearch, defaultExpandAll} = this.props;
    const height = document.body.clientHeight;
    // 进行数组扁平化处理
    generateList(gData);
    return (
      <div>
        {
          !hideSearch &&   <div style={{marginBottom: 10, padding: '0px'}}>
          <Search placeholder="搜索" onChange={this.onChange}/>
        </div>
        }

        <div className={styles.sides} style={{overflowY: 'auto', ...style}}>
          {defaultExpandAll ? (
            <Tree
              onSelect={this.onSelect.bind(this, father, choose)}
              onCheck={this.onCheck.bind(this, father, choose)}
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
              autoExpandParent={autoExpandParent}
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              {...this.props}
            >
              {this.loop(gData)}
            </Tree>
          ) :  (
              <Tree
              checkable={checkable}
              selectedKeys={selectedKeys}
              onSelect={this.onSelect.bind(this, father, choose)}
              onCheck={this.onCheck.bind(this, father, choose)}
              onExpand={this.onExpand}
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              {...this.props}
            >
              {this.loop(gData)}
            </Tree>
           )
         }
        </div>
      </div>
    );
  }
}

export default SearchTree;
