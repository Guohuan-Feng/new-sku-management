import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  Typography
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// 从 fieldConfig.js 导入
import { fieldsConfig as fieldConfigurations } from './fieldConfig.js';

const initialFormData = {
  vendor_sku: '',
  UPC: '',
  product_name: '',
  status: '',
  ATS: '',
  dropship_price: '',
  MSRP: '',
  HDL_for_shipping: '',
  HDL_for_receiving: '',
  HDL_for_returning: '',
  storage_monthly: '',
  allow_dropship_return: '',
  shipping_lead_time: '',
  division: '',
  department: '',
  category: '',
  sub_category: '',
  product_class: '',
  group: '',
  subgroup: '',
  style: '',
  sub_style: '',
  brand: '',
  model: '',
  color: '',
  size: '',
  option_1: '',
  option_2: '',
  option_3: '',
  option_4: '',
  option_5: '',
  gender: '',
  age_group: '',
  country_of_region: '',
  color_code_NRF: '',
  color_desc: '',
  size_code_NRF: '',
  size_desc: '',
  manufacturer: '',
  OEM: '',
  product_year: '', // Initialized as string
  condition: '',
  prepack_code: '',
  remark: '',
  harmonized_code: '',
  UOM: '',
  net_weight: '',
  gross_weight: '',
  product_height: '',
  product_length: '',
  product_width: '',
  box_height: '',
  box_length: '',
  box_width: '',
  qty_case: '',
  qty_box: '',
  material_content: '',
  tag: '',
  care_instructions: '',
  ship_from: '',
  ship_to: '',
  ship_carrier: '',
  ship_desc: '',
  return_policy: '',
  security_privacy: '',
  dropship_desc: '',
  title: '',
  short_desc: '',
  long_desc: '',
  keywords: '',
  dropship_listing_title: '',
  dropship_short_desc: '',
  dropship_long_desc: '',
  google_product_category: '',
  google_product_type: '',
  facebook_product_category: '',
  color_map: '',
  key_features_1: '',
  key_features_2: '',
  key_features_3: '',
  key_features_4: '',
  key_features_5: '',
  main_image: '',
  front_image: '',
  side_image: '',
  back_image: '',
  detail_image: '',
  full_image: '',
  thumbnail_image: '',
  size_chart_image: '',
  swatch_image: '',
  additional_image_1: '',
  additional_image_2: '',
  additional_image_3: '',
  main_video: '',
  additional_video_1: '',
  material_name_1: '',
  material_1_percentage: '',
  material_name_2: '',
  material_2_percentage: '',
  material_name_3: '',
  material_3_percentage: '',
  material_name_4: '',
  material_4_percentage: '',
  material_name_5: '',
  material_5_percentage: '',
  additional_color_1: '',
  additional_color_2: '',
};

const renderLabelText = (label, isMandatory) => (
  <>
    {label}
    {isMandatory && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
  </>
);

const SKUForm = ({ initialData, onSubmit, formId = "sku-form", isSubmitting }) => {
  const [formData, setFormData] = useState(() => {
    const populatedInitialData = { ...initialFormData };
    if (initialData) {
        for (const key in initialData) {
            if (populatedInitialData.hasOwnProperty(key)) {
                 let value = initialData[key];
                 const fieldDef = fieldConfigurations.find(f => f.name === key);

                 if (key === 'allow_dropship_return') {
                    populatedInitialData[key] = value === true ? 'True' : (value === false ? 'False' : '');
                 } else if (fieldDef && fieldDef.type === 'select') {
                    populatedInitialData[key] = (value !== null && value !== undefined) ? String(value) : '';
                 } else if (key === 'product_year') { // Ensure product_year is string from initialData
                    populatedInitialData[key] = (value !== null && value !== undefined) ? String(value) : '';
                 }
                 else if (fieldDef && fieldDef.type === 'number' && (value !== null && value !== undefined)) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        const isDecimalStep = fieldDef.inputProps &&
                                         fieldDef.inputProps.step &&
                                         typeof fieldDef.inputProps.step === 'string' &&
                                         fieldDef.inputProps.step.includes("0.01");
                        populatedInitialData[key] = isDecimalStep ? numValue.toFixed(2) : String(Math.round(numValue));
                    } else {
                        populatedInitialData[key] = '';
                    }
                 } else {
                    populatedInitialData[key] = (value !== null && value !== undefined) ? value : '';
                 }
            }
        }
    }
    for (const key in populatedInitialData) {
        if (initialData && !initialData.hasOwnProperty(key) && populatedInitialData[key] === undefined) {
            populatedInitialData[key] = initialFormData[key];
        }
    }
    return populatedInitialData;
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newFormData = { ...initialFormData };
    if (initialData) {
      for (const key in newFormData) {
        if (initialData.hasOwnProperty(key)) {
          let value = initialData[key];
          const fieldDef = fieldConfigurations.find(f => f.name === key);

          if (key === 'allow_dropship_return') {
            newFormData[key] = value === true ? 'True' : (value === false ? 'False' : '');
          } else if (fieldDef && fieldDef.type === 'select') {
             newFormData[key] = (value !== null && value !== undefined) ? String(value) : '';
          } else if (key === 'product_year') { // Ensure product_year is string
            newFormData[key] = (value !== null && value !== undefined) ? String(value) : '';
          }
          else if (fieldDef && fieldDef.type === 'number' && (value !== null && value !== undefined)) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                const isDecimalStep = fieldDef.inputProps &&
                                 fieldDef.inputProps.step &&
                                 typeof fieldDef.inputProps.step === 'string' &&
                                 fieldDef.inputProps.step.includes("0.01");
                newFormData[key] = isDecimalStep ? numValue.toFixed(2) : String(Math.round(numValue));
            } else {
                newFormData[key] = '';
            }
          } else {
            newFormData[key] = (value !== null && value !== undefined) ? value : '';
          }
        } else {
           newFormData[key] = initialFormData[key];
        }
      }
    }
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
             if (!/^-?\d*\.?\d*$/.test(value)) {
                 if (value !== '-') return;
             }
        }
    }
     if (fieldConfig && (name.endsWith('_percentage') || name.toLowerCase().includes('percent')) && fieldConfig.type !== 'number') {
        if (value === '') {
            processedValue = '';
        } else {
            if (!/^\d*\.?\d*%?$/.test(value)) { // Allows digits, decimal, optional %
                return;
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
            } else { // Integer type
                processedValue = String(Math.round(numValue));
            }
            if (fieldConfig.inputProps) {
                const min = fieldConfig.inputProps.min;
                const max = fieldConfig.inputProps.max;
                const finalNumValue = parseFloat(processedValue); // Compare after formatting
                if (typeof min !== 'undefined' && finalNumValue < min) {
                   processedValue = isDecimalStep ? Number(min).toFixed(2) : String(min);
                }
                if (typeof max !== 'undefined' && finalNumValue > max) {
                   processedValue = isDecimalStep ? Number(max).toFixed(2) : String(max);
                }
            }
        } else {
            processedValue = ''; // Clear invalid numeric input
        }
        setFormData(prevData => ({...prevData, [name]: processedValue}));
    }
    // For all fields, validate on blur using the (potentially processed) value
    validateField(name, processedValue);
  };

  const validateField = (name, value) => {
    let error = '';
    const fieldDef = fieldConfigurations.find(f => f.name === name);
    if (!fieldDef) return true; // Should not happen if fieldConfigurations is complete

    const fieldLabel = fieldDef.label || name;
    const isMandatory = fieldDef.isMandatory;
    const validationRules = fieldDef.validation || {};
    const fieldType = fieldDef.type; // 'text', 'number', 'select', 'url', 'textarea' from fieldConfig
    const inputProps = fieldDef.inputProps || {};

    // Use raw value for select 'allow_dropship_return' which uses 'True'/'False' strings
    // For other string inputs, trim. For non-string (like numbers from state if not yet stringified), use as is.
    let valToValidate = (name === 'allow_dropship_return' || typeof value !== 'string') ? value : value.trim();


    if (isMandatory) {
        if (valToValidate === '' || valToValidate === null || valToValidate === undefined) {
            error = validationRules.requiredMsg || `${fieldLabel} is required.`;
        }
    }

    // Only proceed with further validation if no mandatory error and value is not empty
    if (!error && (valToValidate !== '' && valToValidate !== null && valToValidate !== undefined)) {
        // String based validations (pattern, maxLength)
        // Ensure valToValidate is string for pattern.test and length check
        const stringValToValidate = String(valToValidate);
        if (validationRules.pattern && !validationRules.pattern.test(stringValToValidate)) {
            error = validationRules.patternMsg || `Invalid format for ${fieldLabel}.`;
        }
        if (!error && validationRules.maxLength && stringValToValidate.length > validationRules.maxLength) {
            error = validationRules.maxLengthMsg || `Max ${validationRules.maxLength} characters for ${fieldLabel}.`;
        }

        // Numeric validations (for fields of type 'number' in fieldConfig)
        // These fields are text input but represent numbers. valToValidate is the string from input.
        if (!error && fieldType === 'number') {
            const num = parseFloat(valToValidate); // valToValidate is the string from input/blur
            if (isNaN(num)) {
                error = `${fieldLabel} must be a valid number.`;
            } else {
                if (validationRules.min !== undefined && num < validationRules.min) {
                    error = validationRules.minMsg || `${fieldLabel} must be at least ${validationRules.min}.`;
                }
                if (!error && validationRules.max !== undefined && num > validationRules.max) {
                    error = validationRules.maxMsg || `${fieldLabel} must be no more than ${validationRules.max}.`;
                }
                // Decimal places check for 'number' type if applicable (e.g. for price fields)
                const isDecimalInput = typeof inputProps?.step === 'string' && inputProps.step.includes("0.01");
                if (!error && isDecimalInput) {
                    const decimalPart = stringValToValidate.split('.')[1];
                    if (decimalPart && decimalPart.length > 2) {
                        error = `${fieldLabel} must have up to two decimal places.`;
                    }
                } else if (!error && !isDecimalInput && fieldType === 'number') { // Integer check
                   // Check if the string representation of the number contains a decimal for non-decimal fields
                   if (stringValToValidate.includes('.') && parseFloat(stringValToValidate) % 1 !== 0) {
                        error = `${fieldLabel} must be an integer.`;
                   }
                }
            }
        }
        // URL validation (for type 'url')
        if (!error && fieldType === 'url') {
            try {
                const u = new URL(stringValToValidate);
                if (u.protocol !== "http:" && u.protocol !== "https:") {
                    error = 'URL must start with http:// or https://';
                }
                // The pattern from fieldConfig for URL is now more general ( /^https?:\/\/.+/i )
                if (!error && validationRules.pattern && !validationRules.pattern.test(stringValToValidate)) {
                    error = validationRules.patternMsg || `Invalid URL format for ${fieldLabel}.`;
                }
            } catch (_) {
                error = validationRules.patternMsg || `Invalid URL format for ${fieldLabel}.`;
            }
        }
        // Percentage validation (for text fields representing percentages)
        // fieldType will not be 'number' for these as per current config.
        if (!error && (name.endsWith('_percentage') || name.toLowerCase().includes('percent')) && fieldType !== 'number') {
            const percentPattern = validationRules.pattern || /^(\d{1,2}(\.\d{1,2})?|100)$/; // Simplified default pattern for number part
            const valueForPercentCheck = stringValToValidate.endsWith('%') ? stringValToValidate.slice(0,-1) : stringValToValidate;

            if (!percentPattern.test(valueForPercentCheck) || parseFloat(valueForPercentCheck) > 100 || parseFloat(valueForPercentCheck) < (validationRules.min !== undefined ? validationRules.min : 0) ) {
                 error = validationRules.patternMsg || 'Invalid percentage (e.g., 50, 50.5, or 50%). Value between 0-100 (or as per min/max).';
            } else { // Additional check if pattern is very basic
                const numPart = parseFloat(valueForPercentCheck);
                if (isNaN(numPart) || numPart < (validationRules.min !== undefined ? validationRules.min : 0) || numPart > (validationRules.max !== undefined ? validationRules.max : 100) ) {
                     error = validationRules.patternMsg || `Percentage must be between ${validationRules.min !== undefined ? validationRules.min : 0} and ${validationRules.max !== undefined ? validationRules.max : 100}.`;
                }
            }
        }
    }
    setErrors(prevErrors => ({...prevErrors, [name]: error || null }));
    return !error;
  };

  const internalHandleSubmit = async (event) => {
    event.preventDefault();
    let formIsValid = true;
    const currentSubmitErrors = {};
    let firstErrorField = null;

    for (const config of fieldConfigurations) {
      if (!validateField(config.name, formData[config.name])) {
        formIsValid = false;
        currentSubmitErrors[config.name] = errors[config.name] || (config.validation?.requiredMsg || `${config.label || config.name} is invalid or missing.`);
        if (!firstErrorField) {
            firstErrorField = config.name;
        }
      }
    }
    setErrors(prev => {
        const updatedErrors = {...prev};
        fieldConfigurations.forEach(config => {
            if (currentSubmitErrors[config.name]) {
                updatedErrors[config.name] = errors[config.name] || currentSubmitErrors[config.name];
            } else {
                updatedErrors[config.name] = null;
            }
        });
        return updatedErrors;
    });

    if (formIsValid) {
      const dataToSubmit = { ...formData };

      if (dataToSubmit.allow_dropship_return === 'True') {
        dataToSubmit.allow_dropship_return = true;
      } else if (dataToSubmit.allow_dropship_return === 'False') {
        dataToSubmit.allow_dropship_return = false;
      } else if (dataToSubmit.allow_dropship_return === ''){
        const allowReturnConfig = fieldConfigurations.find(f => f.name === 'allow_dropship_return');
        if(allowReturnConfig && !allowReturnConfig.isMandatory) {
            dataToSubmit.allow_dropship_return = null;
        }
      }

      for (const key in dataToSubmit) {
        if (dataToSubmit.hasOwnProperty(key)) {
          const fieldDef = fieldConfigurations.find(f => f.name === key);

          if (dataToSubmit[key] === '') {
            if (fieldDef && !fieldDef.isMandatory) {
              dataToSubmit[key] = null;
            }
          }

          // Ensure product_year is string (it's type: 'text' in fieldConfig now)
          if (key === 'product_year' && dataToSubmit[key] !== null && dataToSubmit[key] !== undefined) {
            dataToSubmit[key] = String(dataToSubmit[key]);
          }

          // Convert status and condition to integers for backend
          if ((key === 'status' || key === 'condition') && dataToSubmit[key] !== null && dataToSubmit[key] !== undefined && dataToSubmit[key] !== '') {
            const numVal = parseInt(dataToSubmit[key], 10);
            if (!isNaN(numVal)) {
              dataToSubmit[key] = numVal;
            } else {
              console.error(`Failed to parse ${key} ('${dataToSubmit[key]}') to integer for submission.`);
              dataToSubmit[key] = null; // Or handle as error if backend doesn't allow null for this
            }
          }

          // For fields marked as type: 'number' in fieldConfig, parse their string form value to number
          if (fieldDef && fieldDef.type === 'number' && typeof dataToSubmit[key] === 'string' && dataToSubmit[key] !== null) {
            const numVal = parseFloat(dataToSubmit[key]);
            dataToSubmit[key] = isNaN(numVal) ? null : numVal;
          }

          // For percentage fields (which are text input type in fieldConfig)
          if (fieldDef && (key.endsWith('_percentage') || key.toLowerCase().includes('percent')) && fieldDef.type !== 'number') {
            if (typeof dataToSubmit[key] === 'string' && dataToSubmit[key] !== null) {
                const strVal = dataToSubmit[key].trim();
                let numPart;
                if (strVal.endsWith('%')) {
                    numPart = parseFloat(strVal.slice(0, -1));
                } else {
                    numPart = parseFloat(strVal);
                }
                dataToSubmit[key] = isNaN(numPart) ? null : numPart;
            }
          }
        }
      }

      if (onSubmit) {
        try {
            console.log("Submitting data to backend (SKUForm.jsx):", JSON.stringify(dataToSubmit, null, 2));
            await onSubmit(dataToSubmit);
        } catch(apiError) {
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

  const getOptions = (fieldName) => {
    const fieldDef = fieldConfigurations.find(f => f.name === fieldName);
    if (fieldDef && fieldDef.options) {
        return fieldDef.options.map(opt => ({
            ...opt,
            value: String(opt.value)
        }));
    }
    return [];
  };

  return (
    <Box component="form" id={formId} onSubmit={internalHandleSubmit} noValidate sx={{ mt: 0, pt:1 }}>
      <Grid container spacing={2}  direction="column">
        {fieldConfigurations.map((field) => {
          const commonProps = {
            name: field.name,
            value: (field.type === 'select' || field.name === 'status' || field.name === 'condition' || field.name === 'product_year') ?
                   (formData[field.name] !== null && formData[field.name] !== undefined ? String(formData[field.name]) : '')
                   : formData[field.name],
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
                  {field.description && (
                  <Tooltip title={<Typography variant="caption" sx={{display: 'block'}}><strong>Description:</strong> {field.description}<br/>{field.example && <><strong>Example:</strong> {field.example}</>}</Typography>} placement="top" arrow>
                      <InfoIcon style={{ marginLeft: '5px', fontSize: '16px', color: 'action.active', cursor: 'help' }} />
                  </Tooltip>
                  )}
              </Box>
          );

          const xsValue = 12;
          const smValue = 12;
          const mdValue = 12;

          if (field.type === 'select') {
            return (
              <Grid item xs={xsValue} sm={smValue} md={mdValue} key={field.name}>
                <FormControl fullWidth error={commonProps.error}  disabled={isSubmitting} required={field.isMandatory}>
                  <InputLabel id={`${field.name}-label`}>{labelWithTooltip}</InputLabel>
                  <Select
                    labelId={`${field.name}-label`}
                    label={labelWithTooltip}
                    {...commonProps}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {getOptions(field.name).map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                  {errors[field.name] && <Typography color="error" variant="caption" sx={{ pl: '14px', mt: '3px' }}>{errors[field.name]}</Typography>}
                  {!errors[field.name] && field.validation?.staticHelperText && <Typography variant="caption" sx={{ pl: '14px', mt: '3px', color: 'text.secondary' }}>{field.validation.staticHelperText}</Typography>}
                  {!errors[field.name] && !field.validation?.staticHelperText && field.example && <Typography variant="caption" sx={{ pl: '14px', mt: '3px', color: 'text.secondary' }}>e.g. {field.example}</Typography>}
                </FormControl>
              </Grid>
            );
          }

          let MuiTextFieldType = field.type === 'url' ? 'url' : 'text';
          // type='number' in fieldConfig is rendered as MUI type='text' for better UX control
          // product_year is now type='text' in fieldConfig.

          return (
            <Grid item xs={xsValue} sm={smValue} md={mdValue} key={field.name}>
              <TextField
                {...commonProps}
                label={labelWithTooltip}
                InputLabelProps={{ shrink: true }}
                type={MuiTextFieldType}
                multiline={field.type === 'textarea' || field.multiline || false}
                rows={field.type === 'textarea' ? (field.rows || 3) : (field.rows || 1)}
                inputProps={{ ...field.inputProps, maxLength: field.validation?.maxLength }}
                helperText={errors[field.name] ? errors[field.name] : (field.validation?.staticHelperText || (field.example ? `e.g. ${field.example}`: '') || '')}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SKUForm;