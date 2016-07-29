import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchRepositoryData,
  changeIconSize,
  resetIconSize,
} from '../../actions/repository';
import { getIconDetail } from '../../actions/icon';
import Slider from '../../components/common/Slider/Slider';
import Pager from '../../components/common/Pager';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import Dialog from '../../components/common/Dialog/Index.jsx';
import { SubTitle } from '../../components/';
import { autobind } from 'core-decorators';

import './Repository.scss';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

const pageSize = 64;

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    iconSize: state.repository.iconSize,
    iconDetail: state.icon,
  }),
  { fetchRepositoryData, changeIconSize, resetIconSize, getIconDetail }
)
export default class Repository extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDownloadDialog: false,
    };
  }
  componentDidMount() {
    this.fetchRepositoryByPage(1);
    this.props.resetIconSize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.fetchRepositoryData(nextProps.params.id, 1);
      this.props.resetIconSize();
    }
  }

  @autobind
  fetchRepositoryByPage(page) {
    const { params: { id } } = this.props;
    this.props.fetchRepositoryData(id, page);
  }

  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }

  @autobind
  clikIconDownloadBtn(iconId) {
    return () => {
      this.props.getIconDetail(iconId).then(() => {
        this.setState({
          isShowDownloadDialog: true,
        });
      });
    };
  }

  render() {
    const { name, icons, user, currentPage, totalPage } = this.props.currRepository;
    // 待解决：initialState已经写为'{}', 不知道为啥初始user还是为undefined
    let admin = '';
    if (user) {
      admin = user.name;
    }
    return (
      <div className="repository">
        <SubTitle tit={`${name}图标库`}>
          <div className="sub-title-chil">
            <span className="count"><b className="num">{totalPage}</b>icons</span>
            <span className="powerby">管理员:</span>
            <span className="name">{admin}</span>
            <div className="tool-content">
              <div className="tools">
                <button href="#" className="options-btns btns-blue">
                  <i className="iconfont">&#xf50a;</i>上传新图标
                </button>
                <button href="#" className="options-btns btns-blue">
                  <i className="iconfont">&#xf50b;</i>下载全部图标
                </button>
                <button href="#" className="options-btns btns-default ml10">添加公告</button>
                <button href="#" className="options-btns btns-default">查看日志</button>
              </div>
              <span
                style={{
                  float: 'right',
                  color: '#616161',
                  fontSize: 16,
                  lineHeight: '38px',
                }}
              >{this.props.iconSize}px</span>
              <div style={{ width: 216, padding: 11, float: 'right' }}>
                <Slider
                  min={16}
                  max={64}
                  step={1}
                  defaultValue={64}
                  onChange={this.changeSize}
                />
              </div>
            </div>
          </div>
        </SubTitle>
        <div className="yicon-detail-main">
          <div className="yicon-detail-list clearfix">
            {
              icons.map((icon) => (
                <IconButton
                  icon={icon}
                  key={icon.id}
                  download={this.clikIconDownloadBtn(icon.id)}
                />
              ))
            }
          </div>
          {totalPage > pageSize &&
            <Pager
              defaultCurrent={currentPage}
              onClick={this.fetchRepositoryByPage}
              totalPage={Math.ceil(totalPage / pageSize)}
            />
          }
        </div>
        <Dialog empty visible={this.state.isShowDownloadDialog}>
          <DownloadDialog />
        </Dialog>
      </div>
    );
  }
}

Repository.propTypes = {
  fetchRepositoryData: PropTypes.func,
  changeIconSize: PropTypes.func,
  resetIconSize: PropTypes.func,
  getIconDetail: PropTypes.func,
  iconSize: PropTypes.number,
  currRepository: PropTypes.object,
  params: PropTypes.object,
};
