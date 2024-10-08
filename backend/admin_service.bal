import ballerina/http;
import ballerina/jwt;
import ballerina/config;
import ballerina/postgresql;

type Admin record{
    string username;
    string password;
    boolean isAdmin= true;
};

postgresql:Client dbClient = check new({
    host: "localhost",
    port: 5432,
    database: "AdminDB",
    user: "postgres",
    password: "hsls5071",
    option:{ssl:{enabled:flase}}
});


jwt:JwtIssure JwtIssure=check new({
    issure:"ballerina",
    audience: "admin",
    subject: "admin-auth",
    privateKeyAlias:"SMTPPrivateKey"
    privateKeyPassword:"hsls5071"
});

//admin login service

service /admin on new http:Listner(9090){
    
}