package routes

import (
	"backend/controllers"
	"backend/middleware"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetUpRoutesLamda(r *gin.Engine) {
	// r.Use(cors.New(cors.Config{
	// 	AllowOrigins:     []string{"http://localhost:5173"},
	// 	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	// 	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	// 	AllowCredentials: true,
	// 	MaxAge:           12 * time.Hour,
	// }))

	r.GET("/v1", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to simple post API"})
	})

	authRoutes := r.Group("/v1/auth")
	{
		authRoutes.GET("/sign-bucket", utils.SignBucketUrls)
		authRoutes.POST("/register", controllers.Register)
		authRoutes.POST("/login", controllers.Login)
	}

	protected := r.Group("/v1/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		// protected.GET("/get-presigned-url", utils.GeneratePresignedURL)

		protected.GET("/profile", models.ViewUser)
		protected.PUT("/update-profile", models.UpdateUser)
		protected.GET("/posts", models.LoadPosts)
		protected.POST("/uploadpost", models.UploadPost)
		protected.DELETE("/deletepost/:postId", models.DeletePost)
		protected.GET("/post/:postId", models.LoadPostWithId)
		// protected.PUT("/updatepost", models.Updatepost) //WIP

		protected.POST("/:post_id/comment", models.AddComment)
		protected.GET("/allcomments/:post_id", models.ViewAllComments)
		protected.DELETE("/delete-comment/:post_id/:comment_id", models.DeleteComment)

		protected.POST("/like/:post_id", models.LikePost)
		protected.DELETE("/unlike/:post_id", models.UnLikePost)

	}
}
