#表单配置项

用于表单的基础配置，作为整个系统统一的表单项。

## API

参数 | 说明 | 类型 | 默认值
----|------|-----|------
form | form实例 | {} | -
formItemLayout | 表单布局，参照antd配置 |{}| -
formItem | 表单配置项 | {} | -

### formItem

参数 | 说明 | 类型 | 默认值
----|------|-----|------
type | 作为匹配相应组件的关键字段, 可选: `input`, `textArea`, `number`, `radio`, `checkbox`, `timePicker`, `datePicker`, `weekPicker`, `monthPicker`, `rangeMonthPicker`, `yearPicker`, `rangePicker`, `select`, `treeSelect`, `cascade`, `imgUpload`, `fileUpload`, `videoUpload`, `voiceUpload` | string | -
label | label 标签的文本 | string | -
paramName | 表单id, getFieldDecorator的id参数 | string | -
initialValue | 默认值 | any | -
required | 字段是否必填 | boolean | false
rules | 校验 | Array | `[]`
itemProps | 子组件接收属性集合，具体配置为子组件的属性配置 | object | `{}`
