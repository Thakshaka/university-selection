import ballerinax/mysql;
import ballerina/log;
import ballerina/http;
import ballerina/sql;

mysql:Client dbClient = check new (host = "localhost", // Replace with your MYSQL_HOST
                                   port = 3306, // Replace with your MYSQL_PORT
                                   database = "university_users", // Replace with your MYSQL_DATABASE
                                   user = "root", // Replace with your MYSQL_USER
                                   password = "" // Replace with your MYSQL_PASSWORD
                                   
);
// Define the HTTP service
service /auth on new http:Listener(9090) {

    // Register a new user
    resource function post register(http:Caller caller, http:Request req) returns error? {
        // Handle JSON payload
        any payload = req.getJsonPayload();
        if (payload is error) {
            check caller->respond({ "status": "error", "message": "Invalid JSON payload." });
            return;
        }

        json payloadJson = <json>payload;
        string username = check payloadJson.username.toString();
        string password = check payloadJson.password.toString();

        // Insert the new user into the database
        string insertQuery = "INSERT INTO candidate_users (username, password) VALUES (?, ?)";

        // Execute the query
        sql:ParameterizedQuery query = `INSERT INTO candidate_users (username, password) VALUES (${username}, ${password})`;
        var result = dbClient->execute(query);

        // Check for any database errors (such as unique constraint violations)
        if (result is error) {
            log:printError("Error while registering the user", result);
            check caller->respond({ "status": "error", "message": "User already exists or invalid data." });
        } else {
            check caller->respond({ "status": "success", "message": "User registered successfully." });
        }
    }

    // Authenticate an existing user (Login)
    resource function post login(http:Caller caller, http:Request req) returns error? {
        // Handle JSON payload
        any payload = req.getJsonPayload();
        if (payload is error) {
            check caller->respond({ "status": "error", "message": "Invalid JSON payload." });
            return;
        }

        json payloadJson = <json>payload;
        string username = check payloadJson.username.toString();
        string password = check payloadJson.password.toString();

        // Query to check if the user exists
        sql:ParameterizedQuery selectQuery = `SELECT id FROM candidate_users WHERE username = ${username} AND password = ${password}`;
        var result = dbClient->query(selectQuery);

        if (result is table<record {| int id; |}>) {
            table<record {| int id; |}> userTable = result;
            if (userTable.next()) {
                check caller->respond({ "status": "success", "message": "User authenticated successfully." });
            } else {
                check caller->respond({ "status": "error", "message": "Invalid username or password." });
            }
        } else {
            log:printError("Error while logging in", result);
            check caller->respond({ "status": "error", "message": "Login failed due to a system error." });
        }
    }
}