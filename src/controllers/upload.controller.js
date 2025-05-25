/**
 * Upload controller for handling file uploads
 */

/**
 * Upload product image
 * @route POST /api/upload/product-image
 */
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create URL path for the uploaded file
    const filePath = `/uploads/products/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        path: filePath,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};