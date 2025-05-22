// src/components/fieldConfig.js

// --- 辅助数据和枚举 ---
const googleProductCategoryOptions = [
    { value: "Animals & Pet Supplies", label: "Animals & Pet Supplies" },
    { value: "Apparel & Accessories", label: "Apparel & Accessories" },
    { value: "Arts & Entertainment", label: "Arts & Entertainment" },
    // ... 更多选项来自您的业务定义或Google的完整列表
  ];
  
  const facebookProductCategoryOptions = [
   { value: "APPAREL_AND_ACCESSORIES", label: "Apparel & Accessories" },
   { value: "BABY_AND_KIDS", label: "Baby & Kids" },
   // ... 更多选项来自您的业务定义或Facebook的完整列表
  ];
  
  const colorMapOptions = [
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
    { value: "Green", label: "Green" },
    // ... 更多选项
  ];
  
  // 根据 "字段验证.pdf" (Source 388)
  const strictLimitedStrPattern = /^[a-zA-Z0-9-]*$/;
  const noLeadingZeroAndNoSpecialCharsPattern = /^[a-zA-Z1-9][a-zA-Z0-9-]*$/; // SKU特定模式
  const generalTextPattern = /^[\x00-\x7F]*$/; // 允许基本ASCII字符，防止恶意Unicode，可根据需要放宽
  const commonTextPattern = /^[^\s]+(\s+[^\s]+)*$/; // 用于不允许纯空格或首尾空格的常规文本
  const urlPattern = /^https?:\/\/.+/i;
  const imageUrlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i;
  const videoUrlPattern = /^https?:\/\/.*\.(mp4|mov|avi|wmv|webm)$/i;
  
  
  export const fieldsConfig = [
    {
      name: 'Vendor SKU',
      label: '供应商SKU', // Source: 400
      type: 'text',
      isMandatory: true, // Source: 440 (CSV), 400 (PDF Guide "必填")
      validation: {
        requiredMsg: '供应商SKU不能为空',
        pattern: noLeadingZeroAndNoSpecialCharsPattern, // Source: 388 (字段验证: 不含特殊字符,不以0开头), 400 (PDF Guide "不能特殊字符, 或者0开头")
        patternMsg: 'SKU格式不正确 (不能以0开头或包含特殊字符, 仅允许字母、数字、连字符)',
      },
      description: '产品的唯一标识符。请输入您的产品SKU编号,确保该编号在您的库存中唯一。', // Source: 400
      example: 'APL-IP13-128BLK1', // Source: 400
    },
    {
      name: 'UPC',
      label: 'UPC通用产品代码', // Source: 400
      type: 'text',
      isMandatory: true, // Source: 440 (CSV), 400 (PDF Guide "必填")
      validation: {
        requiredMsg: 'UPC不能为空',
        pattern: /^\d{12}$/, // Source: 388 (字段验证: 12位纯数字)
        patternMsg: 'UPC必须是12位数字',
        maxLength: 12,
      },
      description: '12位数字条形码,用于全球产品标识。', // Source: 400
      example: '880609123457', // Source: 400
    },
    {
      name: 'Product Name',
      label: '产品名称', // Source: 400
      type: 'text',
      isMandatory: true, // Source: 440 (CSV), 400 (PDF Guide "必填")
      validation: {
        requiredMsg: '产品名称不能为空',
        maxLength: 20, // Source: 388 (字段验证: limited_str(20))
        maxLengthMsg: '产品名称不能超过20个字符',
        // pattern: strictLimitedStrPattern, // Source: 388 (字段验证: limited_str pattern) - 注意，这个 pattern 不允许空格
        // 考虑到产品名称通常包含空格，我们使用更通用的模式，并依赖maxLength
        pattern: commonTextPattern,
        patternMsg: '产品名称包含无效字符或纯空格',
      },
      description: '产品的完整名称。请填写产品的完整英文名称,包含品牌、型号等关键信息。', // Source: 400
      example: 'Apple iPhone 13', // Source: 401
    },
    {
      name: 'Status',
      label: '状态', // Source: 401
      type: 'select',
      isMandatory: true, // Source: 440 (CSV), 401 (PDF Guide "必填")
      options: [
        { value: 1, label: '可用 (Active / 1)' }, // Source: 389 (字段验证: 必须是1或0)
        { value: 0, label: '不可用 (Inactive / 0)' },
      ],
      defaultValue: 1,
      validation: {
        requiredMsg: '产品状态不能为空',
      },
      description: '产品的当前状态。选择“0”或“1”。', // Source: 401
    },
    {
      name: 'ATS',
      label: '可售库存 (ATS)', // Source: 402
      type: 'number',
      isMandatory: true, // Source: 440 (CSV), 402 (PDF Guide "必填")
      validation: {
        requiredMsg: '可售数量不能为空',
        min: 0, // Source: 389 (字段验证: gt=0, 正整数)
        minMsg: '可售数量不能为负数',
        pattern: /^\d+$/,
        patternMsg: '可售数量必须是正整数',
      },
      description: '当前产品的可售数量。请输入实际库存数量。', // Source: 402
    },
    {
      name: 'Dropship Price',
      label: '一件代发价格', // Source: 402
      type: 'number',
      isMandatory: true, // Source: 440 (CSV), 402 (PDF Guide "必填项")
      isFee: true, // 表示是费用，需要两位小数
      validation: {
        requiredMsg: '代发价格不能为空',
        min: 0, // Source: 389 (字段验证: ge=0, 非负数)
        minMsg: '价格不能为负数',
        // 前端InputNumber组件通过precision=2处理小数位
      },
      description: '供应商给出的代发价格(每个单位的价格)。请输入代发价格,确保符合您的销售策略。', // Source: 402
      example: '699', // Source: 404
    },
    {
      name: 'MSRP$',
      label: '建议零售价 (MSRP)', // Source: 405
      type: 'number',
      isMandatory: false, // Source: 440 (CSV "选填")
      isFee: true,
      validation: {
        min: 0, // Source: 389 (字段验证: ge=0)
        minMsg: '价格不能为负数',
      },
      description: '制造商建议的零售价格。请输入建议零售价。', // Source: 405
      example: '999', // Source: 406
    },
    {
      name: '$ HDL for Shipping',
      label: '运输费用', // Source: 407
      type: 'number',
      isMandatory: false, // Source: 440 (CSV 标记为"必填（需要探讨）", 但指南为"选填")，暂定选填
      isFee: true,
      validation: {
        min: 0, // Source: 389 (字段验证: ge=0)
        minMsg: '费用不能为负数',
      },
      description: '每个单位商品的运输费。请输入每个单位商品的运输费用。', // Source: 407
    },
    {
      name: '$ HDL for Receiving',
      label: '接收费用', // Source: 407
      type: 'number',
      isMandatory: false, // Source: 440 (CSV "???" ), Guide "不填???"
      isFee: true,
      validation: {
        min: 0, // Source: 389 (字段验证: ge=0)
        minMsg: '费用不能为负数',
      },
      description: '每个单位商品的接收费用。请输入每个单位商品的接收费用。', // Source: 407
    },
    {
      name: '$ HDL for Returning',
      label: '退货费用', // Source: 408
      type: 'number',
      isMandatory: false, // Source: 440 (CSV "???" ), Guide "应用场景???"
      isFee: true,
      validation: {
        min: 0, // Source: 390 (字段验证: ge=0)
        minMsg: '费用不能为负数',
      },
      description: '对每个单位商品收取的退货费用。请输入退货费用。', // Source: 408
    },
    {
      name: '$ Storage Monthly',
      label: '每月仓储费用', // Source: 408
      type: 'number',
      isMandatory: false, // Source: 440 (CSV "???" ), Guide "不填?????"
      isFee: true,
      validation: {
        min: 0, // Source: 390 (字段验证: ge=0)
        minMsg: '费用不能为负数',
      },
      description: '每个单位商品的月度仓储费用。请输入每个单位商品的月度仓储费用。', // Source: 408
    },
    {
      name: 'Allow Dropship Return',
      label: '是否允许代发退货', // Source: 408
      type: 'select',
      isMandatory: true, // Source: 440 (CSV "有条件的情况下准许"), 408 (PDF Guide "必填项?????") - 设定为必填
      options: [
          { value: true, label: '是 (Yes)' }, // Source: 390 (字段验证: bool), 408 (PDF Guide "选择 YES 或 NO")
          { value: false, label: '否 (No)' },
      ],
      defaultValue: false,
      validation: {
          requiredMsg: '请选择是否允许代发退货',
      },
      description: '标记产品是否允许代发退货。', // Source: 408
    },
    {
      name: 'Shipping Lead Time',
      label: '运输交货时间 (天数)', // Source: 409
      type: 'number', // 改为number以匹配字段验证中的ge=0
      isMandatory: true, // Source: 440 (CSV), 409 (PDF Guide "必填")
      validation: {
        requiredMsg: '运输交货时间不能为空',
        min: 0, // Source: 390 (字段验证: ge=0)
        minMsg: '运输交货时间不能为负数',
        pattern: /^\d+$/,
        patternMsg: '请输入有效的天数',
      },
      description: '产品从下单到发货的时间（天数）。', // Source: 390, 409
    },
    {
      name: 'Division',
      label: '产品部 (Division)', // Source: 409
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "不填"), 409 (PDF Guide "不填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品所属的部门。', // Source: 409
    },
    {
      name: 'Department',
      label: '部门 (Department)', // Source: 409
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "不填"), 409 (PDF Guide "不填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品所属的子部门。', // Source: 409
    },
    {
      name: 'Category',
      label: '品类', // Source: 409
      type: 'text', //  PDF Guide "做下拉选项", 但 字段验证.pdf 是 CategoryEnum, 选项未知, 暂定text
      isMandatory: true, // Source: 440 (CSV), 409 (PDF Guide "必填项")
      validation: {
        requiredMsg: '品类不能为空',
        maxLength: 50, // Source: 390 (字段类型 CategoryEnum, 假设其背后string有长度限制)
        pattern: generalTextPattern,
        maxLengthMsg: '品类不能超过50字符',
      },
      description: '产品所属的品类 (例如“Electronics”)。选择产品的主要类别。', // Source: 409
      example: 'Smartphones', // Source: 390
    },
    {
      name: 'Subcategory',
      label: '子品类', // Source: 410
      type: 'text', // PDF Guide "做下拉选项", 但 字段验证.pdf 是 SubCategoryEnum, 选项未知, 暂定text
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 50, // Source: 390 (字段类型 SubCategoryEnum)
        pattern: generalTextPattern,
        maxLengthMsg: '子品类不能超过50字符',
      },
      description: '更细化的分类 (例如“Smartphones”)。请输入子品类名称。', // Source: 410
      example: 'Wireless', // Source: 390
    },
    {
      name: 'Class',
      label: '类别 (Class)', // Source: 410
      type: 'text', // 字段验证.pdf 是 ProductClassEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的类别,通常是更广泛的分类(例如“Apparel”)。选择产品所属的类别。', // Source: 410
      example: 'Apparel', // Source: 390
    },
    {
      name: 'Group',
      label: '组 (Group)', // Source: 411
      type: 'text', // 字段验证.pdf 是 GroupEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的组别。选择适当的组别。', // Source: 411
      example: '2023 Models', // Source: 391
    },
    {
      name: 'Subgroup',
      label: '子组 (Subgroup)', // Source: 411
      type: 'text', // 字段验证.pdf 是 SubGroupEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的子组别。填写产品的子组名称。', // Source: 411
      example: 'Standard', // Source: 391
    },
    {
      name: 'Style',
      label: '款式', // Source: 412
      type: 'text', // 字段验证.pdf 是 StyleEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的款式名称。填写产品款式(如“T-shirt”)。', // Source: 412
      example: 'T-shirt', // Source: 391
    },
    {
      name: 'Substyle',
      label: '子款式', // Source: 412
      type: 'text', // 字段验证.pdf 是 SubStyleEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '更细化的款式(如“V-neck”)。填写产品的子款式。', // Source: 412
      example: 'V-neck', // Source: 391
    },
    {
      name: 'Brand',
      label: '品牌', // Source: 412
      type: 'text', // 字段验证.pdf 是 BrandEnum
      isMandatory: true, // Source: 440 (CSV), 虽然指南中是选填，但品牌通常很重要，CSV标为必填
      validation: {
        requiredMsg: '品牌不能为空',
        maxLength: 50,
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过50字符',
      },
      description: '产品的品牌名称。填写品牌名称。', // Source: 412
      example: 'Apple', // Source: 391
    },
    {
      name: 'Model',
      label: '型号', // Source: 413
      type: 'text', // 字段验证.pdf 是 ModelEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的型号。填写产品的型号。', // Source: 413
    },
    {
      name: 'Color',
      label: '颜色', // Source: 413
      type: 'text', // 字段验证.pdf 是 ColorEnum
      isMandatory: true, // Source: 440 (CSV), 虽然指南中是选填，但颜色通常很重要，CSV标为必填
      validation: {
        requiredMsg: '颜色不能为空',
        maxLength: 30,
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过30字符',
      },
      description: '产品的颜色。填写颜色名称(如“Red”)。', // Source: 413
    },
    {
      name: 'Size',
      label: '尺寸', // Source: 413
      type: 'text', // 字段验证.pdf 是 SizeEnum
      isMandatory: true, // Source: 440 (CSV), 指南中提问是否必填，CSV标为必填
      validation: {
        requiredMsg: '尺寸不能为空',
        maxLength: 20,
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过20字符',
      },
      description: '产品的尺寸(如“S”、“M”、“L”)。填写产品尺寸。', // Source: 413
    },
    {
      name: 'Gender',
      label: '性别', // Source: 413
      type: 'select', // Source: 392 (字段验证: GenderEnum)
      isMandatory: false, // Source: 440 (CSV "选填")
      options: [
          { value: 'Male', label: '男 (Male)' }, // Source: 413
          { value: 'Female', label: '女 (Female)' },
          { value: 'Unisex', label: '中性 (Unisex)' },
      ],
      description: '产品适用的性别。选择“Male”、“Female”或“Unisex”。', // Source: 413
    },
    {
      name: 'Age Group',
      label: '年龄段', // Source: 413
      type: 'select', // Source: 392 (字段验证: AgeGroupEnum)
      isMandatory: false, // Source: 440 (CSV "选填")
       options: [
          { value: 'Adult', label: '成人 (Adult)' }, // Source: 413
          { value: 'Kids', label: '儿童 (Kids)' },
          { value: 'Baby', label: '婴儿 (Baby)' }, // 现有 fieldConfig 中是 Infant
          { value: 'All Ages', label: '所有年龄 (All Ages)' },
      ],
      description: '产品适用的年龄段。选择“Adult”、“Kids”或“Baby”。', // Source: 413
    },
    {
      name: 'Country Of Origin',
      label: '原产国', // Source: 413
      type: 'text', //  字段验证.pdf 是 CountryOfRegionEnum
      isMandatory: true, // Source: 440 (CSV), 413 (PDF Guide "必填")
      validation: {
        requiredMsg: '原产国不能为空',
        maxLength: 50,
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过50字符',
      },
      description: '产品的生产国家。填写产品的生产国(如“China”、“USA”)。', // Source: 413
      example: 'China', // Source: 392
    },
    {
      name: 'Color Code NRF',
      label: 'NRF颜色代码', // Source: 413
      type: 'text', //  字段验证.pdf 是 ColorCodeNRFEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 20, // Source: 392 (字段验证.pdf limited_str(20) for color_desc, 假设code类似)
        pattern: strictLimitedStrPattern, // 假设颜色代码也严格
        maxLengthMsg: 'NRF颜色代码不能超过20字符',
      },
      description: '产品颜色的标准代码。填写颜色代码(如“RED”)。', // Source: 413
    },
    {
      name: 'Color Desc',
      label: '颜色描述', // Source: 414
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 20, // Source: 392 (字段验证.pdf limited_str(20))
        pattern: generalTextPattern, // 描述通常允许空格
        maxLengthMsg: '颜色描述不能超过20字符',
      },
      description: '颜色的描述(例如“Bright Red”)。填写颜色的描述。', // Source: 414
    },
    {
      name: 'Size Code NRF',
      label: 'NRF尺寸代码', // Source: 414
      type: 'text', // 字段验证.pdf 是 SizeCodeNRFEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 20, // Source: 392 (字段验证.pdf limited_str(20) for size_desc, 假设code类似)
        pattern: strictLimitedStrPattern, // 假设尺码代码也严格
        maxLengthMsg: 'NRF尺码代码不能超过20字符',
      },
      description: '产品的尺寸代码。填写尺寸代码(如“SM”)。', // Source: 414
    },
    {
      name: 'Size Desc',
      label: '尺寸描述', // Source: 414
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 20, // Source: 392 (字段验证.pdf limited_str(20))
        pattern: generalTextPattern, // 描述通常允许空格
        maxLengthMsg: '尺寸描述不能超过20字符',
      },
      description: '尺寸的详细描述(例如“Small”)。填写尺寸的描述。', // Source: 414
    },
    {
      name: 'Manufacturer',
      label: '制造商', // Source: 414
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 20, // Source: 393 (字段验证.pdf limited_str(20))
        pattern: generalTextPattern,
        maxLengthMsg: '制造商名称不能超过20字符',
      },
      description: '产品的制造商。填写制造商名称。', // Source: 414
    },
    {
      name: 'OEM',
      label: '原始设备制造商 (OEM)', // Source: 414
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 20, // Source: 393 (字段验证.pdf limited_str(20))
        pattern: generalTextPattern,
        maxLengthMsg: 'OEM名称不能超过20字符',
      },
      description: '如果产品是由OEM生产的,请填写OEM信息。填写OEM名称。', // Source: 414
    },
    {
      name: 'Product Year',
      label: '生产年份', // Source: 414
      type: 'number', // 字段验证.pdf 是 date，但指南是年份，且 SKUForm.jsx 当前是 number. 保持 number for YYYY
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
          pattern: /^\d{4}$/, // Source: 393 (字段验证.pdf YYYY-MM-DD, 但这里仅年份)
          patternMsg: '请输入4位年份 (例如: 2023)',
          min: 1900,
          max: new Date().getFullYear() + 5,
          minMsg: '年份不正确',
          maxMsg: '年份不正确',
      },
      description: '产品的生产年份。填写产品的生产年份。', // Source: 414
    },
    {
      name: 'Condition',
      label: '产品状态', // Source: 414 (指南也叫 Condition)
      type: 'select', // Source: 393 (字段验证: ConditionEnum), 414 (PDF Guide: "需要做下拉选项")
      isMandatory: true, // Source: 440 (CSV "必填")
      options: [
          { value: 'New', label: '全新 (New)' },
          { value: 'Used', label: '二手 (Used)' },
          { value: 'Refurbished', label: '翻新 (Refurbished)' },
      ],
      defaultValue: 'New',
      validation: {
          requiredMsg: '产品状态不能为空',
      },
      description: '产品的状态(如“New”、“Refurbished”)。选择产品的状态。', // Source: 414
    },
    {
      name: 'Prepack #',
      label: '预包装数量 (#)', // Source: 414
      type: 'number', // 字段验证.pdf 是 int
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        min: 0, // 假设不能为负
        pattern: /^\d*$/, // 允许空或整数
        patternMsg: '请输入有效的数量',
      },
      description: '每个包装中的产品数量。', // Source: 414
    },
    {
      name: 'Remark',
      label: '备注', // Source: 414
      type: 'textarea',
      isMandatory: false, // Source: 440 (CSV "选填")
      rows: 3,
      validation: {
        maxLength: 100, // Source: 393 (字段验证.pdf limited_str(100))
        pattern: generalTextPattern, // 备注允许更多字符
        maxLengthMsg: '备注不能超过100字符',
      },
      description: '其他需要补充的说明。填写任何附加信息。', // Source: 414
    },
    {
      name: 'Harmonized #',
      label: '海关编码 (Harmonized #)', // Source: 414
      type: 'text', // 字段验证.pdf 是 HarmonizedEnum
      isMandatory: true, // Source: 440 (CSV "必填"), 414 (PDF Guide "考虑必填项")
      validation: {
        requiredMsg: '海关编码不能为空',
        maxLength: 20, // 现有配置
        pattern: /^[0-9.]+$/, // 现有配置
        patternMsg: '只能包含数字和点',
      },
      description: '产品的海关编码。填写产品的海关编码。', // Source: 414
      example: '8517120000', // Source: 416
    },
    {
      name: 'UOM',
      label: '计量单位 (UOM)', // Source: 417
      type: 'text', // 字段验证.pdf 是 UOMEnum, 指南 "是否需要下拉选项"
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 10,
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过10字符',
      },
      description: '产品的计量单位(如“Each”、“Box”)。选择适当的计量单位。', // Source: 417
      example: 'Each', // Source: 394
    },
    {
      name: 'Net Weight',
      label: '净重', // Source: 417
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '净重不能为空',
        min: 0, // Source: 394 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的重量 (例如: 10.5)',
      },
      description: '产品的净重。填写产品的净重。请指明单位 (e.g., kg, lb)。', // Source: 417, 476
    },
    {
      name: 'Gross Weight',
      label: '毛重', // Source: 417
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '毛重不能为空',
        min: 0, // Source: 394 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的重量 (例如: 12.5)',
      },
      description: '包括包装的毛重。填写毛重。请指明单位 (e.g., kg, lb)。', // Source: 417, 477
    },
    {
      name: 'Product Height',
      label: '产品高度', // Source: 417
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '产品高度不能为空',
        min: 0, // Source: 394 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的高度 (例如: 20.5)',
      },
      description: '产品的高度。填写产品的高度。请指明单位 (e.g., cm, in)。', // Source: 417, 477
    },
    {
      name: 'Product Length',
      label: '产品长度', // Source: 417
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '产品长度不能为空',
        min: 0, // Source: 394 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的长度 (例如: 30.5)',
      },
      description: '产品的长度。填写产品的长度。请指明单位 (e.g., cm, in)。', // Source: 417, 478
    },
    {
      name: 'Product Width',
      label: '产品宽度', // Source: 417
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '产品宽度不能为空',
        min: 0, // Source: 394 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的宽度 (例如: 15.5)',
      },
      description: '产品的宽度。填写产品的宽度。请指明单位 (e.g., cm, in)。', // Source: 417, 479
    },
    {
      name: 'Box Height',
      label: '包装盒高度', // Source: 418
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '包装盒高度不能为空',
        min: 0, // Source: 394 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的高度 (例如: 22.5)',
      },
      description: '包装盒的高度。填写包装盒的高度。请指明单位 (e.g., cm, in)。', // Source: 418, 479
    },
    {
      name: 'Box Length',
      label: '包装盒长度', // Source: 418
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '包装盒长度不能为空',
        min: 0, // Source: 395 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的长度 (例如: 32.5)',
      },
      description: '包装盒的长度。填写包装盒的长度。请指明单位 (e.g., cm, in)。', // Source: 418, 480
    },
    {
      name: 'Box Width',
      label: '包装盒宽度', // Source: 418
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '包装盒宽度不能为空',
        min: 0, // Source: 395 (字段验证: gt=0, 正数)
        pattern: /^\d+(\.\d+)?$/,
        patternMsg: '请输入有效的宽度 (例如: 17.5)',
      },
      description: '包装盒的宽度。填写包装盒的宽度。请指明单位 (e.g., cm, in)。', // Source: 418, 481
    },
    {
      name: 'Qty/Case',
      label: '每箱数量', // Source: 418
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '每箱数量不能为空',
        min: 1, // Source: 395 (字段验证: gt=0, 正整数)
        pattern: /^\d+$/,
        patternMsg: '请输入正整数',
      },
      description: '每箱的产品数量。填写每箱的数量。', // Source: 418
    },
    {
      name: 'Qty/Box',
      label: '每盒数量', // Source: 418
      type: 'number',
      isMandatory: true, // Source: 440 (CSV "必填")
      validation: {
        requiredMsg: '每盒数量不能为空',
        min: 1, // Source: 395 (字段验证: gt=0, 正整数)
        pattern: /^\d+$/,
        patternMsg: '请输入正整数',
      },
      description: '每盒的产品数量。填写每盒的数量。', // Source: 418
    },
    {
      name: 'Material Content',
      label: '材质成分', // Source: 418
      type: 'textarea', // 字段验证.pdf 是 MaterialContentEnum
      isMandatory: false, // Source: 440 (CSV "选填")
      rows: 3,
      validation: {
        maxLength: 255, // 现有配置
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过255字符',
      },
      description: '产品的主要材质成分。描述产品的材质成分。', // Source: 418
    },
    {
      name: 'Care Instructions',
      label: '护理说明', // Source: 418
      type: 'textarea',
      isMandatory: false, // Source: 440 (CSV "选填")
      rows: 3,
      validation: {
        maxLength: 100, // Source: 395 (字段验证.pdf limited_str(100))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过100字符',
      },
      description: '产品的护理和清洗建议。填写产品的护理说明。', // Source: 418, 419
    },
    {
      name: 'Ship From',
      label: '发货地点', // Source: 419
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "不填"), 419 (PDF Guide "不填")
      validation: { maxLength: 100, pattern: generalTextPattern, maxLengthMsg: '不能超过100字符' },
      description: '产品的发货地点。填写发货地点。', // Source: 419
    },
    {
      name: 'Ship To',
      label: '送货地点', // Source: 419
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "待定"), 419 (PDF Guide "不填")
      validation: { maxLength: 255, pattern: generalTextPattern, maxLengthMsg: '不能超过255字符' },
      description: '产品的送货地点。填写送货地点。', // Source: 419
    },
    {
      name: 'Ship Carrier',
      label: '运输公司', // Source: 419
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "待定"), 419 (PDF Guide "不填")
      validation: { maxLength: 100, pattern: generalTextPattern, maxLengthMsg: '不能超过100字符' },
      description: '产品使用的运输公司。填写运输公司名称。', // Source: 419
    },
    {
      name: 'Shipping Description',
      label: '运输描述', // Source: 420
      type: 'textarea',
      isMandatory: true, // Source: 440 (CSV "必填"), 指南 "常用"
      rows: 3,
      validation: {
        requiredMsg: '运输描述不能为空',
        maxLength: 100, // Source: 396 (字段验证.pdf ship_desc limited_str(100))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过100字符',
      },
      description: '产品的运输方式或特殊要求。填写运输描述。', // Source: 420
      example: '2-3 business days', // Source: 420
    },
    {
      name: 'Return Policy',
      label: '退货政策', // Source: 420
      type: 'textarea',
      isMandatory: false, // Source: 440 (CSV "选填"), 指南 "重点由JFJP制定?"
      rows: 3,
      validation: {
        maxLength: 200, // Source: 396 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '产品的退货政策。填写退货政策。', // Source: 420
      example: 'Typically, an advance refund will be issued within 24 hours...', // Source: 420
    },
    {
      name: 'Security Privacy',
      label: '安全隐私', // Source: 423
      type: 'textarea',
      isMandatory: false, // Source: 440 (CSV "待定"), 指南 "常用"
      rows: 3,
      validation: {
        maxLength: 200, // Source: 396 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '涉及产品的安全和隐私条款。填写相关的安全隐私条款。', // Source: 423
      example: 'Advanced facial recognition, fingerprint sensor...', // Source: 423
    },
    {
      name: 'Dropship Description',
      label: '代发描述', // Source: 423
      type: 'textarea',
      isMandatory: true, // Source: 440 (CSV "必填")
      rows: 4,
      validation: {
        requiredMsg: '代发描述不能为空',
        maxLength: 50, // Source: 396 (字段验证.pdf limited_str(50))
        pattern: generalTextPattern,
        maxLengthMsg: '代发描述不能超过50字符',
      },
      description: '针对代发产品的描述。填写代发产品的描述。', // Source: 423
      example: 'High-end smartphone with the latest features...', // Source: 424
    },
    {
      name: 'Title',
      label: '标题', // Source: 426
      type: 'text',
      isMandatory: true, // Source: 440 (CSV), 426 (PDF Guide "必填项")
      validation: {
        requiredMsg: "标题不能为空",
        maxLength: 30, // Source: 396 (字段验证.pdf limited_str(30))
        pattern: commonTextPattern,
        maxLengthMsg: '标题不能超过30个字符',
      },
      description: '产品的主标题,通常为简短的产品描述。请填写简洁明了的产品标题,包含主要特征(如品牌、型号、类型等)。', // Source: 426
      example: 'Apple iPhone 13', // Source: 427
    },
    {
      name: 'Short Description',
      label: '简短描述', // Source: 428
      type: 'textarea',
      isMandatory: true, // Source: 440 (CSV "必填"), 428 (PDF Guide "必填项")
      rows: 2,
      validation: {
        requiredMsg: '简短描述不能为空',
        maxLength: 70, // Source: 396 (字段验证.pdf limited_str(70))
        pattern: generalTextPattern,
        maxLengthMsg: '简短描述不能超过70个字符',
      },
      description: '产品的简短描述,通常不超过2-3句话。用简洁的语言描述产品的主要特点。', // Source: 428
      example: 'Newest model', // Source: 429
    },
    {
      name: 'Long Description',
      label: '详细描述', // Source: 430
      type: 'textarea',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 430 (PDF Guide "必填项")
      rows: 5,
      validation: {
        requiredMsg: "详细描述不能为空",
        maxLength: 200, // Source: 397 (字段验证.pdf limited_str(200))
        // pattern: generalTextPattern, // 详细描述可能包含更丰富格式
        maxLengthMsg: '详细描述不能超过200个字符',
      },
      description: '产品的详细描述,通常包含更多产品的特性、用途、技术参数等。详细描述产品,包括其功能、适用场合、特色等,方便消费者了解产品。', // Source: 430
      example: 'The latest smartphone from Apple...', // Source: 430
    },
    {
      name: 'Dropship Listing Title',
      label: '代发产品标题', // Source: 431
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "待定")
      validation: { maxLength: 150, pattern: commonTextPattern, maxLengthMsg: '不能超过150字符' },
      description: '专门为代发产品准备的标题,通常简洁且突出卖点。请填写为代发产品专门设计的标题。', // Source: 431
      example: 'Apple iPhone 13', // Source: 431
    },
    {
      name: 'Dropship Short Description',
      label: '代发简短描述', // Source: 431
      type: 'textarea',
      isMandatory: false, // Source: 440 (CSV 空)
      rows: 2,
      validation: { maxLength: 255, pattern: generalTextPattern, maxLengthMsg: '不能超过255字符' },
      description: '代发产品的简短描述。填写简洁明了的代发产品描述。', // Source: 431
      example: 'Newest model', // Source: 432
    },
    {
      name: 'Dropship Long Description',
      label: '代发详细描述', // Source: 432
      type: 'textarea',
      isMandatory: false, // Source: 440 (CSV 空), 指南 "常用"
      rows: 5,
      validation: { maxLength: 2000, pattern: generalTextPattern, maxLengthMsg: '不能超过2000字符' },
      description: '代发产品的详细描述,提供更多产品信息。详细描述代发产品的特点、用途和优势。', // Source: 432
      example: 'The latest smartphone from Apple...', // Source: 432
    },
    {
      name: 'Keywords',
      label: '关键词 (SEO)', // Source: 433
      type: 'text',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 433 (PDF Guide "必填项")
      validation: {
        requiredMsg: '关键词不能为空',
        maxLength: 100, // Source: 397 (字段验证.pdf limited_str(100))
        maxLengthMsg: '关键词不能超过100个字符',
        // pattern: /^[a-zA-Z0-9\s,-]*$/, // 允许空格和逗号
        // patternMsg: '关键词格式不正确 (英文逗号分隔)',
      },
      description: '用于SEO(搜索引擎优化)的关键词,帮助搜索引擎更好地索引您的产品。填写与产品相关的关键词,以英文逗号分隔。', // Source: 433
      example: 'Red Shoes, Fashion, Comfortable', // Source: 397
    },
    {
      name: 'Google Product Category',
      label: 'Google 产品类别', // Source: 433
      type: 'select', // Source: 397 (字段验证: GoogleProductCategoryEnum)
      isMandatory: false, // Source: 440 (CSV "选填")
      options: googleProductCategoryOptions,
      validation: {},
      description: '根据Google的标准产品类别对产品进行分类。根据Google的分类规则选择适合的类别。', // Source: 433
    },
    {
      name: 'Google Product Type',
      label: 'Google 产品类型', // Source: 433
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        maxLength: 30, // Source: 397 (字段验证.pdf limited_str(30))
        maxLengthMsg: 'Google 产品类型不能超过30个字符',
        pattern: generalTextPattern,
      },
      description: '详细说明产品的类型。填写具体的产品类型,例如“Men\'s Clothing”。', // Source: 433
      example: 'Men\'s Clothing', // Source: 397
    },
    {
      name: 'Facebook Product Category',
      label: 'Facebook 产品类别', // Source: 434
      type: 'select', // Source: 397 (字段验证: FacebookProductCategoryEnum)
      isMandatory: false, // Source: 440 (CSV "选填")
      options: facebookProductCategoryOptions,
      validation: {},
      description: '用于Facebook广告和购物的产品类别。选择产品的适当类别,确保与您的广告和推广匹配。', // Source: 434, 435
    },
    {
      name: 'Color Map',
      label: '颜色图谱', // Source: 435
      type: 'select', // Source: 397 (字段验证: ColorMapEnum)
      isMandatory: false, // Source: 440 (CSV "选填")
      options: colorMapOptions,
      validation: {},
      description: '产品的颜色图谱,主要用于展示颜色的多样性。填写产品的颜色选项,例如“Red, Blue, Green”。', // Source: 435
      example: 'Red, Blue, Green', // Source: 397
    },
    {
      name: 'Key Features 1',
      label: '关键特性 1', // Source: 435
      type: 'text',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '关键特性1不能为空',
        maxLength: 200, // Source: 397 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '产品的第一个关键特性。简洁描述产品的第一个主要特性,例如“Lightweight”或“Water-resistant”。', // Source: 435
    },
    {
      name: 'Key Features 2',
      label: '关键特性 2', // Source: 435
      type: 'text',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '关键特性2不能为空',
        maxLength: 200, // Source: 397 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '产品的第二个关键特性。简洁描述产品的第二个主要特性。', // Source: 435
    },
    {
      name: 'Key Features 3',
      label: '关键特性 3', // Source: 435
      type: 'text',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '关键特性3不能为空',
        maxLength: 200, // Source: 398 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '产品的第三个关键特性。简洁描述产品的第三个主要特性。', // Source: 435
    },
    {
      name: 'Key Features 4',
      label: '关键特性 4', // Source: 435
      type: 'text',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '关键特性4不能为空',
        maxLength: 200, // Source: 398 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '产品的第四个关键特性。简洁描述产品的第四个主要特性。', // Source: 435
    },
    {
      name: 'Key Features 5',
      label: '关键特性 5', // Source: 435
      type: 'text',
      isMandatory: true, // Source: 440 (CSV "选填", 但指南为"必填项"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '关键特性5不能为空',
        maxLength: 200, // Source: 398 (字段验证.pdf limited_str(200))
        pattern: generalTextPattern,
        maxLengthMsg: '不能超过200字符',
      },
      description: '产品的第五个关键特性。简洁描述产品的第五个主要特性。', // Source: 435
    },
    {
      name: 'Main Image',
      label: '主图链接', // Source: 435
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '主图链接不能为空',
        pattern: imageUrlPattern, // Source: 499
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '产品的主要展示图片。请上传产品的高质量主图,确保图片清晰、真实。', // Source: 435
    },
    {
      name: 'Front Image',
      label: '正面图链接', // Source: 435
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '正面图链接不能为空',
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '产品正面的图片。上传展示产品正面特点的图片。', // Source: 435
    },
    {
      name: 'Back Image',
      label: '背面图链接', // Source: 435
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '背面图链接不能为空',
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '产品背面的图片。上传展示产品背面特点的图片。', // Source: 435
    },
    {
      name: 'Side Image',
      label: '侧面图链接', // Source: 435
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 435 (PDF Guide "必填项")
      validation: {
        requiredMsg: '侧面图链接不能为空',
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '产品的侧面图片。上传展示产品侧面特点的图片。', // Source: 435
    },
    {
      name: 'Detail Image',
      label: '细节图链接', // Source: 436
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 436 (PDF Guide "必填项")
      validation: {
        requiredMsg: '细节图链接不能为空',
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '产品的细节特写图片。上传展示产品细节部分的图片,如钮扣、材质、缝合等。', // Source: 436
    },
    {
      name: 'Full Image',
      label: '全图链接', // Source: 436
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 436 (PDF Guide "必填项")
      validation: {
        requiredMsg: '全图链接不能为空',
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '产品的全景图。上传完整展示产品的图片。', // Source: 436
    },
    {
      name: 'Thumbnail Image',
      label: '缩略图链接', // Source: 436
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 436 (PDF Guide "必填项")
      validation: {
        requiredMsg: '缩略图链接不能为空',
        pattern: imageUrlPattern, // Source: 503
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '用于展示产品的小图。上传缩略图,通常为产品主图的缩小版。', // Source: 436
    },
    {
      name: 'Size Chart Image',
      label: '尺码表图链接', // Source: 436
      type: 'url',
      isMandatory: true, // Source: 440 (CSV "必填"), 436 (PDF Guide "必填项")
      validation: {
        requiredMsg: '尺码表图链接不能为空',
        pattern: imageUrlPattern, // Source: 504
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '展示产品尺码表的图片。上传显示尺码信息的图表。', // Source: 436
    },
    {
      name: 'Swatch Image',
      label: '色板图链接', // Source: 436
      type: 'url',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: imageUrlPattern, // Source: 505
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '展示产品颜色的样本图。上传显示不同颜色选项的图片。', // Source: 436
    },
    {
      name: 'Additional Image 1',
      label: '附加图像1链接', // Source: 436
      type: 'url',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: imageUrlPattern, // Source: 506
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '额外的产品图片。如果有其他展示角度或细节的图片,请上传。', // Source: 436
    },
    {
      name: 'Additional Image 2',
      label: '附加图像2链接', // Source: 436
      type: 'url',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '额外的产品图片。如果有其他展示角度或细节的图片,请上传。', // Source: 436
    },
    {
      name: 'Additional Image 3',
      label: '附加图像3链接', // Source: 436
      type: 'url',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: imageUrlPattern,
        patternMsg: '请输入有效的图片URL (jpg, jpeg, png, webp)',
      },
      description: '额外的产品图片。如果有其他展示角度或细节的图片,请上传。', // Source: 436
    },
    {
      name: 'Main Video',
      label: '主视频链接', // Source: 436
      type: 'url',
      isMandatory: false, // Source: 440 (CSV 空)
      validation: {
        pattern: videoUrlPattern, // Source: 508
        patternMsg: '请输入有效的视频URL (mp4, mov, avi, wmv, webm)',
      },
      description: '展示产品的主视频。上传产品的展示视频,能够更全面地展示产品。', // Source: 436
    },
    {
      name: 'Additional Video 1',
      label: '附加视频1链接', // Source: 436
      type: 'url',
      isMandatory: false, // Source: 440 (CSV 空)
      validation: {
        pattern: videoUrlPattern,
        patternMsg: '请输入有效的视频URL (mp4, mov, avi, wmv, webm)',
      },
      description: '额外的产品视频。上传展示产品的其他视频素材。', // Source: 436
    },
    {
      name: 'Material 1 Name',
      label: '材质1名称', // Source: 436
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填") (指南未标必填)
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的第一个主要材质。填写产品使用的第一个主要材质名称,例如“Cotton”。', // Source: 437
      example: 'Cotton', // Source: 437
    },
    {
      name: 'Material 1 Percentage',
      label: '材质1百分比', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: /^\d{1,2}(\.\d{1,2})?%?$|^100%?$/, // Source: 510
        patternMsg: '请输入有效的百分比 (例如: 50, 50%, 75.5%)',
      },
      description: '产品第一个材质的百分比。填写第一个材质的占比(例如50%)。', // Source: 437
      example: '80%', // Source: 510
    },
    {
      name: 'Material 2 Name',
      label: '材质2名称', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的第二个主要材质。填写产品使用的第二个主要材质名称。', // Source: 437
    },
    {
      name: 'Material 2 Percentage',
      label: '材质2百分比', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: /^\d{1,2}(\.\d{1,2})?%?$|^100%?$/,
        patternMsg: '请输入有效的百分比 (例如: 20, 20%, 15.5%)',
      },
      description: '产品第二个材质的百分比。填写第二个材质的占比。', // Source: 437
    },
    {
      name: 'Material 3 Name',
      label: '材质3名称', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的第三个主要材质。填写产品使用的第三个主要材质名称。', // Source: 437
    },
    {
      name: 'Material 3 Percentage',
      label: '材质3百分比', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: /^\d{1,2}(\.\d{1,2})?%?$|^100%?$/,
        patternMsg: '请输入有效的百分比',
      },
      description: '产品第三个材质的百分比。填写第三个材质的占比。', // Source: 437
    },
    {
      name: 'Material 4 Name',
      label: '材质4名称', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的第四个主要材质。填写产品使用的第四个主要材质名称。', // Source: 437
    },
    {
      name: 'Material 4 Percentage',
      label: '材质4百分比', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: /^\d{1,2}(\.\d{1,2})?%?$|^100%?$/,
        patternMsg: '请输入有效的百分比',
      },
      description: '产品第四个材质的百分比。填写第四个材质的占比。', // Source: 437
    },
    {
      name: 'Material 5 Name',
      label: '材质5名称', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 50, pattern: generalTextPattern, maxLengthMsg: '不能超过50字符' },
      description: '产品的第五个主要材质。填写产品使用的第五个主要材质名称。', // Source: 437
    },
    {
      name: 'Material 5 Percentage',
      label: '材质5百分比', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: {
        pattern: /^\d{1,2}(\.\d{1,2})?%?$|^100%?$/,
        patternMsg: '请输入有效的百分比',
      },
      description: '产品第五个材质的百分比。填写第五个材质的占比。', // Source: 437
    },
    {
      name: 'Additional Color 1',
      label: '附加颜色1', // Source: 437
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 30, pattern: generalTextPattern, maxLengthMsg: '不能超过30字符' },
      description: '其他可选颜色。填写产品的其他颜色(例如“Blue”)。', // Source: 438
    },
    {
      name: 'Additional Color 2',
      label: '附加颜色2', // Source: 438
      type: 'text',
      isMandatory: false, // Source: 440 (CSV "选填")
      validation: { maxLength: 30, pattern: generalTextPattern, maxLengthMsg: '不能超过30字符' },
      description: '其他可选颜色。填写产品的其他颜色。', // Source: 438
    },
  ];