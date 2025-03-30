package utils

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SignBucketUrls(c *gin.Context) {
	filePath := c.Query("file") // Get file path from query parameter
	if filePath == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File path is required"})
		return
	}

	signedURL, err := GenerateSignedURL(context.TODO(), filePath)
	if err != nil {
		log.Printf("Error generating signed URL: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate signed URL"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"signed_url": signedURL})
}
