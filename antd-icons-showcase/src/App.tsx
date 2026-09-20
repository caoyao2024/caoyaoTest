import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Statistic,
  Switch,
  Tag,
  Typography,
  message,
  Alert,
  Steps,
} from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  LockOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  SolutionOutlined,
  CheckOutlined,
  CloseOutlined,
  FireFilled,
  ThunderboltOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function App() {
  const [notifyOn, setNotifyOn] = useState(true);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ marginTop: 0 }}>
        Ant Design 图标组件展示
      </Title>
      <Paragraph type="secondary">
        基于 antd 最新版本（v6）与 @ant-design/icons 构建。页面展示常用组件中
        涉及图标属性的用法（如 Button / Input / Tag / Statistic / Alert / Steps / Switch 等）。
      </Paragraph>

      {/* 一、图标属性与交互 */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined />
            <span>一、图标属性与交互</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={5}>大小与颜色</Title>
            <Space size="large" align="center">
              <HomeOutlined style={{ fontSize: 16, color: '#1677ff' }} />
              <HomeOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <HomeOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
              <HomeOutlined style={{ fontSize: 40, color: '#eb2f96' }} />
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Title level={5}>图标 + 文字组合</Title>
            <Space direction="vertical">
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text>操作成功</Text>
              </Space>
              <Space>
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                <Text>操作失败</Text>
              </Space>
              <Space>
                <WarningOutlined style={{ color: '#faad14' }} />
                <Text>注意风险</Text>
              </Space>
              <Space>
                <InfoCircleOutlined style={{ color: '#1677ff' }} />
                <Text>提示信息</Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 二、组件中涉及图标的用法 */}
      <Card
        title={
          <Space>
            <SettingOutlined />
            <span>二、组件中涉及图标的用法</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 24]}>
          {/* Button */}
          <Col xs={24} md={12}>
            <Title level={5}>Button</Title>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />}>
                新建
              </Button>
              <Button icon={<SearchOutlined />}>搜索</Button>
              <Button type="primary" danger icon={<DeleteOutlined />}>
                删除
              </Button>
              <Button icon={<DownloadOutlined />}>下载</Button>
              <Button icon={<UploadOutlined />} />
              <Button shape="circle" icon={<SettingOutlined />} />
            </Space>
          </Col>

          {/* Input */}
          <Col xs={24} md={12}>
            <Title level={5}>Input / Search</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input prefix={<UserOutlined />} placeholder="用户名" />
              <Input prefix={<LockOutlined />} suffix={<EyeOutlined />} placeholder="密码" />
              <Input.Search
                prefix={<SearchOutlined />}
                placeholder="带搜索图标的输入框"
                enterButton
                onSearch={(v) => message.success(`搜索：${v || '(空)'}`)}
              />
            </Space>
          </Col>

          {/* Tag + Statistic */}
          <Col xs={24} md={12}>
            <Title level={5}>Tag / Statistic</Title>
            <Space wrap>
              <Tag icon={<CheckCircleOutlined />} color="success">
                成功
              </Tag>
              <Tag icon={<CloseCircleOutlined />} color="error">
                失败
              </Tag>
              <Tag icon={<WarningOutlined />} color="warning">
                警告
              </Tag>
            </Space>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="活跃用户" value={1128} prefix={<TeamOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="收入"
                  value={9280}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="支出"
                  value={3360}
                  prefix={<FallOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Col>

          {/* Alert */}
          <Col xs={24} md={12}>
            <Title level={5}>Alert（带图标）</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert message="成功提示" type="success" showIcon icon={<CheckCircleOutlined />} />
              <Alert message="信息提示" type="info" showIcon icon={<InfoCircleOutlined />} />
              <Alert message="警告提示" type="warning" showIcon icon={<WarningOutlined />} />
              <Alert message="错误提示" type="error" showIcon icon={<CloseCircleOutlined />} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 三、导航类组件中的图标 */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined />
            <span>三、导航类组件中的图标</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={5}>Steps（图标步骤）</Title>
            <Steps
              current={1}
              items={[
                { title: '登录', icon: <UserOutlined /> },
                { title: '验证', icon: <SolutionOutlined /> },
                { title: '完成', icon: <CheckCircleOutlined /> },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Switch / 状态卡片</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={notifyOn}
                  onChange={setNotifyOn}
                />
                <Text>{notifyOn ? '已开启通知' : '已关闭通知'}</Text>
              </Space>
              <Card size="small" style={{ width: 260 }}>
                <Space>
                  <FireFilled style={{ color: '#fa541c', fontSize: 20 }} />
                  <Text strong>热门活动</Text>
                  <Tag color="orange" icon={<ThunderboltOutlined />}>
                    进行中
                  </Tag>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Card>

      <Divider />
      <Paragraph type="secondary" style={{ textAlign: 'center' }}>
        <Space>
          <GithubOutlined />
          <span>Ant Design v6 · @ant-design/icons v6 · 图标与组件示例</span>
        </Space>
      </Paragraph>
    </div>
  );
}
