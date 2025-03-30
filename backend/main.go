package main

import (
	"backend/config"
	"backend/controllers"
	"backend/middleware"
	"backend/models"
	"backend/routes"
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

func SetUpRoutes(r *gin.Engine) {
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

var ginLambda *ginadapter.GinLambda

// func init() {
// 	fmt.Println("Gin cold start")
// 	r := gin.Default()
// 	SetUpRoutes(r)
// 	ginLambda = ginadapter.New(r)
// }

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Println("Received request path:", req.Path) // Debugging
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	LAMBDA_ENV := os.Getenv("LAMBDA_ENV")
	r := gin.Default()

	if  LAMBDA_ENV=="true" {

		// Global CORS Middleware
		r.Use(func(c *gin.Context) {
			c.Header("Access-Control-Allow-Origin", "*")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

			// Handle OPTIONS method (preflight request)
			if c.Request.Method == "OPTIONS" {
				c.AbortWithStatus(200)
				return
			}

			c.Next()
		})

		config.ConnectDB()
		routes.SetUpRoutesLamda(r)
		ginLambda = ginadapter.New(r)
		lambda.Start(Handler)
	} else {
		config.ConnectDBLocal()
		routes.SetUpRoutes(r)
		r.Run(":8080")
	}
}
