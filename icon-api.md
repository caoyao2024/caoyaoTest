基础URL： https：//some.test.com

## 1.搜索图标信息
**GET** `/iconPlus/getIconInfo`
根据关键词搜索图标，返回匹配的图标列表
### 请求参数
| 参数 | 类型 | 必填 | 说明 |
| keyword | string | 是 | 搜索关键词，支持逗号分隔批量搜索 |
| topK | number | 否 | 每个关键词返回数量，默认5 |
| category | string | 否 | 图标类别，与keyword拼接为‘category_keyword’搜索 |
### 响应
```json
[
  {
    "keyword": "下载",
    "icons": [
      "icon_id": "123",
      "name": "ic_public_download",
      "englishName": "download",
      "category": "基础图标",
      "group": "通用"
    ]
  }
]
```
### 响应字段说明
| 字段 | 说明 |
| icon_id | 图标唯一标识，用于获取svg |
| name | 图标名称 |
| englishName | 英文名称 |
| category | 图标类别 |
| group | 图标分组 |


## 2. 获取配置

**GET** `/iconPlus/getConfig`

获取图标服务的配置信息，包括尺寸、风格、类别、颜色和文件类型等。

### 响应

```json
{
  "size": [
    { "key": "16", "value": "16" },
    { "key": "24", "value": "24" },
    { "key": "32", "value": "32" }
  ],
  "style": [
    { "key": "line", "value": "线性" },
    { "key": "filled", "value": "面性" }
  ],
  "category": [
    { "key": "basic", "value": "基础图标" },
    { "key": "system", "value": "系统图标" }
  ],
  "colors": [
    { "id": "GTS_线性_Blue-5", "key": "Blue-5", "value": "#007DFF", "domain": "GTS", "type": "linear", "style": "线性" }
  ],
  "fileType": [
    { "key": "svg", "value": "svg" },
    { "key": "png", "value": "png" }
  ]
}
```


## 3.获取图标
**GET** `/iconPlus/getSvg`
根据图标ID获取图标文件内容
### 请求参数
| 参数 | 类型 | 必填 | 说明 |
| icon_id | string | 是 | 图标ID，支持逗号分隔批量获取 |
| size | string | 是 | 图标尺寸，从config.size的key中选取 |
| style | string | 是 | 图标风格，从config.style的value中选取 |
| size | string | 是 | 颜色ID，从config.colors中筛选后取id |
| fileType | string | 否 | 文件类型，默认svg，可选png |
### 响应
返回json对象，包含图标ID、名称和数据。
**单个图标：**
```json
  {
    "icon_id": "123",
    "name": "ic_public_download",
    "data": "<svg>...</svg>"
  }
```
**批量获取（icon_id包含多个ID，逗号分隔）：**
```json
[
  {
    "icon_id": "123",
    "name": "ic_public_download",
    "data": "<svg>...</svg>"
  },
  {
    "icon_id": "456",
    "name": "ic_public_upload",
    "data": "<svg>...</svg>"
  }
]
```
### 响应字段说明
| 字段 | 说明 |
| icon_id | 图标ID |
| name | 图标名称 |
| data | svg文本或png的base64编码字符串 |