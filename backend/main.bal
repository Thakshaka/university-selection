import ballerina/http;
import ballerina/crypto;
import ballerina/time;
import ballerina/uuid;
import ballerina/sql;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;
import ballerina/email;

// Define HTTP client to post data to model
http:Client model = check new ("http://localhost:8000");

// Configure the PostgreSQL connection
configurable string dbHost = "localhost";
configurable string dbName = "university_selection";
configurable string dbUsername = "postgres";
configurable string dbPassword = "1234";
configurable int dbPort = 5432;

// Configure email settings
configurable string smtpHost = "smtp.gmail.com";
configurable string smtpUsername = "thakshakarathnayake15@gmail.com";
configurable string smtpPassword = "";

// Initialize the PostgreSQL client
postgresql:Client dbClient = check new(
    host = dbHost,
    database = dbName,
    username = dbUsername,
    password = dbPassword,
    port = dbPort
);

// Initialize the SMTP client
email:SmtpClient smtpClient = check new (smtpHost, smtpUsername, smtpPassword);

// Record type for Subject
type Subject record {|
    int id;
    string subject_name;
|};

// Record type for District
type District record {|
    int id;
    string district_name;
|};

// Record type for User
type User record {|
    int id;
    string username;
    string email;
    string password_hash;
    string? reset_token;
    time:Civil? reset_token_expires;
|};

// Function to hash a password
isolated function hashPassword(string password) returns string {
    byte[] hashedBytes = crypto:hashSha256(password.toBytes());
    return hashedBytes.toBase16();
}

// Function to register a new user
function registerUser(string username, string email, string password) returns error? {
    string hashedPassword = hashPassword(password);
    sql:ParameterizedQuery query = `
        INSERT INTO users (username, email, password_hash)
        VALUES (${username}, ${email}, ${hashedPassword})
    `;
    _ = check dbClient->execute(query);
}

// Function to authenticate a user
function authenticateUser(string email, string password) returns User|error {
    string hashedPassword = hashPassword(password);
    sql:ParameterizedQuery query = `
        SELECT * FROM users
        WHERE email = ${email} AND password_hash = ${hashedPassword}
    `;
    User|sql:Error result = dbClient->queryRow(query);
    if result is sql:NoRowsError {
        return error("Authentication failed");
    }
    return result;
}

// Function to get all subjects from database
function getSubjects() returns Subject[]|error {
    sql:ParameterizedQuery query = `SELECT * FROM subjects ORDER BY subject_name`;
    stream<Subject, sql:Error?> resultStream = dbClient->query(query);
    
    Subject[] subjects = [];
    check from Subject subject in resultStream
        do {
            subjects.push(subject);
        };
    
    return subjects;
}

// Function to get all districts from database
function getDistricts() returns District[]|error {
    sql:ParameterizedQuery query = `SELECT * FROM districts`;
    stream<District, sql:Error?> resultStream = dbClient->query(query);
    
    District[] districts = [];
    check from District district in resultStream
        do {
            districts.push(district);
        };
    
    return districts;
}

// Function to determine the category based on 3 subject inputs
function getCategory(string subject1, string subject2, string subject3) returns string|error {
    // SQL query to find matching category considering all possible permutations
    sql:ParameterizedQuery query = `
        SELECT category 
        FROM Category_Combinations 
        WHERE 
        -- Check all possible permutations
        (subject1 = ${subject1} AND subject2 = ${subject2} AND subject3 = ${subject3}) OR
        (subject1 = ${subject1} AND subject2 = ${subject3} AND subject3 = ${subject2}) OR
        (subject1 = ${subject2} AND subject2 = ${subject1} AND subject3 = ${subject3}) OR
        (subject1 = ${subject2} AND subject2 = ${subject3} AND subject3 = ${subject1}) OR
        (subject1 = ${subject3} AND subject2 = ${subject1} AND subject3 = ${subject2}) OR
        (subject1 = ${subject3} AND subject2 = ${subject2} AND subject3 = ${subject1})`;

    // Execute query and get result
    stream<record {string category;}, sql:Error?> result = dbClient->query(query);
    
    // Check if we have a matching category
    record {|record {string category;} value;|}|error? firstRow = result.next();
    
    if firstRow is record {|record {string category;} value;|} {
        return firstRow.value.category;
    }
    
    return "Unknown";
}

service /api on new http:Listener(8080) {

    // Forgot Password endpoint
    resource function post forgot\-password(@http:Payload json payload) returns http:Response {
        http:Response response = new;

        do {
            string email = check payload.email;

            // Check if the email exists in the database
            sql:ParameterizedQuery query = `SELECT * FROM users WHERE email = ${email}`;
            User|error result = dbClient->queryRow(query);

            if result is error {
                // Don't reveal if the email exists or not for security reasons
                response.statusCode = 200;
                response.setJsonPayload({"message": "If an account exists for this email, you will receive password reset instructions shortly."});
                return response;
            }

            // Generate a secure random token
            string resetToken = uuid:createType1AsString();

            // Hash the token before storing it
            byte[] resetTokenHash = crypto:hashSha256(resetToken.toBytes());
            string hashedResetToken = resetTokenHash.toBase16();

            // Set expiration time (e.g., 1 hour from now)
            time:Utc expirationTime = time:utcAddSeconds(time:utcNow(), 3600);

            // Store the hashed reset token in the database with an expiration time
            sql:ParameterizedQuery updateQuery = `
                UPDATE users 
                SET reset_token = ${hashedResetToken}, reset_token_expires = ${expirationTime} 
                WHERE email = ${email}
            `;
            _ = check dbClient->execute(updateQuery);

            // Construct the password reset URL
            string resetUrl = "http://localhost:3000/reset-password?token=" + resetToken;

            // Send email with password reset link
            check sendPasswordResetEmail(email, resetUrl);

            response.statusCode = 200;
            response.setJsonPayload({"message": "If an account exists for this email, you will receive password reset instructions shortly."});
        } on fail {
            response.statusCode = 500;
            response.setJsonPayload({"error": "An error occurred while processing your request."});
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // Reset Password endpoint
    resource function post reset\-password(@http:Payload json payload) returns http:Response {
        http:Response response = new;

        do {
            string token = check payload.token;
            string newPassword = check payload.newPassword;

            // Hash the provided token
            byte[] tokenHash = crypto:hashSha256(token.toBytes());
            string hashedToken = tokenHash.toBase16();

            // Check if the token exists and is not expired
            sql:ParameterizedQuery query = `
                SELECT * FROM users 
                WHERE reset_token = ${hashedToken} AND reset_token_expires > CURRENT_TIMESTAMP
            `;
            User|error result = dbClient->queryRow(query);

            if result is error {
                response.statusCode = 400;
                response.setJsonPayload({"error": "Invalid or expired reset token."});
                return response;
            }

            // Hash the new password
            string hashedPassword = hashPassword(newPassword);

            // Update the user's password and clear the reset token
            sql:ParameterizedQuery updateQuery = `
                UPDATE users 
                SET password_hash = ${hashedPassword}, reset_token = NULL, reset_token_expires = NULL 
                WHERE id = ${result.id}
            `;
            _ = check dbClient->execute(updateQuery);

            response.statusCode = 200;
            response.setJsonPayload({"message": "Your password has been successfully reset."});
        } on fail {
            response.statusCode = 500;
            response.setJsonPayload({"error": "An error occurred while resetting your password."});
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for forgot-password endpoint
    resource function options forgot\-password() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for reset-password endpoint
    resource function options reset\-password() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }


    // Logout endpoint
    resource function post logout() returns http:Response {
        http:Response response = new;
        
        // Here we would typically invalidate the session or token
        // For this example, we'll just send a success response
        
        response.setJsonPayload({"message": "Logged out successfully"});
        response.statusCode = 200;
        
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for logout endpoint
    resource function options logout() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // Registration endpoint
    resource function post register(@http:Payload json payload) returns http:Response|error {
        string username = check payload.username;
        string email = check payload.email;
        string password = check payload.password;

        http:Response response = new;

        do {
            check registerUser(username, email, password);
            response.statusCode = 201;
            response.setJsonPayload({"message": "User registered successfully"});
        } on fail var e {
            response.statusCode = 400;
            response.setJsonPayload({"error": e.message()});
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // Login endpoint
    resource function post login(@http:Payload json payload) returns http:Response|error {
        string email = check payload.email;
        string password = check payload.password;

        http:Response response = new;

        do {
            User|error authResult = check authenticateUser(email, password);
            if authResult is User {
                response.statusCode = 200;
                response.setJsonPayload({
                    "message": "Login successful",
                    "user": {
                        "id": authResult.id,
                        "username": authResult.username,
                        "email": authResult.email
                    }
                });
            } else {
                response.statusCode = 401;
                response.setJsonPayload({"error": "Invalid credentials"});
            }
        } on fail {
            response.statusCode = 500;
            response.setJsonPayload({"error": "Internal server error"});
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for register endpoint
    resource function options register() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for login endpoint
    resource function options login() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // Districts endpoint
    resource function get districts() returns http:Response|error {
        District[]|error districts = getDistricts();
        http:Response response = new;
        
        if districts is error {
            response.statusCode = 500;
            response.setPayload({"error": "Failed to fetch districts"});
        } else {
            json[] jsonDistricts = districts.map(function(District district) returns json {
                return {
                    id: district.id,
                    district_name: district.district_name
                };
            });
            response.setJsonPayload(jsonDistricts);
        }
        
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for districts endpoint
    resource function options districts() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // Subjects endpoint
    resource function get subjects() returns http:Response|error {
        Subject[]|error subjects = getSubjects();
        http:Response response = new;
        
        if subjects is error {
            response.statusCode = 500;
            response.setPayload({"error": "Failed to fetch subjects"});
        } else {
            // Convert Subject array to json
            json[] jsonSubjects = subjects.map(function(Subject subject) returns json {
                return {
                    id: subject.id,
                    subject_name: subject.subject_name
                };
            });
            response.setJsonPayload(jsonSubjects);
        }
        
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // CORS preflight handling for subjects endpoint
    resource function options subjects() returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return response;
    }

    // Handle POST request for user input data
    resource function post postUserInputData(http:Caller caller, http:Request req) returns error? {
        // Get JSON payload from request
        json userInputData = check req.getJsonPayload();
        // log:printInfo("Received Data: " + userInputData.toString());

        // Extract values from JSON payload and assign to variables
        string subject1 = check userInputData.subject1;
        string subject2 = check userInputData.subject2;
        string subject3 = check userInputData.subject3;
        string zScore = check userInputData.zScore;
        string year = check userInputData.year;
        string district = check userInputData.district;

        // Get category based on subjects
        string category = check getCategory(subject1, subject2, subject3);

        // Prepare response JSON to Frontend
        json modelRequest = {
            "category": category,
            "district": district,
            "year": year
        };

         // Send data to model and receive response
        http:Response modelRes = check model->post("/predict", modelRequest);

        // Get the response payload from the model
        json modelResponseData = check modelRes.getJsonPayload();

        // Cast modelResponseData to a JSON array
        json[] filteredModelResponseData = [];

        // Parse zScore as a float
        float zScoreValue = check 'float:fromString(zScore);

        //  Filter based on 'this_year_predicted'
        if (modelResponseData is json[]) {
            foreach json obj in modelResponseData {
                float this_year_predicted = check obj.this_year_predicted;
                if (this_year_predicted <= zScoreValue) {
                    filteredModelResponseData.push(obj);
                }
            }
        }

        // Create combined response JSON including both the original and filtered data
        json Response = {
            "modelResponseData": modelResponseData,
            "filteredModelResponseData": filteredModelResponseData,
            "category": category
        };

        // Send response with CORS headers
        http:Response res = new;
        res.setJsonPayload(Response);
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // Send response to the frontend
        check caller->respond(res);
    }

    // Handle preflight OPTIONS request for CORS
    resource function options postUserInputData(http:Caller caller, http:Request req) returns error? {
        // Respond with the appropriate CORS headers
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        check caller->respond(response);
    }
}

// Function to send password reset email
function sendPasswordResetEmail(string toEmail, string resetUrl) returns error? {
    email:Message message = {
        to: [toEmail],
        subject: "Password Reset Instructions",
        body: string `
            Dear User,

            You have requested to reset your password. Please click on the link below to reset your password:

            ${resetUrl}

            This link will expire in 1 hour.

            If you did not request a password reset, please ignore this email.

            Best regards,
            Your Application Team
        `
    };

    check smtpClient->sendMessage(message);
}


