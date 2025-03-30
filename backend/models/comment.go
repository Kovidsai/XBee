package models

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/gin-gonic/gin"
)

type Comment struct {
	ID        int       `json:"-" orm:"auto;pk"`
	Content   string    `json:"content" orm:"type(text)"`
	Post      *Post     `json:"-" orm:"rel(fk);on_delete(cascade)"` // Foreign key to Post, this will make sure All Comments are deleted when a post is deleted
	Author    *User     `json:"-" orm:"rel(fk)"`                    // Foreign key to User
	CreatedAt time.Time `json:"-" orm:"auto_now_add;type(datetime)"`
}

/*
	--> Need To add ProfilePic Url While sending data
*/

func AddComment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}
	postID, err := strconv.Atoi(c.Param("post_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Title/Content/Author Missing"})
		c.Abort()
		return
	}
	var comment Comment
	comment.Author = (&(User{Id: userID.(int)}))
	comment.Post = (&(Post{Id: postID}))
	if err := json.Unmarshal(body, &comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Some thing is missing"})
		c.Abort()
		return
	}
	o := orm.NewOrm()

	if _, err := o.Insert(&comment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "couldn't upload post"})
		c.Abort()
		return
	}
	// Update comments count
	_, err = o.QueryTable("post").Filter("id", postID).Update(orm.Params{"comments_count": orm.ColValue(orm.ColAdd, 1)})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment count"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Uploaded Successfully"})
}


func ViewAllComments(c *gin.Context) {
    o := orm.NewOrm()
    
    postId, err := strconv.Atoi(c.Param("post_id")) // Get post ID from URL
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
        return
    }
    
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "15")) // Default limit 15
    lastSeen := c.Query("lastSeen") // Get last seen timestamp from frontend
    
    query := o.QueryTable("comment").RelatedSel().Filter("post_id", postId).Limit(limit).OrderBy("-created_at")
    
    if lastSeen != "" {
        query = query.Filter("created_at__lt", lastSeen) // Fetch older comments
    }
    
    var comments []Comment
    _, err = query.All(&comments)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
        return
    }
    
    // Determine if there are more comments
    hasMore := len(comments) == limit
    
    // Format response
    var response []map[string]any
    for _, comment := range comments {
        response = append(response, map[string]any{
            "id":         comment.ID,
            "content":    comment.Content,
            "author":     comment.Author.Name,
			"profile_pic": comment.Author.ProfilePic,
            "created_at": comment.CreatedAt,
        })
    }
    
    c.JSON(http.StatusOK, gin.H{
        "data":    response,
        "hasMore": hasMore,
    })
}


func DeleteComment(c *gin.Context) {
	commentId, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Comment Id"})
		return
	}

	postID, err := strconv.Atoi(c.Param("post_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	o := orm.NewOrm()
	_, err = o.QueryTable("comment").Filter("id", commentId).Delete()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't Delete Comment"})
	}

	_, err = o.QueryTable("post").Filter("id", postID).Update(orm.Params{"comment_count": orm.ColValue(orm.ColMinus, 1)})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment count"})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
