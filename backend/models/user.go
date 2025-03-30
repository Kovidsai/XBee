package models

import (
	"backend/utils"
	"net/http"

	"github.com/beego/beego/v2/client/orm"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

/*
	U

*/

type User struct {
	Id         int    `json:"-" orm:"auto;pk"`
	Name       string `json:"name" orm:"size(30)"`
	Email      string `json:"email" orm:"size(100);unique"`
	Password   string `json:"password" orm:"size(100)"`
	ProfilePic string `json:"profile_pic" orm:"size(255);null"`
	Bio        string `json:"bio" orm:"size(500);null"`
}

// Hash the password using bcrypt to protect user privacy
func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	u.Password = string(hashedPassword)
	return nil
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

func ViewUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "UnAuthorized"})
		c.Abort()
		return
	}
	o := orm.NewOrm()
	user := User{Id: userID.(int)}
	err := o.Read(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Couldn't Fetch Profile"})
		c.Abort()
		return
	}
	// var signedUrl string

	signedUrl, _ := utils.GenerateSignedURL(c.Request.Context(), user.ProfilePic)
	response := map[string]any{
		"id":             user.Id,
		"name":     user.Name,
		"bio":          user.Bio,
		"profile_pic":    signedUrl,
	}
	c.JSON(http.StatusOK, gin.H{"data": response})
}

func UpdateUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "UnAuthorized"})
		c.Abort()
		return
	}

	// Fetch user from database
	var input User

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
		input.ProfilePic = imagePath
	}

	input.Name = c.PostForm("name")
	if input.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name is required"})
		return
	}

	input.Bio = c.PostForm("bio")

	user := User{Id: userID.(int)}
	o := orm.NewOrm()
	if err := o.Read(&user); err == orm.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	user.Name = input.Name
	user.Bio = input.Bio
	user.ProfilePic = input.ProfilePic

	// Save updated user to DB
	if _, err := o.Update(&user, "name", "bio", "profile_pic"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}
