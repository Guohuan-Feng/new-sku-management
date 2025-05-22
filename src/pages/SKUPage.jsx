// src/pages/SKUPage.jsx
import React, { useState, useEffect } from 'react';
// 确保 SKUFormComponent 和 SKUList 的导入路径与您的项目结构一致
import SKUFormComponent from '../components/SKUForm'; // 这是 SKUForm.jsx 导出的组件
import SKUList from '../components/SKUList'; // 您的 SKUList 组件
import AIDescriptionGeneratorDialog from '../components/AIDescriptionGeneratorDialog'; // 导入新组件

// 确保 API 函数的导入路径与您的项目结构一致
// 以下为临时模拟 API，请将其替换为您项目中真实的 API 调用
const fetchSKUs = async () => {
  console.log('MOCK API: fetchSKUs called');
  await new Promise(resolve => setTimeout(resolve, 300)); // 模拟 API 延迟
  // 返回三条硬编码数据用于默认显示
  return Promise.resolve([
    { _id: 'sku123', vendor_sku: 'HD-SKU-001', product_name: 'Hardcoded Product Alpha (已加载)', status: '1', category: 'Electronics', dropship_price: '99.99', ats: 10, upc: '123456789012', allow_dropship_return: true, shipping_lead_time: 3, country_of_origin: 'China', title: 'Alpha Product', short_desc: 'This is Alpha', long_desc: 'This is a detailed description for Alpha.', keywords: 'alpha,test,product', key_features_1: 'Feature A1', key_features_2: 'Feature A2', key_features_3: 'Feature A3', key_features_4: 'Feature A4', key_features_5: 'Feature A5', main_image:'https://via.placeholder.com/150', front_image:'https://via.placeholder.com/150', back_image:'https://via.placeholder.com/150', side_image:'https://via.placeholder.com/150', detail_image:'https://via.placeholder.com/150', full_image:'https://via.placeholder.com/150', thumbnail_image:'https://via.placeholder.com/150', size_chart_image:'https://via.placeholder.com/150' },
    { _id: 'sku456', vendor_sku: 'HD-SKU-002', product_name: 'Hardcoded Product Beta (已加载)', status: '0', category: 'Books', dropship_price: '19.50', ats: 5, upc: '234567890123', allow_dropship_return: false, shipping_lead_time: 5, country_of_origin: 'USA', title: 'Beta Product', short_desc: 'This is Beta', long_desc: 'This is a detailed description for Beta.', keywords: 'beta,test,product', key_features_1: 'Feature B1', key_features_2: 'Feature B2', key_features_3: 'Feature B3', key_features_4: 'Feature B4', key_features_5: 'Feature B5', main_image:'https://via.placeholder.com/150', front_image:'https://via.placeholder.com/150', back_image:'https://via.placeholder.com/150', side_image:'https://via.placeholder.com/150', detail_image:'https://via.placeholder.com/150', full_image:'https://via.placeholder.com/150', thumbnail_image:'https://via.placeholder.com/150', size_chart_image:'https://via.placeholder.com/150' },
    { _id: 'sku789', vendor_sku: 'HD-SKU-003', product_name: 'Hardcoded Product Gamma (已加载)', status: '1', category: 'Home Goods', dropship_price: '45.00', ats: 20, upc: '345678901234', allow_dropship_return: true, shipping_lead_time: 2, country_of_origin: 'Vietnam', title: 'Gamma Product', short_desc: 'This is Gamma', long_desc: 'This is a detailed description for Gamma.', keywords: 'gamma,test,product', key_features_1: 'Feature G1', key_features_2: 'Feature G2', key_features_3: 'Feature G3', key_features_4: 'Feature G4', key_features_5: 'Feature G5', main_image:'https://via.placeholder.com/150', front_image:'https://via.placeholder.com/150', back_image:'https://via.placeholder.com/150', side_image:'https://via.placeholder.com/150', detail_image:'https://via.placeholder.com/150', full_image:'https://via.placeholder.com/150', thumbnail_image:'https://via.placeholder.com/150', size_chart_image:'https://via.placeholder.com/150' },
  ]);
};
const createSKU = async (data) => {
  console.log('MOCK API: createSKU called with:', data);
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve({ _id: `new_${Date.now()}`, ...data });
};
const updateSKU = async (id, data) => {
  console.log('MOCK API: updateSKU called for id:', id, 'with:', data);
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve({ _id: id, ...data });
};
// import { fetchSKUs, createSKU, updateSKU } from '../api/sku'; // 使用您真实的API

import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; // AI 图标示例

const SKUPage = () => {
  const [skus, setSkus] = useState([]);
  const [editingSku, setEditingSku] = useState(null);
  const [isSkuFormDialogOpen, setIsSkuFormDialogOpen] = useState(false); // Renamed for clarity
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false); // State for AI Dialog
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [formErrorInDialog, setFormErrorInDialog] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const skuFormId = "sku-dialog-form"; // ID for the main SKU form

  const loadSKUs = async () => {
    setPageLoading(true);
    setPageError(null);
    try {
      const data = await fetchSKUs();
      setSkus(data || []);
    } catch (err) {
      const errorMessage = 'Failed to fetch SKUs: ' + (err.response?.data?.message || err.message);
      setPageError(errorMessage);
      console.error('Error fetching SKUs:', err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadSKUs();
  }, []);

  const handleOpenCreateSkuDialog = () => {
    setEditingSku(null);
    setFormErrorInDialog(null);
    setIsSkuFormDialogOpen(true);
  };

  const handleOpenEditSkuDialog = (sku) => {
    setEditingSku(sku);
    setFormErrorInDialog(null);
    setIsSkuFormDialogOpen(true);
  };

  const handleSkuFormDialogClose = () => {
    if (submitLoading) return;
    setIsSkuFormDialogOpen(false);
    setEditingSku(null);
    setFormErrorInDialog(null);
  };

  const handleActualSkuFormSubmit = async (skuData) => {
    setSubmitLoading(true);
    setFormErrorInDialog(null);
    try {
      if (editingSku && (editingSku._id || editingSku.vendor_sku)) {
        await updateSKU(editingSku._id || editingSku.vendor_sku, skuData);
      } else {
        await createSKU(skuData);
      }
      await loadSKUs();
      handleSkuFormDialogClose();
    } catch (err) {
      const errorMessage = 'Failed to save SKU: ' + (err.response?.data?.message || err.message);
      setFormErrorInDialog(errorMessage);
      console.error('Error saving SKU:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handlers for AI Description Dialog
  const handleOpenAiDialog = () => {
    setIsAiDialogOpen(true);
  };

  const handleCloseAiDialog = () => {
    setIsAiDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SKU Management
      </Typography>

      {pageError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPageError(null)}>{pageError}</Alert>}

      {/* Buttons Container */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateSkuDialog}
          disabled={pageLoading && !skus.length}
        >
          Create New SKU
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<AutoFixHighIcon />}
          onClick={handleOpenAiDialog} // Click handler for AI Dialog
        >
          AI 生成描述
        </Button>
      </Box>


      {pageLoading && skus.length === 0 && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

      <SKUList
        skus={skus}
        onEdit={handleOpenEditSkuDialog}
        // onDelete={handleDeleteAttempt} // 如果您有删除功能，请取消注释并实现
        loading={pageLoading && skus.length === 0}
      />

      {/* Main SKU Form Dialog */}
      <Dialog
        open={isSkuFormDialogOpen}
        onClose={(event, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                if (submitLoading) return; 
            }
            handleSkuFormDialogClose();
        }}
        disableEscapeKeyDown={submitLoading}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editingSku ? 'Edit SKU' : 'Create New SKU'}
          <IconButton
            aria-label="close"
            onClick={handleSkuFormDialogClose}
            disabled={submitLoading}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {formErrorInDialog && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormErrorInDialog(null)}>{formErrorInDialog}</Alert>}
          <SKUFormComponent
            key={editingSku ? `edit-${editingSku._id || editingSku.vendor_sku}` : 'create-new-sku-form-instance'}
            initialData={editingSku}
            onSubmit={handleActualSkuFormSubmit}
            formId={skuFormId}
            isSubmitting={submitLoading}
          />
        </DialogContent>
        <DialogActions sx={{p: '16px 24px'}}>
          <Button onClick={handleSkuFormDialogClose} variant="outlined" disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit" 
            form={skuFormId}  
            disabled={submitLoading} 
          >
            {editingSku ? 'Save Changes' : 'Create SKU'}
            {submitLoading && <CircularProgress size={24} sx={{position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px'}}/>}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Description Generator Dialog */}
      <AIDescriptionGeneratorDialog
        open={isAiDialogOpen}
        onClose={handleCloseAiDialog}
      />
    </Box>
  );
};

export default SKUPage;
