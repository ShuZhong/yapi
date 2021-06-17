import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import './ProjectTag.scss'

class ProjectTag extends Component {
  static propTypes = {
    tagMsg: PropTypes.array,
    tagSubmit: PropTypes.func,
  };
  constructor(props) {
    super(props)
    this.state = {
      tag: [{ name: '', desc: '' }],
    }
  }

  initState(curdata) {
    const tag = [
      {
        name: '',
        desc: '',
      },
    ]
    if (curdata && curdata.length !== 0) {
      curdata.forEach(item => {
        tag.unshift(item)
      })
    }

    return { tag }
  }
  componentDidMount() {
    this.handleInit(this.props.tagMsg)
  }

  handleInit(data) {
    const newValue = this.initState(data)
    this.setState({ ...newValue })
  }

  addHeader = (val, index, name, label) => {
    const newValue = {}
    newValue[name] = [].concat(this.state[name])
    newValue[name][index][label] = val
    const nextData = this.state[name][index + 1]
    if (!(nextData && typeof nextData === 'object')) {
      const data = { name: '', desc: '' }
      newValue[name] = [].concat(this.state[name], data)
    }
    this.setState(newValue)
  };

  delHeader = (key, name) => {
    const curValue = this.state[name]
    const newValue = {}
    newValue[name] = curValue.filter((val, index) => index !== key)
    this.setState(newValue)
  };

  handleChange = (val, index, name, label) => {
    const newValue = this.state
    newValue[name][index][label] = val
    this.setState(newValue)
  };

  render() {
    const commonTpl = (item, index, name) => {
      const length = this.state[name].length - 1
      return (
        <Row key={index} className="tag-item">
          <Col span={6} className="item-name">
            <Input
              placeholder={`请输入 ${name} 名称`}
              // style={{ width: '200px' }}
              value={item.name || ''}
              onChange={e => this.addHeader(e.target.value, index, name, 'name')}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="请输入tag 描述信息"
              style={{ width: '90%', marginRight: 8 }}
              onChange={e => this.handleChange(e.target.value, index, name, 'desc')}
              value={item.desc || ''}
            />
          </Col>
          <Col span={2} className={index === length ? ' tag-last-row' : null}>
            {/* 新增的项中，只有最后一项没有有删除按钮 */}
            <DeleteOutlined
              className="dynamic-delete-button delete"
              onClick={e => {
                e.stopPropagation()
                this.delHeader(index, name)
              }}
            />
          </Col>
        </Row>
      )
    }

    return (
      <div className="project-tag">
        {this.state.tag.map((item, index) => commonTpl(item, index, 'tag'))}
      </div>
    )
  }
}

export default ProjectTag
