import ballerina/http;
// import ballerina/log;
import ballerina/sql;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

// Define HTTP client to post data to model
http:Client model = check new ("http://localhost:8000");

// Configure the PostgreSQL connection
configurable string dbHost = "localhost";
configurable string dbName = "university_selection";
configurable string dbUsername = "postgres";
configurable string dbPassword = "1234";
configurable int dbPort = 5432;

// Initialize the PostgreSQL client
postgresql:Client dbClient = check new(
    host = dbHost,
    database = dbName,
    username = dbUsername,
    password = dbPassword,
    port = dbPort
);

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