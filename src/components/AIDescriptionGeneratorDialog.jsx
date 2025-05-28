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
    target_people: '', // <--- 状态键名已更新
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
        target_people: '', // <--- 状态键名已更新
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

    const productInfoForAPI = {
      product_name: formData.product_name,
      brand: formData.brand,
      category: formData.category,
      color: formData.color,
      size: formData.size,
      target_people: formData.target_people,
    };

    try {
      const result = await fetchAIDescription(productInfoForAPI);
      if (result.error) {
        setError(result.error); // 错误信息可能来自API，可能是英文或中文
        setGeneratedDescription('');
      } else {
        setGeneratedDescription(result.description || 'Failed to generate description.'); // 英文默认信息
      }
    } catch (apiError) {
      const message = apiError.message || 'An unknown error occurred while calling the AI service.'; // 英文错误信息
      setError(message);
      setGeneratedDescription(`Error generating description: ${message}`); // 英文错误信息
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
        AI Assisted Product Description Generation {/* 英文标题 */}
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
                label="Product Name" // 英文标签
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
                label="Brand" // 英文标签
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
                label="Category" // 英文标签
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
                label="Color" // 英文标签
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
                label="Size" // 英文标签
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
                label="Target Audience/Style" // 英文标签
                name="target_people"
                value={formData.target_people}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                helperText="e.g., young adults, business professionals, outdoor enthusiasts" // 英文辅助文本
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Description'} {/* 英文按钮文本 */}
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
                  AI Generated Description: {/* 英文文本 */}
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
          Close {/* 英文按钮文本 */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIDescriptionGeneratorDialog;