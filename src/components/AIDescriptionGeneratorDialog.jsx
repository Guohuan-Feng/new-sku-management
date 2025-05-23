// src/components/AIDescriptionGeneratorDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Grid,
  Typography,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchAIDescription } from '../api/aiService';

const AIDescriptionGeneratorDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    brand: '',
    category: '',
    color: '',
    size: '',
    target_people: '', // <--- 更新: target_audience 更改为 target_people
  });
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setFormData({
        product_name: '',
        brand: '',
        category: '',
        color: '',
        size: '',
        target_people: '', // <--- 更新: target_audience 更改为 target_people
      });
      setGeneratedDescription('');
      setError('');
      setIsLoading(false);
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenerateDescription = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedDescription('');

    // 构建与后端 payload 结构一致的对象
    const productInfoForAPI = {
      product_name: formData.product_name, // <--- 更新: 直接使用 product_name
      brand: formData.brand,
      category: formData.category,
      color: formData.color,
      size: formData.size,
      target_people: formData.target_people, // <--- 更新: 直接使用 target_people
    };

    try {
      const result = await fetchAIDescription(productInfoForAPI);
      if (result.error) {
        setError(result.error);
        setGeneratedDescription('');
      } else {
        setGeneratedDescription(result.description || '未能生成描述。');
      }
    } catch (apiError) {
      const message = apiError.message || '调用AI服务时发生未知错误。';
      setError(message);
      setGeneratedDescription(`生成出错: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        AI 辅助生成产品描述
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          disabled={isLoading}
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
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <TextField
                label="产品名称 (Product Name)"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="品牌 (Brand)"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="品类 (Category)"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="颜色 (Color)"
                name="color"
                value={formData.color}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="尺寸 (Size)"
                name="size"
                value={formData.size}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="目标用户/风格 (Target Audience/Style)"
                name="target_people" // <--- 更新: name 属性更改为 target_people
                value={formData.target_people} // <--- 更新: value 绑定到 formData.target_people
                onChange={handleChange}
                fullWidth
                variant="outlined"
                helperText="例如: 年轻人, 商务人士, 户外爱好者"
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateDescription}
                disabled={isLoading || !formData.product_name}
                sx={{ minWidth: 150 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : '生成描述'}
              </Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 1, mb: 1 }}>{error}</Alert>
              </Grid>
            )}

            {generatedDescription && !error && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
                  AI 生成的描述:
                </Typography>
                <TextField
                  value={generatedDescription}
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: '#f9f9f9' }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleCloseDialog} color="primary" variant="outlined" disabled={isLoading}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIDescriptionGeneratorDialog;