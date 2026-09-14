
模拟基础URL： https：//some.test.com

### 接口使用顺序是：
#### 1.`getConfig`获取图标配置信息
#### 2.`tags`获取标签列表
#### 3.`groups`获取分组数据
#### 4.`getIconInfo` 根据关键词搜索图标,设置topK=25、source_id=6、type=icon，tags、keyword、size、style来自图标弹窗上的选择
#### 5.`getIcon`根据图标配置和第3步收集的url获取图标文本内容


## 1. 获取配置
**GET** `/assetRepository/iconPlus/getConfig`
获取图标服务的配置信息，包括尺寸、风格、类别、颜色和文件类型等。
### 响应(getConfig.json)

## 2. 获取标签列表
**GET** `/lib-resource-service/api/resources/tags`
### 请求参数
| 参数 | 类型 | 必填 | 说明 |
| source_id | string | 是 | 来源ID |
| type | string | 是 | 当前只有值：icon |
### 响应
```json
{"items":["2.5D图标","基础图标","天气","拓扑图标","智慧图标","质感图标"]}
```

## 3. 获取分组数据
**GET** `/lib-resource-service/api/groups`
### 请求参数
| 参数 | 类型 | 必填 | 说明 |
| source_id | string | 是 | 来源ID |
| exclude_default | boolean | 是 | true |
| type | string | 是 | 当前只有值：icon |
### 响应
```json
{
  "resource_type": 3,
  "resource_type_name": "icon",
  "source_id": 6,
  "items": [
    {
      "id": 74,
      "name": "系统图标",
      "parent_id": 73,
      "level": 1,
      "real_path": "默认分组/系统图标",
      "sort_order": 0,
      "is_default": 0,
      "resource_count": 0,
      "children": [
        {
          "id": 803,
          "name": "1.0",
          "parent_id": 74,
          "level": 2,
          "real_path": "默认分组/系统图标/1.0",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 455,
          "children": []
        }
      ]
    },
    {
      "id": 76,
      "name": "业务领域图标",
      "parent_id": 73,
      "level": 1,
      "real_path": "默认分组/业务领域图标",
      "sort_order": 0,
      "is_default": 0,
      "resource_count": 0,
      "children": [
        {
          "id": 77,
          "name": "ICT产品与解决方案",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/ICT产品与解决方案",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 804,
              "name": "1.0",
              "parent_id": 77,
              "level": 3,
              "real_path": "默认分组/业务领域图标/ICT产品与解决方案/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 1187,
              "children": []
            },
            {
              "id": 805,
              "name": "2.0",
              "parent_id": 77,
              "level": 3,
              "real_path": "默认分组/业务领域图标/ICT产品与解决方案/2.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 1538,
              "children": []
            }
          ]
        },
        {
          "id": 80,
          "name": "数字能源",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/数字能源",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 806,
              "name": "1.0",
              "parent_id": 80,
              "level": 3,
              "real_path": "默认分组/业务领域图标/数字能源/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 360,
              "children": []
            },
            {
              "id": 807,
              "name": "2.0",
              "parent_id": 80,
              "level": 3,
              "real_path": "默认分组/业务领域图标/数字能源/2.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 496,
              "children": []
            }
          ]
        },
        {
          "id": 83,
          "name": "质量与流程IT",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/质量与流程IT",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 802,
              "name": "1.0",
              "parent_id": 83,
              "level": 3,
              "real_path": "默认分组/业务领域图标/质量与流程IT/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 101,
              "children": []
            },
            {
              "id": 808,
              "name": "2.0",
              "parent_id": 83,
              "level": 3,
              "real_path": "默认分组/业务领域图标/质量与流程IT/2.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 542,
              "children": []
            }
          ]
        },
        {
          "id": 87,
          "name": "华为云",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/华为云",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 809,
              "name": "1.0",
              "parent_id": 87,
              "level": 3,
              "real_path": "默认分组/业务领域图标/华为云/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 440,
              "children": []
            }
          ]
        },
        {
          "id": 89,
          "name": "终端BG",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/终端BG",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 810,
              "name": "1.0",
              "parent_id": 89,
              "level": 3,
              "real_path": "默认分组/业务领域图标/终端BG/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 15,
              "children": []
            }
          ]
        },
        {
          "id": 91,
          "name": "企业BG",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/企业BG",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 811,
              "name": "1.0",
              "parent_id": 91,
              "level": 3,
              "real_path": "默认分组/业务领域图标/企业BG/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 126,
              "children": []
            }
          ]
        },
        {
          "id": 93,
          "name": "全球技术服务部（GTS）",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/全球技术服务部（GTS）",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 814,
              "name": "1.0",
              "parent_id": 93,
              "level": 3,
              "real_path": "默认分组/业务领域图标/全球技术服务部（GTS）/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 15,
              "children": []
            },
            {
              "id": 815,
              "name": "2.0",
              "parent_id": 93,
              "level": 3,
              "real_path": "默认分组/业务领域图标/全球技术服务部（GTS）/2.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 571,
              "children": []
            }
          ]
        },
        {
          "id": 96,
          "name": "智能汽车解决方案BU",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/智能汽车解决方案BU",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 812,
              "name": "1.0",
              "parent_id": 96,
              "level": 3,
              "real_path": "默认分组/业务领域图标/智能汽车解决方案BU/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 73,
              "children": []
            }
          ]
        },
        {
          "id": 98,
          "name": "半导体",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/半导体",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 816,
              "name": "1.0",
              "parent_id": 98,
              "level": 3,
              "real_path": "默认分组/业务领域图标/半导体/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 33,
              "children": []
            },
            {
              "id": 817,
              "name": "2.0",
              "parent_id": 98,
              "level": 3,
              "real_path": "默认分组/业务领域图标/半导体/2.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 31,
              "children": []
            }
          ]
        },
        {
          "id": 101,
          "name": "Dev UI",
          "parent_id": 76,
          "level": 2,
          "real_path": "默认分组/业务领域图标/Dev UI",
          "sort_order": 0,
          "is_default": 0,
          "resource_count": 0,
          "children": [
            {
              "id": 813,
              "name": "1.0",
              "parent_id": 101,
              "level": 3,
              "real_path": "默认分组/业务领域图标/Dev UI/1.0",
              "sort_order": 0,
              "is_default": 0,
              "resource_count": 3,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

## 4. 搜索图标信息
**GET**
`/assetRepository/iconPlus/getIconInfo`
根据关键词搜索图标，返回匹配的图标列表

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
| keyword | string | 是 |  搜索关键词，支持逗号分隔批量搜索 |
| topK | number | 否 | 每个关键词返回数量，默认5 |
| source_id | number | 是 | 来源ID | 
| group_id | number | 否 | group id | 
| type | string | 是 | 当前只有值：icon |
| tags | string | 是 | 图标标签 |

### 响应
```json
[
  {
    "keyword": "文件",
    "icons": [
      {
        "icon_id": "2755",
        "name": "ic_public_word_file_textured",
        "chineseName": "文档文件_质感",
        "englishName": "word_file_textured",
        "description": [
          "文档",
          "doc",
          "文本",
          "文件"
        ],
        "category": "质感图标",
        "group": "系统图标",
        "tags": [
          "质感图标"
        ],
        "url": "/designAssets//materialServer/upload/Assets/icon/2755_24343/data/template.svg",
        "score": 0.8880099
      },
      ...
    ]
  }
]
```

## 5.获取图标
**GET** `/assetRepository/iconPlus/getIcon`
根据图标url获取图标文件内容
### 请求参数
| 参数 | 类型 | 必填 | 说明 |
| size | string | 是 | 图标尺寸，从config.size的key中选取 |
| style | string | 是 | 图标风格，从config.style的value中选取 |
| color | string | 是 | 颜色ID，从config.colors中筛选后取id |
| fileType | string | 否 | 文件类型，默认svg，可选png |
| url | string | 是 | 图标url，从getIconInfo返回结果中获取，支持逗号分隔批量获取 |
### 响应
返回json对象，包含图标ID、名称和数据。
**单个图标：**
```json
  {
    "url": "https://.....",
    "name": "ic_public_download",
    "data": "<svg>...</svg>"
  }
```
**批量获取（icon_id包含多个ID，逗号分隔）：**
```json
[
  {
    "url": "https://.....",
    "name": "ic_public_download",
    "data": "<svg>...</svg>"
  },
  {
    "url": "https://.....",
    "name": "ic_public_menu",
    "data": "<svg>...</svg>"
  }
]
```
### 响应字段说明
| 字段 | 说明 |
| icon_id | 图标ID |
| name | 图标名称 |
| data | svg文本或png的base64编码字符串 |