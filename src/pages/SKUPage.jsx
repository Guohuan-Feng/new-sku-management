// src/pages/SKUPage.jsx
import React, { useState, useEffect } from 'react';
import SKUFormComponent from '../components/SKUForm'; 
import SKUList from '../components/SKUList'; 
import AIDescriptionGeneratorDialog from '../components/AIDescriptionGeneratorDialog';

// 导入真实的API函数
import { 
  getAllSkus as fetchSKUs, // 将 getAllSkus 重命名为 fetchSKUs 以匹配现有用法
  createSku as apiCreateSku, // 重命名以避免与本地模拟函数（如果存在）冲突
  updateSku as apiUpdateSku, // 重命名
  deleteSku as apiDeleteSku  // 如果您要实现删除功能
} from '../api/sku'; 

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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; 

const SKUPage = () => {
  const [skus, setSkus] = useState([]);
  const [editingSku, setEditingSku] = useState(null);
  const [isSkuFormDialogOpen, setIsSkuFormDialogOpen] = useState(false); 
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false); 
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [formErrorInDialog, setFormErrorInDialog] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const skuFormId = "sku-dialog-form"; 

  const loadSKUs = async () => {
    setPageLoading(true);
    setPageError(null);
    try {
      const response = await fetchSKUs(); // 调用真实的 fetchSKUs (即 getAllSkus)
      setSkus(response.data || []); // 假设后端在 response.data 中返回SKU数组
    } catch (err) {
      const errorMessage = 'Failed to fetch SKUs: ' + (err.response?.data?.message || err.message);
      setPageError(errorMessage);
      console.error('Error fetching SKUs:', err);
      setSkus([]); // 在出错时确保 skus 为空数组
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
    // 确保传递给表单的 editingSku 中的字段与表单期望的字段名和类型一致
    // 例如，如果API返回的 status 是数字，而表单期望是字符串 '0' 或 '1'
    const preparedSku = { ...sku };
    if (typeof preparedSku.status === 'number') {
        preparedSku.status = String(preparedSku.status);
    }
    if (typeof preparedSku.allow_dropship_return === 'boolean') {
        preparedSku.allow_dropship_return = preparedSku.allow_dropship_return ? 'True' : 'False';
    }
    // ... 对其他可能需要转换的字段进行处理 ...
    setEditingSku(preparedSku);
    setFormErrorInDialog(null);
    setIsSkuFormDialogOpen(true);
  };

  const handleSkuFormDialogClose = () => {
    if (submitLoading) return;
    setIsSkuFormDialogOpen(false);
    setEditingSku(null); 
    setFormErrorInDialog(null);
  };

  const handleActualSkuFormSubmit = async (skuDataFromForm) => {
    setSubmitLoading(true);
    setFormErrorInDialog(null);
    
    // skuDataFromForm 已经根据 SKUForm.jsx 中的逻辑处理了空字符串为 null，
    // 并且 allow_dropship_return 也被转换为布尔值。
    // API层的函数现在也期望这样的数据。

    try {
      if (editingSku && (editingSku._id || editingSku.vendor_sku)) {
        // API updateSku 需要 sku_id 作为第一个参数
        const skuIdToUpdate = editingSku._id || editingSku.vendor_sku; // 或者后端期望的特定ID字段
        await apiUpdateSku(skuIdToUpdate, skuDataFromForm);
      } else {
        await apiCreateSku(skuDataFromForm);
      }
      await loadSKUs(); 
      handleSkuFormDialogClose();
    } catch (err) {
      let errorMessage = 'Failed to save SKU';
      if (err.response && err.response.data) {
        if (typeof err.response.data.detail === 'string') {
             errorMessage += `: ${err.response.data.detail}`;
        } else if (Array.isArray(err.response.data.detail)) {
            errorMessage += ': ' + err.response.data.detail.map(d => `${d.loc ? d.loc.join('.')+': ' : ''}${d.msg}`).join('; ');
        } else if (err.response.data.message) {
            errorMessage += `: ${err.response.data.message}`;
        } else {
            try {
                errorMessage += `: ${JSON.stringify(err.response.data)}`;
            } catch (e) {
                // ignore
            }
        }
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      setFormErrorInDialog(errorMessage);
      console.error('Error saving SKU:', err.response || err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSku = async (skuId) => { // 示例删除函数
    if (!skuId) {
        console.error("Cannot delete SKU: ID is missing.");
        setPageError("Cannot delete SKU: ID is missing.");
        return;
    }
    // 可以添加一个确认对话框
    // if (!window.confirm(`Are you sure you want to delete SKU ${skuId}?`)) {
    //   return;
    // }
    setPageLoading(true); // 或者使用一个特定的删除加载状态
    try {
        await apiDeleteSku(skuId);
        await loadSKUs(); // 重新加载列表
        // 可以添加成功提示
    } catch (err) {
        const errorMessage = 'Failed to delete SKU: ' + (err.response?.data?.message || err.response?.data?.detail || err.message);
        setPageError(errorMessage);
        console.error('Error deleting SKU:', err.response || err);
    } finally {
        setPageLoading(false);
    }
  };


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

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateSkuDialog}
          // disabled={pageLoading && !skus.length} // 初始时skus为空，pageLoading为true，可以调整此逻辑
        >
          Create New SKU
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<AutoFixHighIcon />}
          onClick={handleOpenAiDialog} 
        >
          AI Generate Description
        </Button>
      </Box>

      {pageLoading && skus.length === 0 && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

      <SKUList
        skus={skus}
        onEdit={handleOpenEditSkuDialog}
        onDelete={handleDeleteSku} // 传递删除函数
        loading={pageLoading && skus.length === 0} 
      />

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

      <AIDescriptionGeneratorDialog
        open={isAiDialogOpen}
        onClose={handleCloseAiDialog}
      />
    </Box>
  );
};

export default SKUPage;