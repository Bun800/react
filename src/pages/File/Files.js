import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
  Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Files.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(({ filesmodel,rule }) => ({
  filesmodel,rule
}))
class Files extends PureComponent {
  state = {
    selectedRows: [],
    loading:false,
    pagination: {},
    dataSource:[],
    visible:false,
    details:'',
  };

 
  componentDidMount() {
    // 首次加载 
    this.onload()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };
  // 首次加载
  onload = pageNum =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'filesmodel/queryflies',
      payload: {},
    });
  }
  // 分页
  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      size: pagination.pageSize,
      index: pagination.current,
    });
  };

  fetch = (params = {}) => {
    this.onload(params.index);
  };
  
  // preview
  onpreview=(record)=>{
   this.setState({
    visible:true,
    details:record.name
   })
  }
 
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    const { filesmodel:{data}, loading,} = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,details} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const columns = [
      {
      title: formatMessage({ id: 'app.file.filename' }),
      dataIndex: 'name',
      width: '60%',
      render:(text,record,index)=>{
        return  <Tooltip  className={styles.filenamehide} placement="bottomLeft" title={text}>
        {text}
      </Tooltip>
      } 
      },
      {
      title: formatMessage({ id: 'app.file.filesize' }),
      dataIndex: 'size',
      width: '20%',
     }, {
      title: formatMessage({ id: 'app.file.Action' }),
      dataIndex: '',
      render:(text,record,index)=>{
        return <div><span onClick={()=>{this.onpreview(record)}} className={styles.preview}>{formatMessage({ id: 'app.file.preview' })}</span><a>{formatMessage({ id: 'app.file.download' })}</a></div>
      }
    }];
    
    return (
      <PageHeaderWrapper title={formatMessage({ id: 'app.file.filelist' })}>
        <Card bordered={false}>
          <Table columns={columns}
          rowKey={record => record.key}
          dataSource={data.list}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        </Card>
        <Modal
          title={"详情"}
          visible={this.state.visible}
          footer={null}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
         <p>{details}</p>
        
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Files;
