package models

import (
	"backend/utils"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/gin-gonic/gin"
)

type Post struct {
	Id            int       `json:"-" orm:";auto;pk"`
	Content       string    `json:"content" orm:";type(text)"`
	Author        *User     `json:"-" orm:"rel(fk)"` // Foreign key to User
	ImageURL      string    `json:"image_url" orm:"size(255);null"`
	LikesCount    int       `json:"likes_count" orm:"default(0)"`
	CommentsCount int       `json:"comments_count" orm:"default(0)"`
	CreatedAt     time.Time `json:"-" orm:"auto_now_add;type(datetime)"`
}

func UploadPost(c *gin.Context) {
	// Retrieve `userID` from context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Parse the multipart form (for handling file uploads)
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10MB max upload size
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	var post Post
	post.Author = &User{Id: userID.(int)}

	// Check if an image file is included
	file, header, err := c.Request.FormFile("image")
	if err == nil { // If image exists
		defer file.Close()

		// Upload the image to S3
		imagePath, err := utils.UploadImageToS3(header)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Image upload failed"})
			return
		}

		// Save the image URL in the post
		post.ImageURL = imagePath
	}

	// Get post content from form data
	post.Content = c.PostForm("content")
	if post.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post content is required"})
		return
	}

	o := orm.NewOrm()
	if _, err := o.Insert(&post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't upload post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Uploaded Successfully"})
}

// func UpdatePost(c *gin.Context) {

// }

func DeletePost(c *gin.Context) {
	postId, err := strconv.Atoi(c.Param("postId")) // Get Id from URL
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		c.Abort()
		return
	}

	// _, err := GetPostById(id)
	o := orm.NewOrm()
	if numRows, err := o.QueryTable("post").Filter("id", postId).Delete(); err != nil || numRows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post not found"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted the Post"})
}

func LoadPostWithId(c *gin.Context) {
	userID, _ := c.Get("userID")

	postId, err := strconv.Atoi(c.Param("postId")) // Get post Id from URL
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		c.Abort()
		return
	}

	o := orm.NewOrm()
	post := Post{Id: postId}

	// ✅ Fetch post with related author details
	err = o.QueryTable("post").Filter("id", postId).RelatedSel().One(&post)
	if err == orm.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	// Check for liked status
	liked := false
	if userID != nil {
		count, err := o.QueryTable("like").Filter("user_id", userID.(int)).Filter("post_id", postId).Count()
		if err != nil {
			c.JSON(http.StatusNoContent, gin.H{"error": "DataBase Error"})
			return
		}
		liked = count > 0
	}
	// var signedUrl string

	signedUrl, _ := utils.GenerateSignedURL(c.Request.Context(), post.ImageURL)

	response := map[string]any{
		"id":             post.Id,
		"content":        post.Content,
		"image_url":      signedUrl,
		"likes_count":    post.LikesCount,
		"comments_count": post.CommentsCount,
		"author":         post.Author.Name,
		"profile_pic":    post.Author.ProfilePic,
		"created_at":     post.CreatedAt,
		"liked":          liked,
	}

	// Return the Post post as JSON
	c.JSON(http.StatusOK, gin.H{
		"data": response,
	})
}

func LoadPosts(c *gin.Context) {

	o := orm.NewOrm()
	var posts []Post

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	lastSeen := c.Query("lastSeen") // Get the timestamp from frontend

	query := o.QueryTable("post").RelatedSel().Limit(limit).OrderBy("-created_at") // Order by latest

	if lastSeen != "" {
		query = query.Filter("created_at__lt", lastSeen) // Load older posts
	}

	_, err := query.All(&posts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Fetch the data"})
		return
	}

	var postIds []int
	signedUrls := make(map[int]string)
	signedProfilePics := make(map[int]string)
	likesMap := make(map[int]bool)

	for _, post := range posts {
		postIds = append(postIds, post.Id)
		likesMap[post.Id] = false
		if post.ImageURL != "" {
			signedUrls[post.Id], err = utils.GenerateSignedURL(c.Request.Context(), post.ImageURL)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to Generate Signed URL for the %d", post.Id)})
				return
			}
			if signedProfilePics[post.Author.Id]=="" {
				if post.Author.ProfilePic != ""{
					signedProfilePics[post.Author.Id], err = utils.GenerateSignedURL(c.Request.Context(), post.Author.ProfilePic)
				} else{ 
					signedProfilePics[post.Author.Id] = "NAN"
				}
			}
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to Generate Signed URL for the %d", post.Id)})
				return
			}
		}
	}

	userID, _ := c.Get("userID")

	if len(postIds) > 0 {
		var likedPostIds []Like
		_, err = o.QueryTable("like").
			Filter("user_id", userID).
			Filter("post_id__in", postIds).
			All(&likedPostIds, "post_id")
		if err == nil {
			for _, likedId := range likedPostIds {
				likesMap[likedId.Post.Id] = true
			}
		}
	}

	// Determine if there are more posts
	hasMore := len(posts) == limit

	// Format response
	var response []map[string]any
	for _, post := range posts {
		response = append(response, map[string]any{
			"id":             post.Id,
			"content":        post.Content,
			"image_url":      signedUrls[post.Id],
			"likes_count":    post.LikesCount,
			"comments_count": post.CommentsCount,
			"author":         post.Author.Name,
			"profile_pic":    signedProfilePics[post.Author.Id],
			"created_at":     post.CreatedAt,
			"liked":          likesMap[post.Id],
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    response,
		"hasMore": hasMore,
	})
}
