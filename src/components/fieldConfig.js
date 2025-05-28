// src/components/fieldConfig.js

// --- Helper data and enums ---
const statusOptions = [
  { value: '0', label: 'Active' }, { value: '1', label: 'Inactive' },
  { value: '2', label: 'Discontinued' }, { value: '3', label: 'Closeout' },
  { value: '4', label: 'Liquidation' }, { value: '5', label: 'Prelimnry' },
  { value: '11', label: 'New' }, { value: '12', label: 'Promotional' },
];

const conditionOptions = [
  { value: '0', label: 'New' }, { value: '1', label: 'Used' },
  { value: '2', label: 'Refurbished' }, { value: '4', label: 'Reconditioned' },
  { value: '8', label: 'LikeNew' }, { value: '9', label: 'UsedGood' },
  { value: '10', label: 'UsedPoor' }, { value: '11', label: 'Damaged' },
];

// --- Patterns ---
const nrfCodePattern = /^[a-zA-Z0-9\- ]*$/;
const noLeadingZeroAndNoSpecialCharsPattern = /^[a-zA-Z1-9][a-zA-Z0-9-]*$/;
const backendLimitedStrEngPattern = /^[a-zA-Z0-9\- ]*$/;
const backendLimitedStrEngPatternNotEmpty = /^[a-zA-Z0-9\- ]+$/;
const backendLimitedStrChPattern = /^[\u4e00-\u9fa5a-zA-Z0-9 ]*$/;
const backendLimitedStrChPatternNotEmpty = /^[\u4e00-\u9fa5a-zA-Z0-9 ]+$/;
const generalTextWithSpecialCharsPattern = /^[\x00-\x7F\s\u4e00-\u9fa5_&',.\/\(\)]*$/;
const imageUrlPattern = /^https?:\/\/.+/i;
const videoUrlPattern = /^https?:\/\/.+/i;
const fourDigitYearPattern = /^\d{4}$/;
const upcPattern = /^\d{12}$/;
const positiveIntegerPattern = /^[1-9]\d*$/;
const nonNegativeIntegerPattern = /^\d+$/;
const pricePattern = /^\d+(\.\d{1,2})?$/;
const percentageInputPattern = /^\d*\.?\d*%?$/;
const percentageValidationPattern = /^(\d{1,2}(\.\d{1,2})?|100)$/;
const harmonizedCodePattern = /^[0-9A-Za-z.\-]+$/;

// List of mandatory field names from the CSV
const mandatoryFieldsFromCSV = [
  'vendor_sku', 'product_name', 'dropship_price', 'allow_dropship_return', 'condition',
  'UOM', 'ship_from', 'ship_to', 'ship_carrier', 'title', 'short_desc',
  'keywords', 'key_features_1', 'key_features_2', 'main_image', 'full_image', 'thumbnail_image'
];

// Helper function to create validation object
const createValidation = (field) => {
  const isMandatory = mandatoryFieldsFromCSV.includes(field.name);
  const validation = { ...field.origValidation }; // Keep original validation rules

  if (isMandatory) {
    validation.requiredMsg = `${field.label} is required.`;
  } else {
    delete validation.requiredMsg; // Remove requiredMsg if not mandatory
  }
  return validation;
};


const tempFieldsConfig = [ // Temporary array to hold original structures before adjusting isMandatory
  {
    name: 'vendor_sku', label: 'Vendor SKU', type: 'text',
    origValidation: { pattern: noLeadingZeroAndNoSpecialCharsPattern, patternMsg: 'Invalid SKU format (no leading zero, no special chars except hyphen). Max 100 chars.', maxLength: 100 },
    description: 'Unique product identifier from vendor.', example: 'ABC-12345-XYZ'
  },
  {
    name: 'UPC', label: 'UPC', type: 'text',
    origValidation: { pattern: upcPattern, patternMsg: 'UPC must be 12 digits if provided.', maxLength: 12 },
    description: 'Universal Product Code (12 digits).', example: '123456789012'
  },
  {
    name: 'product_name', label: 'Product Name', type: 'text',
    origValidation: { maxLength: 40, pattern: backendLimitedStrChPatternNotEmpty, patternMsg: 'Product name allows Chinese, letters, numbers, spaces. Max 40 chars.' },
    description: 'Full product name.', example: 'Example Product Name'
  },
  {
    name: 'status', label: 'Status', type: 'select',
    options: statusOptions, defaultValue: '0',
    origValidation: {},
    description: 'Product status. Backend expects integer.'
  },
  {
    name: 'ATS', label: 'ATS', type: 'number',
    origValidation: { min: 1, pattern: positiveIntegerPattern, patternMsg: 'ATS must be a positive integer.', minMsg:'ATS must be > 0.' },
    description: 'Available to Sell quantity.', example: '100'
  },
  {
    name: 'dropship_price', label: 'Dropship Price', type: 'number', isFee: true,
    origValidation: { min: 0, pattern: pricePattern, patternMsg: 'Invalid price format (e.g., 10.99).', minMsg:'Price cannot be negative.' },
    description: 'Supplier dropship price.', example: '50.00'
  },
  {
    name: 'MSRP', label: 'MSRP', type: 'number', isFee: true,
    origValidation: { min: 0, pattern: pricePattern, patternMsg: 'Invalid price format.', minMsg:'Price cannot be negative.' },
    description: 'Manufacturer Suggested Retail Price.', example: '70.00'
  },
  {
    name: 'HDL_for_shipping', label: 'HDL for Shipping', type: 'number', isFee: true,
    origValidation: { min: 0, pattern: pricePattern, patternMsg: 'Invalid fee format.', minMsg:'Fee cannot be negative.' },
    description: 'Handling fee for shipping.', example: '5.50'
  },
  {
    name: 'HDL_for_receiving', label: 'HDL for Receiving', type: 'number', isFee: true,
    origValidation: { min: 0, pattern: pricePattern, patternMsg: 'Invalid fee format.', minMsg:'Fee cannot be negative.' },
    description: 'Handling fee for receiving.', example: '2.00'
  },
  {
    name: 'HDL_for_returning', label: 'HDL for Returning', type: 'number', isFee: true,
    origValidation: { min: 0, pattern: pricePattern, patternMsg: 'Invalid fee format.', minMsg:'Fee cannot be negative.' },
    description: 'Handling fee for returns.', example: '3.50'
  },
  {
    name: 'storage_monthly', label: 'Storage Monthly', type: 'number', isFee: true,
    origValidation: { min: 0, pattern: pricePattern, patternMsg: 'Invalid fee format.', minMsg:'Fee cannot be negative.' },
    description: 'Monthly storage fee per unit.', example: '1.25'
  },
  {
    name: 'allow_dropship_return', label: 'Allow Dropship Return', type: 'select',
    options: [{ value: 'True', label: 'Yes' }, { value: 'False', label: 'No' }], defaultValue: 'False',
    origValidation: {},
    description: 'Is dropship return allowed?'
  },
  {
    name: 'shipping_lead_time', label: 'Shipping Lead Time (Days)', type: 'number',
    origValidation: { min: 0, pattern: nonNegativeIntegerPattern, patternMsg: 'Must be a non-negative integer.', minMsg:'Cannot be negative.' },
    description: 'Days from order to shipment.', example: '3'
  },
  {
    name: 'division', label: 'Division', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product division.', example: 'Electronics'
  },
  {
    name: 'department', label: 'Department', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product department.', example: 'Audio Equipment'
  },
  {
    name: 'category', label: 'Category', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Main product category.', example: 'Headphones'
  },
  {
    name: 'sub_category', label: 'Sub Category', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product sub-category.', example: 'Wireless Headphones'
  },
  {
    name: 'product_class', label: 'Product Class', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product classification.', example: 'Consumer Electronics'
  },
  {
    name: 'group', label: 'Group', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product group.', example: 'Audio Devices'
  },
  {
    name: 'subgroup', label: 'Subgroup', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product subgroup.', example: 'Bluetooth Audio'
  },
  {
    name: 'style', label: 'Style', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product style.', example: 'Over-ear'
  },
  {
    name: 'sub_style', label: 'Sub Style', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product sub-style.', example: 'Noise Cancelling'
  },
  {
    name: 'brand', label: 'Brand', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product brand.', example: 'Sony'
  },
  {
    name: 'model', label: 'Model', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product model.', example: 'WH-1000XM5'
  },
  {
    name: 'color', label: 'Color', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product color.', example: 'Black'
  },
  {
    name: 'size', label: 'Size', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'Product size (if applicable).', example: 'One Size'
  },
  { name: 'option_1', label: 'Option 1', type: 'text', origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Invalid chars.', maxLengthMsg:'Max 50' }, description:'Custom option 1' },
  { name: 'option_2', label: 'Option 2', type: 'text', origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Invalid chars.', maxLengthMsg:'Max 50' }, description:'Custom option 2' },
  { name: 'option_3', label: 'Option 3', type: 'text', origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Invalid chars.', maxLengthMsg:'Max 50' }, description:'Custom option 3' },
  { name: 'option_4', label: 'Option 4', type: 'text', origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Invalid chars.', maxLengthMsg:'Max 50' }, description:'Custom option 4' },
  { name: 'option_5', label: 'Option 5', type: 'text', origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Invalid chars.', maxLengthMsg:'Max 50' }, description:'Custom option 5' },
  {
    name: 'gender', label: 'Gender', type: 'text', // Changed from select
    origValidation: { maxLength: 20, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 20 chars.' },
    description: 'Target gender.', example: 'Unisex'
  },
  {
    name: 'age_group', label: 'Age Group', type: 'text', // Changed from select
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Target age group.', example: 'Adult'
  },
  {
    name: 'country_of_region', label: 'Country of Origin', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Country of manufacture.', example: 'USA'
  },
  {
    name: 'color_code_NRF', label: 'Color Code NRF', type: 'text',
    origValidation: { maxLength: 50, pattern: nrfCodePattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'NRF standard color code.', example: 'BLK001'
  },
  {
    name: 'color_desc', label: 'Color Description', type: 'text',
    origValidation: { maxLength: 20, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 20 chars.' },
    description: 'Description of the color.', example: 'Midnight Black'
  },
  {
    name: 'size_code_NRF', label: 'Size Code NRF', type: 'text',
    origValidation: { maxLength: 50, pattern: nrfCodePattern, patternMsg: 'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg: 'Max 50 chars.' },
    description: 'NRF standard size code.', example: 'LGE 010'
  },
  {
    name: 'size_desc', label: 'Size Description', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Detailed description of the size.', example: 'Large'
  },
  {
    name: 'manufacturer', label: 'Manufacturer', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Product manufacturer.', example: 'Acme Corp'
  },
  {
    name: 'OEM', label: 'OEM', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Original Equipment Manufacturer.', example: 'OEM Inc'
  },
  {
    name: 'product_year', label: 'Product Year', type: 'text',
    origValidation: { pattern: fourDigitYearPattern, patternMsg: 'Enter a 4-digit year (e.g., "2023").' },
    description: 'Manufacturing year (e.g., "2023").', example: '2023'
  },
  {
    name: 'condition', label: 'Condition', type: 'select',
    options: conditionOptions, defaultValue: '0',
    origValidation: {},
    description: 'Product condition. Backend expects integer.'
  },
  {
    name: 'prepack_code', label: 'Prepack Code', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Prepack code if applicable.', example: 'PPK-007'
  },
  {
    name: 'remark', label: 'Remark', type: 'textarea', rows: 2,
    origValidation: { maxLength: 100, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters in remark.', maxLengthMsg:'Max 100 chars.' },
    description: 'Additional remarks.', example: 'Limited edition release'
  },
  {
    name: 'harmonized_code', label: 'Harmonized Code', type: 'text',
    origValidation: { maxLength: 50, pattern: harmonizedCodePattern, patternMsg:'Invalid harmonized code format (numbers, letters, dots, hyphens allowed).', maxLengthMsg:'Max 50 chars.' },
    description: 'Customs harmonized code.', example: '8517.12.0050'
  },
  {
    name: 'UOM', label: 'UOM', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Unit of Measure.', example: 'Each'
  },
  {
    name: 'net_weight', label: 'Net Weight', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid weight format (e.g., 0.5).', minMsg:'Must be > 0.' },
    description: 'Product net weight (e.g., in kg or lb).', example: '0.25'
  },
  {
    name: 'gross_weight', label: 'Gross Weight', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid weight format.', minMsg:'Must be > 0.' },
    description: 'Product gross weight (with packaging).', example: '0.35'
  },
  {
    name: 'product_height', label: 'Product Height', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid dimension format.', minMsg:'Must be > 0.' },
    description: 'Height of the product (e.g., in cm or in).', example: '15.0'
  },
  {
    name: 'product_length', label: 'Product Length', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid dimension format.', minMsg:'Must be > 0.' },
    description: 'Length of the product.', example: '7.0'
  },
  {
    name: 'product_width', label: 'Product Width', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid dimension format.', minMsg:'Must be > 0.' },
    description: 'Width of the product.', example: '1.0'
  },
  {
    name: 'box_height', label: 'Box Height', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid dimension format.', minMsg:'Must be > 0.' },
    description: 'Height of the packaging box.', example: '18.0'
  },
  {
    name: 'box_length', label: 'Box Length', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid dimension format.', minMsg:'Must be > 0.' },
    description: 'Length of the packaging box.', example: '10.0'
  },
  {
    name: 'box_width', label: 'Box Width', type: 'number',
    origValidation: { min:0.01, pattern: pricePattern, patternMsg:'Invalid dimension format.', minMsg:'Must be > 0.' },
    description: 'Width of the packaging box.', example: '3.0'
  },
  {
    name: 'qty_case', label: 'Qty/Case', type: 'number',
    origValidation: { min:1, pattern: positiveIntegerPattern, patternMsg:'Must be a positive integer.', minMsg:'Must be >= 1.' },
    description: 'Number of products per case.', example: '24'
  },
  {
    name: 'qty_box', label: 'Qty/Box', type: 'number',
    origValidation: { min:1, pattern: positiveIntegerPattern, patternMsg:'Must be a positive integer.', minMsg:'Must be >= 1.' },
    description: 'Number of products per box.', example: '6'
  },
  {
    name: 'material_content', label: 'Material Content', type: 'textarea', rows:2,
    origValidation: { maxLength: 200, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 200 chars.' },
    description: 'Main material(s).', example: '80% Cotton, 20% Polyester'
  },
  {
    name: 'tag', label: 'Tag', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Search keywords for product.', example: 'smartphone electronics'
  },
  {
    name: 'care_instructions', label: 'Care Instructions', type: 'textarea', rows: 3,
    origValidation: { maxLength: 1000, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 1000 chars.' },
    description: 'Product care instructions.', example: 'Hand wash cold. Do not bleach.'
  },
  {
    name: 'ship_from', label: 'Ship From', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Product shipping origin.', example: 'California Warehouse'
  },
  {
    name: 'ship_to', label: 'Ship To', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Product shipping destination(s).', example: 'USA Domestic'
  },
  {
    name: 'ship_carrier', label: 'Ship Carrier', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces.', maxLengthMsg:'Max 50 chars.' },
    description: 'Shipping company.', example: 'UPS Ground'
  },
  {
    name: 'ship_desc', label: 'Shipping Description', type: 'textarea', rows: 2,
    origValidation: { maxLength: 200, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 200 chars.' },
    description: 'Additional shipping information.', example: 'Ships in 1-2 business days.'
  },
  {
    name: 'return_policy', label: 'Return Policy', type: 'textarea', rows: 3,
    origValidation: { maxLength: 1000, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 1000 chars.' },
    description: 'Product return policy details.', example: '30-day free returns.'
  },
  {
    name: 'security_privacy', label: 'Security & Privacy', type: 'textarea', rows: 2,
    origValidation: { maxLength: 1000, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 1000 chars.' },
    description: 'Security and privacy information.', example: 'Data encrypted end-to-end.'
  },
  {
    name: 'dropship_desc', label: 'Dropship Description', type: 'textarea', rows: 3,
    origValidation: { maxLength: 1000, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 1000 chars.' },
    description: 'Description for dropship listings.', example: 'This item is dropshipped directly from the supplier.'
  },
  {
    name: 'title', label: 'Title (Listing)', type: 'text',
    origValidation: { maxLength: 500, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 500 chars.' },
    description: 'Product title for listings.', example: 'Amazing New Product - Limited Stock!'
  },
  {
    name: 'short_desc', label: 'Short Description', type: 'textarea', rows: 2,
    origValidation: { maxLength: 100, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 100 chars.' },
    description: 'Brief product description.', example: 'Get this amazing new product today.'
  },
  {
    name: 'long_desc', label: 'Long Description', type: 'textarea', rows: 4,
    origValidation: { maxLength: 2000, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 2000 chars.' },
    description: 'Detailed product description.', example: 'Full details about features, benefits, and specifications of this incredible product.'
  },
  {
    name: 'keywords', label: 'Keywords', type: 'text',
    origValidation: { maxLength: 50, pattern: /^[a-zA-Z0-9,\- ]*$/, patternMsg:'Allowed: letters, numbers, hyphens, spaces, commas.', maxLengthMsg:'Max 50 chars.' },
    description: 'Comma-separated keywords for SEO.', example: 'new, product, amazing, electronics'
  },
  {
    name: 'dropship_listing_title', label: 'Dropship Listing Title', type: 'text',
    origValidation: { maxLength: 500, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 500 chars.' },
    description: 'Title for dropship channel listings.', example: 'DS - Amazing New Product - Fast Shipping'
  },
  {
    name: 'dropship_short_desc', label: 'Dropship Short Desc.', type: 'textarea', rows: 2,
    origValidation: { maxLength: 100, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 100 chars.' },
    description: 'Short description for dropship channels.', example: 'Dropshipped: Get this amazing item with quick delivery.'
  },
  {
    name: 'dropship_long_desc', label: 'Dropship Long Desc.', type: 'textarea', rows: 4,
    origValidation: { maxLength: 2000, pattern: generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters.', maxLengthMsg:'Max 2000 chars.' },
    description: 'Long description for dropship channels.', example: 'Full dropship details including origin and handling...'
  },
  {
    name: 'google_product_category', label: 'Google Product Category', type: 'text', // Changed from select
    origValidation: { maxLength:50, pattern: backendLimitedStrEngPattern, patternMsg: 'Category must use allowed characters (letters, numbers, hyphens, spaces). Max 50 chars.' },
    description: 'Google Shopping category. Values like "Arts & Entertainment" should be "Arts and Entertainment".', example: 'Electronics - Audio - Headphones'
  },
  {
    name: 'google_product_type', label: 'Google Product Type', type: 'text',
    origValidation: { maxLength: 50, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces. Max 50 chars.', maxLengthMsg:'Max 50 chars.' },
    description: 'Your specific product type for Google.', example: 'Wireless Noise Cancelling Headphones'
  },
  {
    name: 'facebook_product_category', label: 'Facebook Product Category', type: 'text', // Changed from select
    origValidation: { maxLength:50, pattern: backendLimitedStrEngPattern, patternMsg: 'Category must use allowed characters (letters, numbers, hyphens, spaces). Max 50 chars.' },
    description: 'Facebook Shopping category. Values like "APPAREL_AND_ACCESSORIES" should be "APPAREL AND ACCESSORIES".', example: 'Electronics - Audio Equipment'
  },
  {
    name: 'color_map', label: 'Color Map', type: 'text',
    origValidation: { maxLength: 2000, pattern: backendLimitedStrEngPattern, patternMsg:'Allowed: letters, numbers, hyphens, spaces. For multiple, use comma and ensure pattern allows it.', maxLengthMsg:'Max 2000 chars.' },
    description: 'Primary color for mapping. Example: "Black" or if pattern allows commas "Red, Blue".', example: 'Black'
  },
  { name: 'key_features_1', label: 'Key Feature 1', type: 'text', origValidation: { maxLength: 100, pattern:generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters in feature.', maxLengthMsg:'Max 100 chars.' } },
  { name: 'key_features_2', label: 'Key Feature 2', type: 'text', origValidation: { maxLength: 100, pattern:generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters in feature.', maxLengthMsg:'Max 100 chars.' } },
  { name: 'key_features_3', label: 'Key Feature 3', type: 'text', origValidation: { maxLength: 100, pattern:generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters in feature.', maxLengthMsg:'Max 100 chars.' } },
  { name: 'key_features_4', label: 'Key Feature 4', type: 'text', origValidation: { maxLength: 100, pattern:generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters in feature.', maxLengthMsg:'Max 100 chars.' } },
  { name: 'key_features_5', label: 'Key Feature 5', type: 'text', origValidation: { maxLength: 100, pattern:generalTextWithSpecialCharsPattern, patternMsg:'Invalid characters in feature.', maxLengthMsg:'Max 100 chars.' } },
  { name: 'main_image', label: 'Main Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'front_image', label: 'Front Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'side_image', label: 'Side Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'back_image', label: 'Back Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'detail_image', label: 'Detail Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'full_image', label: 'Full Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'thumbnail_image', label: 'Thumbnail Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'size_chart_image', label: 'Size Chart Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'swatch_image', label: 'Swatch Image URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'additional_image_1', label: 'Additional Image 1 URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'additional_image_2', label: 'Additional Image 2 URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'additional_image_3', label: 'Additional Image 3 URL', type: 'url', origValidation: { pattern: imageUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'main_video', label: 'Main Video URL', type: 'url', origValidation: { pattern: videoUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  { name: 'additional_video_1', label: 'Additional Video 1 URL', type: 'url', origValidation: { pattern: videoUrlPattern, patternMsg: 'Valid URL starting with http(s):// required.' } },
  {
    name: 'material_name_1', label: 'Material 1 Name', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
  {
    name: 'material_1_percentage', label: 'Material 1 %', type: 'number',
    origValidation: { min:1, max:100, pattern:percentageValidationPattern, patternMsg:"Enter a value between 1 and 100 (e.g., 50 or 50.5).", minMsg:"Min 1.", maxMsg:"Max 100." }
  },
  {
    name: 'material_name_2', label: 'Material 2 Name', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
  {
    name: 'material_2_percentage', label: 'Material 2 %', type: 'number',
    origValidation: { min:1, max:100, pattern:percentageValidationPattern, patternMsg:"Enter a value between 1 and 100.", minMsg:"Min 1.", maxMsg:"Max 100." }
  },
  {
    name: 'material_name_3', label: 'Material 3 Name', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
  {
    name: 'material_3_percentage', label: 'Material 3 %', type: 'number',
    origValidation: { min:1, max:100, pattern:percentageValidationPattern, patternMsg:"Enter a value between 1 and 100.", minMsg:"Min 1.", maxMsg:"Max 100." }
  },
  {
    name: 'material_name_4', label: 'Material 4 Name', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
  {
    name: 'material_4_percentage', label: 'Material 4 %', type: 'number',
    origValidation: { min:1, max:100, pattern:percentageValidationPattern, patternMsg:"Enter a value between 1 and 100.", minMsg:"Min 1.", maxMsg:"Max 100." }
  },
  {
    name: 'material_name_5', label: 'Material 5 Name', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
  {
    name: 'material_5_percentage', label: 'Material 5 %', type: 'number',
    origValidation: { min:1, max:100, pattern:percentageValidationPattern, patternMsg:"Enter a value between 1 and 100.", minMsg:"Min 1.", maxMsg:"Max 100." }
  },
  {
    name: 'additional_color_1', label: 'Additional Color 1', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
  {
    name: 'additional_color_2', label: 'Additional Color 2', type: 'text',
    origValidation: { maxLength: 100, pattern:backendLimitedStrEngPattern, patternMsg:"Allowed: letters, numbers, hyphens, spaces.", maxLengthMsg:"Max 100" }
  },
];

// Final processing to set isMandatory and validation object
export const fieldsConfig = tempFieldsConfig.map(field => ({
  ...field,
  isMandatory: mandatoryFieldsFromCSV.includes(field.name),
  validation: createValidation(field),
  // Remove origValidation as it's now incorporated into validation
  origValidation: undefined,
}));