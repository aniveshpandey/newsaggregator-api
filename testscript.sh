#!/bin/sh

curl http://localhost:3000/ ; printf "\n"
curl -X POST -H "Content-Type: application/json" -d '{"email" : "test@test.com" , "password" : "testpassword1234kdfsu354345#@vhkdsjfg" , "privilege" : "admin" }' http://localhost:3000/register/ ; printf "\n"
curl -X POST -H "Content-Type: application/json" -d '{"email" : "test2@test.com" , "password" : "testpassword2asidfuhaksdfhkajsdhf@laisflasd"  }' http://localhost:3000/register/ ; printf "\n"
curl -X POST -H "Content-Type: application/json" -d '{ "privilege" : "normal" }' http://localhost:3000/register/ ; printf "\n"
curl -X POST -H "Content-Type: application/json" -d '{"email" : "test2@test.com" , "password" : "testpassword2asidfuhaksdfhkajsdhf@laisflasd"  }' http://localhost:3000/login/ ; printf "\n"
