package utils

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid" // Import UUID
)

func UploadImageToS3(file *multipart.FileHeader) (string, error) {
	bucketName := os.Getenv("IMAGEBucketName")
	if bucketName == "" {
		return "", fmt.Errorf("IMAGEBucketName environment variable not set")
	}

	folderName := os.Getenv("IMAGE_FOLDER")
	if folderName == "" {
		return "", fmt.Errorf("IMAGE_FOLDER environment variable not set")
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Generate unique filename
	fileExt := filepath.Ext(file.Filename)
	filename := uuid.New().String() + fileExt
	filePath := fmt.Sprintf("%s/%s", folderName, filename)

	// Load AWS Config
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Println("AWS config error:", err)
		return "", fmt.Errorf("failed to load AWS config")
	}

	s3Client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(s3Client)

	// Upload file to S3
	_, err = uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(filePath),
		Body:   src,
	})
	if err != nil {
		log.Println("S3 Upload error:", err)
		return "", fmt.Errorf("failed to upload image to S3")
	}
	log.Println("file path:", filePath)
	return filePath, nil
}

func GenerateSignedURL(ctx context.Context, objectKey string) (string, error) {
	// Get bucket name from environment variable
	log.Println("Generated Signed URL:", objectKey)
	bucket := os.Getenv("IMAGEBucketName")
	if bucket == "" {
		return "", fmt.Errorf("IMAGEBucketName environment variable not set")
	}

	// Load AWS configuration
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to load AWS config: %v", err)
	}

	// Create S3 client & presigner
	client := s3.NewFromConfig(cfg)
	presigner := s3.NewPresignClient(client)

	// Set expiration time (12 hours)
	expiration := 12 * time.Hour

	// Generate presigned URL
	req, err := presigner.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(objectKey),
	}, s3.WithPresignExpires(expiration))

	if err != nil {
		return "", fmt.Errorf("failed to generate signed URL: %v", err)
	}

	log.Println("Generated Signed URL:", req.URL)
	return req.URL, nil
}
