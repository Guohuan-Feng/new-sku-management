import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Typography, // Typography for form title is now in DialogTitle in SKUPage
  Box,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// 初始表单数据结构，确保所有字段都在这里定义
const initialFormData = {
  vendor_sku: '', upc: '', product_name: '', status: '', ats: '', dropship_price: '', msrp: '',
  hdl_for_shipping: '', hdl_for_receiving: '', hdl_for_returning: '', storage_monthly: '',
  allow_dropship_return: '', shipping_lead_time: '', division: '', department: '', category: '',
  subcategory: '', product_class: '', group: '', subgroup: '', style: '', substyle: '', brand: '',
  model: '', color: '', size: '', gender: '', age_group: '', country_of_origin: '',
  color_code_nrf: '', color_desc: '', size_code_nrf: '', size_desc: '', manufacturer: '',
  oem: '', product_year: '', condition: '', num_prepack: '', remark: '', harmonized_code: '',
  uom: '', net_weight: '', gross_weight: '', product_height: '', product_length: '',
  product_width: '', box_height: '', box_length: '', box_width: '', qty_case: '', qty_box: '',
  material_content: '', care_instructions: '', ship_from: '', ship_to: '', ship_carrier: '',
  shipping_description: '', return_policy: '', security_privacy: '', dropship_description: '',
  title: '', short_desc: '', long_desc: '', dropship_listing_title: '',
  dropship_short_description: '', dropship_long_description: '', keywords: '',
  google_product_category: '', google_product_type: '', facebook_product_category: '',
  color_map: '', key_features_1: '', key_features_2: '', key_features_3: '', key_features_4: '',
  key_features_5: '', main_image: '', front_image: '', back_image: '', side_image: '',
  detail_image: '', full_image: '', thumbnail_image: '', size_chart_image: '', swatch_image: '',
  additional_image_1: '', additional_image_2: '', additional_image_3: '', main_video: '',
  additional_video_1: '', material_1_name: '', material_1_percentage: '', material_2_name: '',
  material_2_percentage: '', material_3_name: '', material_3_percentage: '', material_4_name: '',
  material_4_percentage: '', material_5_name: '', material_5_percentage: '',
  additional_color_1: '', additional_color_2: '',
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! 重要警告： 您必须用您完整的、包含所有102个字段的 `fieldConfigurations` 数组替换下面的骨架 !!!
// !!! 这是确保表单正确显示和工作的核心。请参考您的 "JFJP VP产品上传指南.pdf",             !!!
// !!! "字段验证.pdf", 以及您之前可能已创建的 `fieldConfig.txt` 文件。                 !!!
// !!! 确保每个字段的 name, label, isMandatory, tooltip, type, optionsName, maxLength,   !!!
// !!! inputProps (特别是 step: 1 (数字) 用于整数, "0.01" (字符串) 用于小数) 都正确无误。    !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! 重要警告： 您必须用您完整的、包含所有102个字段的 `fieldConfigurations` 数组替换下面的骨架 !!!
// !!! 这是确保表单正确显示和工作的核心。请参考您的 "JFJP VP产品上传指南.pdf",          !!!
// !!! "字段验证.pdf", 以及您之前上传的 `fieldConfig.js` 文件进行转换。                  !!!
// !!! 确保每个字段的 name, label, isMandatory, tooltip, type, optionsName, maxLength,  !!!
// !!! inputProps (特别是 step: 1 (数字) 用于整数, "0.01" (字符串) 用于小数) 都正确无误。    !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fieldConfigurations = [
  // --- 示例开始：请用您转换后的102个字段替换这里的全部内容 ---
  { name: 'vendor_sku', label: '供应商SKU (Vendor SKU)', isMandatory: true, tooltip: '产品的唯一标识符。不能特殊字符,或者0开头. 示例: APL-IP13-128BLK1', type: 'text', staticHelperText: "Unique SKU. No special chars, not starting with 0." },
  { name: 'upc', label: 'UPC通用产品代码', isMandatory: true, tooltip: '12位数字条形码. 示例: 880609123457', type: 'text', inputProps: { maxLength: 12 } },
  { name: 'product_name', label: '产品名称 (Product Name)', isMandatory: true, tooltip: '填写产品的完整英文名称. 示例: Apple iPhone 13', type: 'text', maxLength: 20 }, // 注意: 之前示例是150，根据您上传的fieldConfig.js，应该是20
  { name: 'status', label: '状态 (Status)', isMandatory: true, tooltip: '选择“1” (Active) 或 “0” (Inactive)', type: 'select', optionsName: 'statusOptions' },
  { name: 'ats', label: '可售库存 (ATS)', isMandatory: true, tooltip: '当前产品的可售数量, 必须是正整数', type: 'number', inputProps: { min: 0, step: 1 } },
  { name: 'dropship_price', label: '一件代发价格 (Dropship Price)', isMandatory: true, tooltip: '供应商给出的代发价格, 非负数. 示例: 699', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'msrp', label: '建议零售价 (MSRP$)', isMandatory: false, tooltip: '制造商建议的零售价格, 非负数. 示例: 999', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'hdl_for_shipping', label: '运输费用 ($ HDL for Shipping)', isMandatory: false, tooltip: '每个单位商品的运输费, 非负数', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'hdl_for_receiving', label: '接收费用 ($ HDL for Receiving)', isMandatory: false, tooltip: '每个单位商品的接收费用, 非负数', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'hdl_for_returning', label: '退货费用 ($ HDL for Returning)', isMandatory: false, tooltip: '每个单位商品收取的退货费用, 非负数', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'storage_monthly', label: '每月仓储费用 ($ Storage Monthly)', isMandatory: false, tooltip: '每个单位商品的月度仓储费用, 非负数', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'allow_dropship_return', label: '是否允许代发退货 (Allow Dropship Return)', isMandatory: true, tooltip: '标记产品是否允许代发退货。选择“YES”或“NO”', type: 'select', optionsName: 'yesNoOptionsBoolean' },
  { name: 'shipping_lead_time', label: '运输交货时间 (天数) (Shipping Lead Time)', isMandatory: true, tooltip: '产品从下单到发货的时间。天数, 非负整数', type: 'number', inputProps: { min: 0, step: 1 } },
  { name: 'division', label: '产品部 (Division)', isMandatory: false, tooltip: '产品所属的部门。最多50字符', type: 'text', maxLength: 50 },
  { name: 'department', label: '部门 (Department)', isMandatory: false, tooltip: '产品所属的子部门。最多50字符', type: 'text', maxLength: 50 },
  { name: 'category', label: '品类 (Category)', isMandatory: true, tooltip: '产品所属的品类(例如“Electronics”)。最多50字符. 示例: Smartphones', type: 'text', maxLength: 50 }, // 您之前的是 type: 'select', optionsName: 'categoryOptions'
  { name: 'subcategory', label: '子品类 (Subcategory)', isMandatory: false, tooltip: '更细化的分类 (例如“Smartphones”)。最多50字符. 示例: Wireless', type: 'text', maxLength: 50 },
  { name: 'product_class', label: '类别 (Class)', isMandatory: false, tooltip: '产品的类别,通常是更广泛的分类(例如“Apparel”)。最多50字符. 示例: Apparel', type: 'text', maxLength: 50 }, // 之前示例是 product_class, 您这里写的是 class
  { name: 'group', label: '组 (Group)', isMandatory: false, tooltip: '产品的组别。最多50字符. 示例: 2023 Models', type: 'text', maxLength: 50 },
  { name: 'subgroup', label: '子组 (Subgroup)', isMandatory: false, tooltip: '产品的子组别。最多50字符. 示例: Standard', type: 'text', maxLength: 50 },
  { name: 'style', label: '款式 (Style)', isMandatory: false, tooltip: '产品的款式名称。最多50字符. 示例: T-shirt', type: 'text', maxLength: 50 },
  { name: 'substyle', label: '子款式 (Substyle)', isMandatory: false, tooltip: '更细化的款式(如“V-neck”)。最多50字符. 示例: V-neck', type: 'text', maxLength: 50 },
  { name: 'brand', label: '品牌 (Brand)', isMandatory: true, tooltip: '产品的品牌名称。最多50字符. 示例: Apple', type: 'text', maxLength: 50 },
  { name: 'model', label: '型号 (Model)', isMandatory: false, tooltip: '产品的型号。最多50字符', type: 'text', maxLength: 50 },
  { name: 'color', label: '颜色 (Color)', isMandatory: true, tooltip: '产品的颜色。最多30字符', type: 'text', maxLength: 30 },
  { name: 'size', label: '尺寸 (Size)', isMandatory: true, tooltip: '产品的尺寸(如“S”、“M”、“L”)。最多20字符', type: 'text', maxLength: 20 },
  { name: 'gender', label: '性别 (Gender)', isMandatory: false, tooltip: '产品适用的性别。选择“Male”、“Female”或“Unisex”', type: 'select', optionsName: 'genderOptions' },
  { name: 'age_group', label: '年龄段 (Age Group)', isMandatory: false, tooltip: '产品适用的年龄段。选择“Adult”、“Kids”或“Baby”', type: 'select', optionsName: 'ageGroupOptions' },
  { name: 'country_of_origin', label: '原产国 (Country Of Origin)', isMandatory: true, tooltip: '产品的生产国家(如“China”、“USA”)。最多50字符. 示例: China', type: 'text', maxLength: 50 }, // 您之前的是 type: 'select', optionsName: 'countryOptions'
  { name: 'color_code_nrf', label: 'NRF颜色代码 (Color Code NRF)', isMandatory: false, tooltip: '产品颜色的标准代码。最多20字符', type: 'text', maxLength: 20 },
  { name: 'color_desc', label: '颜色描述 (Color Desc)', isMandatory: false, tooltip: '颜色的描述(例如“Bright Red”)。最多20字符', type: 'text', maxLength: 20 },
  { name: 'size_code_nrf', label: 'NRF尺寸代码 (Size Code NRF)', isMandatory: false, tooltip: '产品的尺寸代码。最多20字符', type: 'text', maxLength: 20 },
  { name: 'size_desc', label: '尺寸描述 (Size Desc)', isMandatory: false, tooltip: '尺寸的详细描述(例如“Small”)。最多20字符', type: 'text', maxLength: 20 },
  { name: 'manufacturer', label: '制造商 (Manufacturer)', isMandatory: false, tooltip: '产品的制造商。最多20字符', type: 'text', maxLength: 20 },
  { name: 'oem', label: '原始设备制造商 (OEM)', isMandatory: false, tooltip: '如果产品是由OEM生产的,请填写OEM信息。最多20字符', type: 'text', maxLength: 20 },
  { name: 'product_year', label: '生产年份 (Product Year)', isMandatory: false, tooltip: '产品的生产年份. 示例: 2023', type: 'number', inputProps:{ min: 1900, max: (new Date()).getFullYear() + 5, step: 1 } },
  { name: 'condition', label: '产品状态 (Condition)', isMandatory: true, tooltip: '产品的状态(如“New”、“Refurbished”)', type: 'select', optionsName: 'conditionOptions' },
  { name: 'num_prepack', label: '预包装数量 (# Prepack #)', isMandatory: false, tooltip: '每个包装中的产品数量, 整数', type: 'number', inputProps: { min: 0, step: 1 } }, // num_prepack in initialFormData, Prepack # in label
  { name: 'remark', label: '备注 (Remark)', isMandatory: false, tooltip: '其他需要补充的说明。最多100字符', type: 'text', multiline: true, rows: 3, maxLength: 100 },
  { name: 'harmonized_code', label: '海关编码 (Harmonized #)', isMandatory: true, tooltip: '产品的海关编码。只能包含数字和点. 示例: 8517120000', type: 'text', maxLength: 20, staticHelperText: '只能包含数字和点' }, // harmonized_code in initialFormData, Harmonized # in label
  { name: 'uom', label: '计量单位 (UOM)', isMandatory: false, tooltip: '产品的计量单位(如“Each”、“Box”)。最多10字符. 示例: Each', type: 'text', maxLength: 10 }, // 您之前的是 type: 'select', optionsName: 'uomOptions'
  { name: 'net_weight', label: '净重 (Net Weight)', isMandatory: true, tooltip: '产品的净重。请指明单位 (e.g., kg, lb). 示例: 10.5', type: 'number', inputProps: { min: 0, step: "0.01"} }, // 之前示例是 min: 0.01
  { name: 'gross_weight', label: '毛重 (Gross Weight)', isMandatory: true, tooltip: '包括包装的毛重。请指明单位 (e.g., kg, lb). 示例: 12.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'product_height', label: '产品高度 (Product Height)', isMandatory: true, tooltip: '产品的高度。请指明单位 (e.g., cm, in). 示例: 20.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'product_length', label: '产品长度 (Product Length)', isMandatory: true, tooltip: '产品的长度。请指明单位 (e.g., cm, in). 示例: 30.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'product_width', label: '产品宽度 (Product Width)', isMandatory: true, tooltip: '产品的宽度。请指明单位 (e.g., cm, in). 示例: 15.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'box_height', label: '包装盒高度 (Box Height)', isMandatory: true, tooltip: '包装盒的高度。请指明单位 (e.g., cm, in). 示例: 22.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'box_length', label: '包装盒长度 (Box Length)', isMandatory: true, tooltip: '包装盒的长度。请指明单位 (e.g., cm, in). 示例: 32.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'box_width', label: '包装盒宽度 (Box Width)', isMandatory: true, tooltip: '包装盒的宽度。请指明单位 (e.g., cm, in). 示例: 17.5', type: 'number', inputProps: { min: 0, step: "0.01" } },
  { name: 'qty_case', label: '每箱数量 (Qty/Case)', isMandatory: true, tooltip: '每箱的产品数量, 正整数', type: 'number', inputProps: { min: 1, step: 1 } },
  { name: 'qty_box', label: '每盒数量 (Qty/Box)', isMandatory: true, tooltip: '每盒的产品数量, 正整数', type: 'number', inputProps: { min: 1, step: 1 } },
  { name: 'material_content', label: '材质成分 (Material Content)', isMandatory: false, tooltip: '产品的主要材质成分。最多255字符', type: 'text', multiline: true, rows: 3, maxLength: 255 },
  { name: 'care_instructions', label: '护理说明 (Care Instructions)', isMandatory: false, tooltip: '产品的护理和清洗建议。最多100字符', type: 'text', multiline: true, rows: 3, maxLength: 100 },
  { name: 'ship_from', label: '发货地点 (Ship From)', isMandatory: false, tooltip: '产品的发货地点。最多100字符', type: 'text', maxLength: 100 },
  { name: 'ship_to', label: '送货地点 (Ship To)', isMandatory: false, tooltip: '产品的送货地点。最多255字符', type: 'text', maxLength: 255 },
  { name: 'ship_carrier', label: '运输公司 (Ship Carrier)', isMandatory: false, tooltip: '产品使用的运输公司。最多100字符', type: 'text', maxLength: 100 },
  { name: 'shipping_description', label: '运输描述 (Shipping Description)', isMandatory: true, tooltip: '产品的运输方式或特殊要求。最多100字符. 示例: 2-3 business days', type: 'text', multiline: true, rows: 3, maxLength: 100 },
  { name: 'return_policy', label: '退货政策 (Return Policy)', isMandatory: false, tooltip: '产品的退货政策。最多200字符', type: 'text', multiline: true, rows: 3, maxLength: 200 },
  { name: 'security_privacy', label: '安全隐私 (Security Privacy)', isMandatory: false, tooltip: '涉及产品的安全和隐私条款。最多200字符', type: 'text', multiline: true, rows: 3, maxLength: 200 },
  { name: 'dropship_description', label: '代发描述 (Dropship Description)', isMandatory: true, tooltip: '针对代发产品的描述。最多50字符', type: 'text', multiline: true, rows: 4, maxLength: 50 },
  { name: 'title', label: '标题 (Title)', isMandatory: true, tooltip: '产品的主标题,通常为简短的产品描述. 示例: Apple iPhone 13. 最多30字符', type: 'text', maxLength: 30 },
  { name: 'short_desc', label: '简短描述 (Short Description)', isMandatory: true, tooltip: '产品的简短描述,通常不超过2-3句话. 示例: Newest model. 最多70字符', type: 'text', multiline: true, rows: 2, maxLength: 70 },
  { name: 'long_desc', label: '详细描述 (Long Description)', isMandatory: true, tooltip: '产品的详细描述,通常包含更多产品的特性、用途、技术参数等. 示例: The latest smartphone from Apple.... 最多200字符', type: 'text', multiline: true, rows: 5, maxLength: 200 },
  { name: 'dropship_listing_title', label: '代发产品标题 (Dropship Listing Title)', isMandatory: false, tooltip: '专门为代发产品准备的标题,通常简洁且突出卖点。最多150字符. 示例: Apple iPhone 13', type: 'text', maxLength: 150 },
  { name: 'dropship_short_description', label: '代发简短描述 (Dropship Short Description)', isMandatory: false, tooltip: '代发产品的简短描述。最多255字符. 示例: Newest model', type: 'text', multiline: true, rows: 2, maxLength: 255 },
  { name: 'dropship_long_description', label: '代发详细描述 (Dropship Long Description)', isMandatory: false, tooltip: '代发产品的详细描述,提供更多产品信息。最多2000字符', type: 'text', multiline: true, rows: 5, maxLength: 2000 },
  { name: 'keywords', label: '关键词 (SEO) (Keywords)', isMandatory: true, tooltip: '用于SEO的关键词,以英文逗号分隔. 示例: Red Shoes, Fashion, Comfortable. 最多100字符', type: 'text', maxLength: 100 },
  { name: 'google_product_category', label: 'Google 产品类别 (Google Product Category)', isMandatory: false, tooltip: '根据Google的标准产品类别对产品进行分类', type: 'select', optionsName: 'googleProductCategoryOptions' },
  { name: 'google_product_type', label: 'Google 产品类型 (Google Product Type)', isMandatory: false, tooltip: '详细说明产品的类型。最多30字符. 示例: Men\'s Clothing', type: 'text', maxLength: 30 },
  { name: 'facebook_product_category', label: 'Facebook 产品类别 (Facebook Product Category)', isMandatory: false, tooltip: '用于Facebook广告和购物的产品类别', type: 'select', optionsName: 'facebookProductCategoryOptions' },
  { name: 'color_map', label: '颜色图谱 (Color Map)', isMandatory: false, tooltip: '产品的颜色图谱,主要用于展示颜色的多样性. 示例: Red, Blue, Green', type: 'select', optionsName: 'colorMapOptions' },
  { name: 'key_features_1', label: '关键特性 1 (Key Features 1)', isMandatory: true, tooltip: '产品的第一个关键特性。最多200字符', type: 'text', maxLength: 200 },
  { name: 'key_features_2', label: '关键特性 2 (Key Features 2)', isMandatory: true, tooltip: '产品的第二个关键特性。最多200字符', type: 'text', maxLength: 200 },
  { name: 'key_features_3', label: '关键特性 3 (Key Features 3)', isMandatory: true, tooltip: '产品的第三个关键特性。最多200字符', type: 'text', maxLength: 200 },
  { name: 'key_features_4', label: '关键特性 4 (Key Features 4)', isMandatory: true, tooltip: '产品的第四个关键特性。最多200字符', type: 'text', maxLength: 200 },
  { name: 'key_features_5', label: '关键特性 5 (Key Features 5)', isMandatory: true, tooltip: '产品的第五个关键特性。最多200字符', type: 'text', maxLength: 200 },
  { name: 'main_image', label: '主图链接 (Main Image)', isMandatory: true, tooltip: '产品的主要展示图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'front_image', label: '正面图链接 (Front Image)', isMandatory: true, tooltip: '产品正面的图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'back_image', label: '背面图链接 (Back Image)', isMandatory: true, tooltip: '产品背面的图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'side_image', label: '侧面图链接 (Side Image)', isMandatory: true, tooltip: '产品的侧面图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'detail_image', label: '细节图链接 (Detail Image)', isMandatory: true, tooltip: '产品的细节特写图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'full_image', label: '全图链接 (Full Image)', isMandatory: true, tooltip: '产品的全景图URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'thumbnail_image', label: '缩略图链接 (Thumbnail Image)', isMandatory: true, tooltip: '用于展示产品的小图URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'size_chart_image', label: '尺码表图链接 (Size Chart Image)', isMandatory: true, tooltip: '展示产品尺码表的图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'swatch_image', label: '色板图链接 (Swatch Image)', isMandatory: false, tooltip: '展示产品颜色的样本图URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'additional_image_1', label: '附加图像1链接 (Additional Image 1)', isMandatory: false, tooltip: '额外的产品图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'additional_image_2', label: '附加图像2链接 (Additional Image 2)', isMandatory: false, tooltip: '额外的产品图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'additional_image_3', label: '附加图像3链接 (Additional Image 3)', isMandatory: false, tooltip: '额外的产品图片URL (jpg, jpeg, png, webp)', type: 'url', staticHelperText: 'URL格式: http(s)://...jpg/jpeg/png/webp' },
  { name: 'main_video', label: '主视频链接 (Main Video)', isMandatory: false, tooltip: '展示产品的主视频URL (mp4, mov, avi, wmv, webm)', type: 'url', staticHelperText: 'URL格式: http(s)://...mp4/mov/avi/wmv/webm' },
  { name: 'additional_video_1', label: '附加视频1链接 (Additional Video 1)', isMandatory: false, tooltip: '额外的产品视频URL (mp4, mov, avi, wmv, webm)', type: 'url', staticHelperText: 'URL格式: http(s)://...mp4/mov/avi/wmv/webm' },
  { name: 'material_1_name', label: '材质1名称 (Material 1 Name)', isMandatory: false, tooltip: '产品的第一个主要材质。最多50字符. 示例: Cotton', type: 'text', maxLength: 50 },
  { name: 'material_1_percentage', label: '材质1百分比 (Material 1 Percentage)', isMandatory: false, tooltip: '产品第一个材质的百分比. 示例: 80%', type: 'text' }, // 验证模式在 validateField 中
  { name: 'material_2_name', label: '材质2名称 (Material 2 Name)', isMandatory: false, tooltip: '产品的第二个主要材质。最多50字符', type: 'text', maxLength: 50 },
  { name: 'material_2_percentage', label: '材质2百分比 (Material 2 Percentage)', isMandatory: false, tooltip: '产品第二个材质的百分比', type: 'text' },
  { name: 'material_3_name', label: '材质3名称 (Material 3 Name)', isMandatory: false, tooltip: '产品的第三个主要材质。最多50字符', type: 'text', maxLength: 50 },
  { name: 'material_3_percentage', label: '材质3百分比 (Material 3 Percentage)', isMandatory: false, tooltip: '产品第三个材质的百分比', type: 'text' },
  { name: 'material_4_name', label: '材质4名称 (Material 4 Name)', isMandatory: false, tooltip: '产品的第四个主要材质。最多50字符', type: 'text', maxLength: 50 },
  { name: 'material_4_percentage', label: '材质4百分比 (Material 4 Percentage)', isMandatory: false, tooltip: '产品第四个材质的百分比', type: 'text' },
  { name: 'material_5_name', label: '材质5名称 (Material 5 Name)', isMandatory: false, tooltip: '产品的第五个主要材质。最多50字符', type: 'text', maxLength: 50 },
  { name: 'material_5_percentage', label: '材质5百分比 (Material 5 Percentage)', isMandatory: false, tooltip: '产品第五个材质的百分比', type: 'text' },
  { name: 'additional_color_1', label: '附加颜色1 (Additional Color 1)', isMandatory: false, tooltip: '其他可选颜色。最多30字符', type: 'text', maxLength: 30 },
  { name: 'additional_color_2', label: '附加颜色2 (Additional Color 2)', isMandatory: false, tooltip: '其他可选颜色。最多30字符', type: 'text', maxLength: 30 },
  // --- 示例结束 ---
];
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! END OF CRITICAL fieldConfigurations SECTION                                         !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


const renderLabelText = (label, isMandatory) => (
  <>
    {label}
    {isMandatory && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
  </>
);

const SKUForm = ({ initialData, onSubmit, formId = "sku-form", isSubmitting }) => {
  const [formData, setFormData] = useState(() => {
    const initialSkuData = {};
    fieldConfigurations.forEach(field => {
        const defaultValue = initialFormData[field.name] !== undefined ? initialFormData[field.name] : '';
        initialSkuData[field.name] = defaultValue;
        if (field.name === 'allow_dropship_return') {
            initialSkuData[field.name] = '';
        }
    });
    return initialSkuData;
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newFormData = {};
    fieldConfigurations.forEach(field => {
        if (initialData && initialData.hasOwnProperty(field.name)) {
            if (field.name === 'allow_dropship_return') {
                newFormData[field.name] = initialData[field.name] === true ? 'true' : (initialData[field.name] === false ? 'false' : '');
            } else {
                newFormData[field.name] = initialData[field.name] !== null && initialData[field.name] !== undefined ? initialData[field.name] : '';
            }
        } else {
            newFormData[field.name] = initialFormData[field.name] !== undefined ? initialFormData[field.name] : '';
            if (field.name === 'allow_dropship_return') {
                newFormData[field.name] = '';
            }
        }
    });
    setFormData(newFormData);
    setErrors({});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let processedValue;
    const fieldConfig = fieldConfigurations.find(f => f.name === name);

    if (name === 'allow_dropship_return') {
        processedValue = value;
    } else if (type === 'checkbox') {
        processedValue = checked;
    } else {
        processedValue = value;
    }

    if (fieldConfig && fieldConfig.type === 'number') {
        if (value === '') {
            processedValue = '';
        } else {
            const isDecimalStep = fieldConfig.inputProps &&
                                  fieldConfig.inputProps.step &&
                                  typeof fieldConfig.inputProps.step === 'string' &&
                                  fieldConfig.inputProps.step.includes("0.01");
            if (isDecimalStep) {
                if (!/^\d*\.?\d*$/.test(value)) { return; }
            } else {
                if (!/^\d*$/.test(value)) { return; }
            }
        }
    }

    setFormData((prevData) => ({ ...prevData, [name]: processedValue }));
    if (errors[name]) {
        setErrors(prevErrors => ({...prevErrors, [name]: null}));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const fieldConfig = fieldConfigurations.find(f => f.name === name);
    let processedValue = value;

    if (fieldConfig && fieldConfig.type === 'number' && value.trim() !== '') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            const isDecimalStep = fieldConfig.inputProps &&
                                 fieldConfig.inputProps.step &&
                                 typeof fieldConfig.inputProps.step === 'string' &&
                                 fieldConfig.inputProps.step.includes("0.01");
            if (isDecimalStep) {
                processedValue = numValue.toFixed(2);
            } else {
                processedValue = String(Math.round(numValue));
            }
            if (fieldConfig.inputProps) {
                const min = fieldConfig.inputProps.min;
                const max = fieldConfig.inputProps.max;
                const finalNumValue = parseFloat(processedValue);
                if (typeof min !== 'undefined' && finalNumValue < min) {
                   processedValue = isDecimalStep ? Number(min).toFixed(2) : String(min);
                }
                if (typeof max !== 'undefined' && finalNumValue > max) {
                   processedValue = isDecimalStep ? Number(max).toFixed(2) : String(max);
                }
            }
        } else {
            processedValue = '';
        }
        setFormData(prevData => ({...prevData, [name]: processedValue}));
    }
    validateField(name, processedValue);
  };

  const validateField = (name, value) => {
    let error = '';
    const fieldConfig = fieldConfigurations.find(f => f.name === name);
    if (!fieldConfig) return true;

    let valToValidate = value;
    if (name !== 'allow_dropship_return' && typeof value === 'string') {
        valToValidate = value.trim();
    }

    if (fieldConfig.isMandatory) {
        if (valToValidate === '' || valToValidate === null) {
            error = `${fieldConfig.label} is required.`;
        }
    }

    if (!error && (valToValidate !== '' && valToValidate !== null)) {
        switch (fieldConfig.name) {
            case 'vendor_sku':
                if (/^[0]/.test(valToValidate)) error = 'Cannot start with 0.';
                else if (/[^a-zA-Z0-9-]/.test(valToValidate)) error = 'Cannot contain special characters (only letters, numbers, hyphens).';
                break;
            case 'upc':
                if (!/^\d{12}$/.test(valToValidate)) error = 'Must be 12 pure digits.';
                break;
            default:
                if (fieldConfig.maxLength && typeof valToValidate === 'string' && valToValidate.length > fieldConfig.maxLength) {
                    error = `Max ${fieldConfig.maxLength} characters.`;
                }
                if (fieldConfig.type === 'url' && valToValidate) {
                    try { new URL(valToValidate); } catch (_) { error = 'Invalid URL format.'; }
                }
                if (fieldConfig.type === 'number' && valToValidate) {
                    const num = parseFloat(valToValidate);
                    if (isNaN(num)) {
                        error = "Must be a valid number.";
                    } else {
                        const minVal = fieldConfig.inputProps?.min;
                        const maxVal = fieldConfig.inputProps?.max;
                        if (minVal !== undefined && num < minVal) error = `Must be at least ${minVal}.`;
                        if (maxVal !== undefined && num > maxVal) error = `Must be no more than ${maxVal}.`;

                        const isDecimalInput = typeof fieldConfig.inputProps?.step === 'string' && fieldConfig.inputProps.step.includes("0.01");
                        if (isDecimalInput) {
                            const stringValue = String(valToValidate);
                            const decimalPart = stringValue.split('.')[1];
                            if (decimalPart && decimalPart.length > 2) {
                                error = "Must have up to two decimal places.";
                            }
                        } else { // Integer check
                           if (String(valToValidate).includes('.')) { // Check if user input contains a decimal for an integer field
                                error = "Must be an integer (no decimals allowed).";
                           } else if (!Number.isInteger(parseFloat(valToValidate))) { // General integer check if not caught above
                                error = "Must be a valid integer.";
                           }
                        }
                    }
                }
                break;
        }
    }
    setErrors(prevErrors => ({...prevErrors, [name]: error || null }));
    return !error;
  };

  const internalHandleSubmit = async (event) => {
    event.preventDefault();
    let formIsValid = true;
    const currentSubmitErrors = {}; // Use a local object for errors found during this submit pass
    let firstErrorField = null;

    for (const config of fieldConfigurations) {
      if (!validateField(config.name, formData[config.name])) {
        formIsValid = false;
        // The `errors` state is updated by `validateField`, so we can read from it
        // or use a more generic message if `errors[config.name]` is somehow not yet set
        currentSubmitErrors[config.name] = errors[config.name] || `${config.label} has an error.`;
        if (!firstErrorField) {
            firstErrorField = config.name;
        }
      }
    }
    // After validating all fields, update the errors state one last time
    // to ensure all messages from this pass are displayed.
    setErrors(prev => {
        const updatedErrors = {...prev};
        fieldConfigurations.forEach(config => {
            if (currentSubmitErrors[config.name]) {
                updatedErrors[config.name] = errors[config.name] || currentSubmitErrors[config.name];
            } else {
                 // If no error was found for this field during this submit pass,
                 // ensure it's cleared in the state, especially if it was set by an earlier blur/change.
                updatedErrors[config.name] = null;
            }
        });
        return updatedErrors;
    });

    if (formIsValid) {
      const dataToSubmit = { ...formData };
      // Convert 'allow_dropship_return' back to boolean
      if (dataToSubmit.allow_dropship_return === 'true') {
        dataToSubmit.allow_dropship_return = true;
      } else if (dataToSubmit.allow_dropship_return === 'false') {
        dataToSubmit.allow_dropship_return = false;
      } else if (dataToSubmit.allow_dropship_return === ''){ // If unselected
        const allowReturnConfig = fieldConfigurations.find(f => f.name === 'allow_dropship_return');
        if(allowReturnConfig && !allowReturnConfig.isMandatory) { // If optional and unselected
            delete dataToSubmit.allow_dropship_return; // Or set to null based on API needs
        }
        // If mandatory and '', validateField should have caught it.
      }
      if (onSubmit) {
        try {
            await onSubmit(dataToSubmit); // This calls handleActualFormSubmit in SKUPage
        } catch(apiError) {
            // Error is typically handled and set in SKUPage's handleActualFormSubmit
            console.error("Error propagated to SKUForm during onSubmit:", apiError);
        }
      }
    } else {
      console.log('Form has validation errors. Check UI.');
       if (firstErrorField) {
        const errorElement = document.getElementsByName(firstErrorField)[0];
        if (errorElement) {
          errorElement.focus({ preventScroll: true });
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const labelElement = document.getElementById(`${firstErrorField}-label`);
            if (labelElement) {
                const formControl = labelElement.closest('.MuiFormControl-root');
                if (formControl) {
                    formControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const inputElement = formControl.querySelector('input, select, textarea');
                    if (inputElement) inputElement.focus({ preventScroll: true });
                } else {
                    labelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
      }
    }
  };
  
  // --- 定义下拉选项 ---
  const statusOptions = [{ value: '1', label: '1 - Active' }, { value: '0', label: '0 - Inactive' }];
  const yesNoOptionsBoolean = [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }];
  const categoryOptions = [ /* 您需要提供真实的选项 */ { value: 'Electronics', label: 'Electronics' }, { value: 'Books', label: 'Books' }, { value: 'Home Goods', label: 'Home Goods'} ];
  const countryOptions = [ /* 您需要提供真实的选项 */ { value: 'China', label: 'China' }, { value: 'USA', label: 'USA' }, { value: 'Vietnam', label: 'Vietnam'} ];
  const conditionOptions = [ /* 您需要提供真实的选项 */ { value: 'New', label: 'New' }, { value: 'Refurbished', label: 'Refurbished' }];
  const uomOptions = [ /* 您需要提供真实的选项 */ { value: 'Each', label: 'Each' }, { value: 'Box', label: 'Box' }];
  const genderOptions = [ /* 您需要提供真实的选项 */ { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Unisex', label: 'Unisex' }];
  const ageGroupOptions = [ /* 您需要提供真实的选项 */ { value: 'Adult', label: 'Adult' }, { value: 'Kids', label: 'Kids' }, { value: 'Baby', label: 'Baby' }];

  const getOptions = (optionsName) => {
    switch (optionsName) {
      case 'statusOptions': return statusOptions;
      case 'yesNoOptionsBoolean': return yesNoOptionsBoolean;
      case 'categoryOptions': return categoryOptions;
      case 'countryOptions': return countryOptions;
      case 'conditionOptions': return conditionOptions;
      case 'uomOptions': return uomOptions;
      case 'genderOptions': return genderOptions;
      case 'ageGroupOptions': return ageGroupOptions;
      default: return [];
    }
  };

  return (
    <Box component="form" id={formId} onSubmit={internalHandleSubmit} noValidate sx={{ mt: 0, pt:1 }}> {/* mt:0 for DialogContent */}
      <Grid container spacing={2}  direction="column"> {/* spacing={2} 更适合弹窗内的紧凑布局 */}
        {fieldConfigurations.map((field) => {
          const commonProps = {
            name: field.name,
            value: formData[field.name],
            onChange: handleChange,
            onBlur: handleBlur,
            error: !!errors[field.name],
            fullWidth: true,
            required: field.isMandatory,
            disabled: isSubmitting,
          };

          const labelWithTooltip = (
              <Box display="flex" alignItems="center" sx={{width: '100%'}}>
                  {renderLabelText(field.label, field.isMandatory)}
                  {field.tooltip && (
                  <Tooltip title={field.tooltip} placement="top" arrow>
                      <InfoIcon style={{ marginLeft: '5px', fontSize: '16px', color: 'action.active', cursor: 'help' }} />
                  </Tooltip>
                  )}
              </Box>
          );

          // 强制每行一个字段
          const xsValue = 12;
          const smValue = 12;
          const mdValue = 12;

          if (field.type === 'select') {
            return (
              <Grid item xs={xsValue} sm={smValue} md={mdValue} key={field.name}>
                <FormControl fullWidth required={false} error={commonProps.error}  disabled={isSubmitting}>
                  <InputLabel id={`${field.name}-label`}>{labelWithTooltip}</InputLabel>
                  <Select
                    labelId={`${field.name}-label`}
                    label={labelWithTooltip} // Material UI Select 需要这个label属性来正确显示InputLabel
                    {...commonProps}
                  >
                    {/* 对于必填的Select，除非业务逻辑允许“未选择”作为有效初始状态，否则不应提供 "None" 选项。*/}
                    {/* 对于非必填或特定允许空值的Select，可以提供 "None" */}
                    {(!field.isMandatory || ['allow_dropship_return', 'status', 'category', 'country_of_origin', 'gender', 'age_group', 'condition', 'uom'].includes(field.name) ) && <MenuItem value=""><em>None</em></MenuItem> }
                    {getOptions(field.optionsName).map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                  {errors[field.name] && <Typography color="error" variant="caption" sx={{ pl: '14px', mt: '3px' }}>{errors[field.name]}</Typography>}
                  {!errors[field.name] && field.staticHelperText && <Typography variant="caption" sx={{ pl: '14px', mt: '3px', color: 'text.secondary' }}>{field.staticHelperText}</Typography>}
                </FormControl>
              </Grid>
            );
          }

          let textFieldType = field.type === 'url' ? 'url' : 'text';
          if (field.type === 'number') {
              const isDecimalField = field.inputProps &&
                                 field.inputProps.step &&
                                 typeof field.inputProps.step === 'string' &&
                                 field.inputProps.step.includes("0.01");
              textFieldType = isDecimalField ? 'text' : 'number';
          }

          return (
            <Grid item xs={xsValue} sm={smValue} md={mdValue} key={field.name}>
              <TextField
                {...commonProps}
                label={labelWithTooltip}
                required={false} // 阻止 MUI 添加星号
                InputLabelProps={{ required: false }} // 阻止 label 内自动 * 号
                type={textFieldType}
                multiline={field.multiline || false}
                rows={field.rows || 1}
                inputProps={{ ...field.inputProps, maxLength: field.maxLength }}
                // 使用 field.staticHelperText (如果定义在fieldConfigurations中) 作为默认提示
                helperText={errors[field.name] ? errors[field.name] : (field.staticHelperText || '')}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SKUForm;