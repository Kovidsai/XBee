package config

import (
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"

	"github.com/beego/beego/v2/client/orm"
	_ "github.com/go-sql-driver/mysql"
)

type DBSecret struct {
	FinnoConn string `json:"app/finno/conn"`
}

func ConnectDB() {

	secretName := "crd3/finvas/mysql" 
	region := "ap-south-1"

	// Load AWS Config
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		log.Fatal(err)
	}

	// Create AWS Secrets Manager Client
	svc := secretsmanager.NewFromConfig(cfg)

	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"),
	}

	// Retrieve secret
	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		log.Fatal(err.Error())
	}

	// Parse JSON Secret
	var secretData DBSecret
	err = json.Unmarshal([]byte(*result.SecretString), &secretData)
	if err != nil {
		log.Fatal("Failed to parse secret JSON:", err)
	}
	dbConn := secretData.FinnoConn

	orm.RegisterDriver("mysql", orm.DRMySQL)
	err = orm.RegisterDataBase("default", "mysql", dbConn)
	if err != nil {
		log.Fatal("DataBase Connection Failed", err)
	}

	orm.RegisterModel(new(models.User), new(models.Post), new(models.Comment), new(models.Like))
	orm.RunSyncdb("default", false, true)
	fmt.Printf("DataBase Connection Succeded")
}
